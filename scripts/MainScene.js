import Player from "./Player.js";
import Zombie,{Coin} from "./Zombie.js";
import MyCamera from "./MyCamera.js";
import Func from "./Func.js";
import Map from './MapGen.js';

export default class MainScene extends Phaser.Scene {
    constructor() {
        super({key: "MainScene"});
    }
    init(data){
        this.HighScore = data.highscore;
    }
    preload(){
        //preload of player + zombie class
        Player.preload(this);
        Zombie.preload(this);
        Coin.preload(this);

        this.load.audio('audio_stepgrass', 'assets/Sounds/running-in-grass.mp3');

        //Plugin for Camera blur
        this.load.plugin('rexkawaseblurpipelineplugin', 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexkawaseblurpipelineplugin.min.js', true);

        //loading images
        this.load.image('cursor', 'assets/cursor.png');

        //loading Tilesets
        this.load.image('groundTileset', 'assets/tileset8-ground.png')
        this.load.image('OtherTileset', 'assets/tileset8-otherStuff.png')
    }
    create(){

        //Generating the map
        this.GenerateMap();

        //Setup for the Path-finding system
        this.pathfinder = new EasyStar.js();
        this.pathfindersetup();
        //----------------------------------------------------------------

        //player creation
        console.log(this.grid);

        let PlayerXSpawn;
        let PlayerYSpawn;

        do{
            PlayerXSpawn = Func.rand(20,80);
            PlayerYSpawn = Func.rand(20,80);
        }
        while(this.grid[PlayerYSpawn][PlayerXSpawn] != -1);

        this.player = new Player({scene:this,x:Math.floor(PlayerXSpawn * 16) + 8,y:Math.floor(PlayerYSpawn * 16) + 8,texture:'default_player1'});     
        this.EntityLayer.add([this.player]);
        

        //inputs from the player
        this.player.inputkeys = this.input.keyboard.addKeys({
            up: Phaser.Input.Keyboard.KeyCodes.W,
            down: Phaser.Input.Keyboard.KeyCodes.S,
            left: Phaser.Input.Keyboard.KeyCodes.A,
            right: Phaser.Input.Keyboard.KeyCodes.D,
            Dash:  Phaser.Input.Keyboard.KeyCodes.E
        });
        //----------------------------------------------------------------

        this.inputkeys = this.input.keyboard.addKeys({
            pause: Phaser.Input.Keyboard.KeyCodes.ESC
        });

        //camera setup
        this.wit =  window.innerWidth;
        this.hit =  window.innerHeight;

        this.cam = new MyCamera(this,0,0,this.wit,this.hit);
        this.cameras.addExisting(this.cam);
        this.cameras.main = this.cam;

        //Camera follow
        this.cameras.main.follow(this.player)
        //----------------------------------------------------------------

        //waves
        this.Wave = 0;
        this.Zombienum;
        this.Spawnnum;
        this.Zombies = new Array();

        this.Score = 0;
        //----------------------------------------------------------------

        //cursor
        this.input.setDefaultCursor('url(assets/cursor.png), pointer');

        this.cursorCords = [];
        //----------------------------------------------------------------

        //Filters Plugin
        this.pipelineInstance = this.plugins.get('rexkawaseblurpipelineplugin');
        //----------------------------------------------------------------

        //here are all the collions the game listens for listed
        this.checkCollisions();
    }

    update(){
        //update of Player + Zombies + UI
        this.player.update();

        //updates the Zombie
        for(let i = 0; i < this.Zombies.length; i++){
            if (this.Zombies[i] != undefined) {
                this.Zombies[i].update(this);
            }
        }
        //updates UI
        this.events.emit('setValues', this.Zombienum,this.Score,this.player.Stamina,this.HighScore);
        //----------------------------------------------------------------

        //This Calculates the position of the Cursor in the world, using positon of the camera
        //first i take the cords of the camera X & Y, then i add the ones from the cursor to it
        //i do the -640 / -400, because the center of these coordinates is in the center
        //but the coordinates of the game start at the top-left
        //so i have to add/subtract half of the Viewport length to align them
        this.cursorCords.x = Math.round(this.cameras.main.scrollX)+(this.wit/2) + ((this.input.mousePointer.x - this.wit/2)/3)+3;
        this.cursorCords.y = Math.round(this.cameras.main.scrollY)+(this.hit/2) + ((this.input.mousePointer.y - this.hit/2)/3) - 22; //the cors are a bit offset, idk why, but this fixes it
        //----------------------------------------------------------------
        
        //Pauses the game
        if(this.inputkeys.pause.isDown){
            //Delete UI
            this.scene.stop("UIScene");
            //Game Pause
            this.pipelineInstance.add(this.cameras.main, {blur: 4});
            this.scene.launch('Pause')
            this.scene.pause();
        }
        //----------------------------------------------------------------

        //counts the number of zombies
        this.Zombienum = 0;

        for (let i = 0; i < this.Zombies.length; i++) {
            if (this.Zombies[i] != undefined) {
                this.Zombienum++;
            }
        }
        //----------------------------------------------------------------

        //Wave
        //calculates based on the current Wave the amounts of zombies to spawn
        //then spawns them
        if(this.Zombienum == 0){
            this.Wave += 1;

            //5 ℯ^(((1)/(5)) x)

            let euler = 2.718;

            let exponent = this.Wave *  0.2;

            this.Spawnnum = Math.floor(5 * (Math.pow(euler,exponent)));
            this.events.emit('announce', this.Wave);

            if(this.Wave % 2 == 0){
                this.ZombieSpeed*= 1.2;
                this.player.firerate++;
                this.player.DashCooldown*=0.8;
                this.events.emit('StatsUpgrade');
            }
        }
        //----------------------------------------------------------------
        
        //it seperatly spawns the zombies, so it doesnt spawn every zombie in one frame
        //this drastically improves performance, as the game does not have to wait for every zombie to spawn to start the next frame
        if(this.Spawnnum > 1){
            //this is the system for spawing zombies
            //it first checks if an undefined spot is avaible and fills that in
            //if not it creates a new spot
            let loop = true;
            let n = 0;
            do{
                if (this.Zombies[n] == undefined) {
                    loop = false;
                    this.SpawnZombie(n);
                    break;
                }
                n++;
                if(n == this.Zombies.length){
                    loop = false;
                    this.SpawnZombie(n);
                }
            }
            while(loop)
            this.Spawnnum--;
        }
        //----------------------------------------------------------------

        //checking if any Zombies are dead
        for (let i = 0; i < this.Zombies.length; i++) {
            if (this.Zombies[i] != undefined) {
                if(this.Zombies[i].Health <= 0){

                    //generating coin with random value
                    const x = this.Zombies[i].x;
                    const y = this.Zombies[i].y;
                    let value;

                    switch(Func.rand(0,9)){
                        case 0:
                        case 1:
                        case 2:
                        case 3:
                        case 4:
                        case 5: value = '10';break;
                        case 6: 
                        case 7: 
                        case 8: value = '25';break
                        case 9: value = '75';
                        default:
                    }
                    let coin = new Coin({scene:this,x:x,y:y,texture:value});
                    coin.setCollisionGroup(-1);
                    coin.setScale(0.75);
                    coin.setOrigin(0.5,0.5);
                    this.EntityLayer.add([coin]);

                    //deleting Zombie
                    this.Zombies[i].healthTxt.destroy();
                    this.Zombies[i].destroy();
                    this.Zombies[i] = undefined;
                }
            }
        }
        //set HighScore
        if (this.Score > this.HighScore) {
            this.HighScore = this.Score;
        }
    }
    //----------------------------------------------------------------

    //here are all the collisons and its actions listed     //best way of doing it i could come up with since phaser.io is down
    checkCollisions(){
        this.matter.world.on('collisionstart', (event,bodyA,bodyB) => 
        {
            //Player DmgSensor label:   DmgSensor      
            //Bullet Collider label:    BulletCollider
            //Zombie Collider label:    ZombieCollider
            //Coin Collider label:      CoinSensor

            //so bullet will always be destroyed on impact
            if (bodyB.label == 'BulletCollider'){
                bodyB.gameObject.destroy();
            }
            //----------------------------------------------------------------

            //if bullet and zombie, zombie health - player damage
            if (bodyB.label == 'BulletCollider' && bodyA.label == 'ZombieSensor'){
                bodyA.gameObject.takeDamage(this.player.Damage);
            }

            if (bodyA.label == 'DmgSensor' && bodyB.label == 'ZombieCollider' || bodyB.label == 'DmgSensor' && bodyA.label == 'ZombieCollider') {
                //Delete UI
                this.scene.stop("UIScene");
                //launch GameOver scene
                this.scene.launch('GameOver', { highscore: this.HighScore, score: this.Score});
                this.scene.stop();

                //insert HighScore into Database here
            }

            if(bodyA.label == 'playerCollider' && bodyB.label == 'CoinSensor'){
                this.Score+= bodyB.gameObject.value();
                bodyB.gameObject.destroy();
            }
        });
    }
    GenerateMap(){
        const Generation = Map.PerlinNoise(100,100,16,1);
        const buildings = Map.buildings(100,100);

        var grnd = Generation;
        for (let i = 0; i < 100; i++) {
            for (let j = 0; j < 100; j++) {
                
                const value = Math.floor(grnd[i][j] *10);
                let set;
                const offset = Math.round(Math.random()*3) * 15;

                switch(value){
                    case 0: set = 0; break;
                    case 1: set = 0; break;
                    case 2: set = 0; break;
                    case 3: set = 0; break;
                    case 4: set = 1; break;
                    case 5: set = 2; break;
                    case 6: set = 3; break;
                    case 7: set = 4; break;
                    case 8: set = 4; break;
                    case 9: set = 4; break;
                }
                grnd[i][j] = set + offset;
            }
        }
        //Ground layer
        const groundMap = this.make.tilemap({data:grnd, tileWidth:16, tileHeight:16});
        const tiles1 = groundMap.addTilesetImage("groundTileset");
        const layer1 = groundMap.createLayer(0,tiles1,0,0);
        //----------------------------------------------------------------

        //Building layer
        const CollisionMap = this.make.tilemap({data:buildings, tileWidth:16, tileHeight:16});
        const tiles2 = CollisionMap.addTilesetImage("OtherTileset");
        this.layer2 = CollisionMap.createLayer(0,tiles2,0,0);

        //collision
        this.layer2.setCollisionByExclusion([-1,0,1,2,3,4,15,17,18,19,30,31,32]);
        this.matter.world.convertTilemapLayer(this.layer2);
        //----------------------------------------------------------------

        //Layers
        this.DefaultLayer = this.add.layer();
        this.EntityLayer = this.add.layer();
        this.DetailLayer = this.add.layer();

        this.DefaultLayer.add([layer1]);
        this.DetailLayer.add([this.layer2]);
        //----------------------------------------------------------------
    }
    pathfindersetup(){
        //function looks at the tile and returns the index
        this.TileID = function(x,y){
            var tile = this.layer2.getTileAt(x,y);
            if(tile == null){
                return -1;
            }
            return tile.index;
        }
        //----------------------------------------------------------------

        this.grid = [];

        //generates a grid for the pathfinding algorithmen
        for (let y = 0; y < 100; y++) {
            var col = [];
            for (let x = 0; x < 100; x++) {
                col.push(this.TileID(x,y));
            }
            this.grid.push(col);
        }
        this.pathfinder.setGrid(this.grid);
        //searches for walkable tiles
        var acceptable = [-1,0,1,2,3,4,15,17,18,19,30,31,32];
        
        this.pathfinder.setAcceptableTiles(acceptable);
        this.pathfinder.enableSync();
        this.pathfinder.setIterationsPerCalculation(5);
        this.pathfinder.enableDiagonals();
    }
    SpawnZombie(n){
        let SpawnX;
        let SpawnY;

        const radius = 25;  //the number of tiles the game spawns zombies away from the player

        const PlayerX = this.player.y /16;
        const PlayerY = this.player.x /16;

        do{
            //random radian
            let radian = Math.PI * Math.random()*2;

            //Vecor based on the radian
            var Vector = new Phaser.Math.Vector2();
            Vector.x = Math.cos(radian);
            Vector.y = Math.sin(radian);

            //scaling the vecor to the radius
            Vector.x*=radius;
            Vector.y*=radius;
            //adding the Vector to the player position
            SpawnX = PlayerX + Vector.x;
            SpawnY = PlayerY + Vector.y;

            console.log([SpawnX,SpawnY]);
        }
        while(SpawnX < 1 || SpawnX > 99 || SpawnY < 1 ||  SpawnY > 99 || this.grid[Math.floor(SpawnX)][Math.floor(SpawnY)] != -1);

        this.Zombies[n] = new Zombie({scene:this,texture:'default_zombiedino1',x:(SpawnY*16),y:(SpawnX*16)}); 
        this.EntityLayer.add([this.Zombies[n]]);
    }
}