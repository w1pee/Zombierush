import Player from "./Player.js";
import Zombie from "./Zombie.js";
import MyCamera from "./MyCamera.js";

export default class MainScene extends Phaser.Scene {
    constructor() {
        super({key: "MainScene"});
    }
    preload(){
        //preload of player + zombie class
        Player.preload(this);
        Zombie.preload(this);

        this.load.audio('audio_stepgrass', 'assets/Sounds/running-in-grass.mp3');

        //Plugin for Camera blur
        this.load.plugin('rexkawaseblurpipelineplugin', 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexkawaseblurpipelineplugin.min.js', true);

        //loading images
        this.load.image('cursor', 'assets/cursor.png');

        //loading Tilesets
        this.load.image('groundTileset', 'assets/tileset8-ground.png')
        this.load.image('OtherTileset', 'assets/tileset8-otherStuff.png')

        //loading tilemaps
        this.load.tilemapTiledJSON('map','assets/TileMaps/tilemap.json');
    }
    create(){

        this.pathfinder = new EasyStar.js();
        this.GenerateMap();

        //player creation
        this.player = new Player({scene:this,x:640,y:400,texture:'player'});

        //inputs from the player
        this.player.inputkeys = this.input.keyboard.addKeys({
            up: Phaser.Input.Keyboard.KeyCodes.W,
            down: Phaser.Input.Keyboard.KeyCodes.S,
            left: Phaser.Input.Keyboard.KeyCodes.A,
            right: Phaser.Input.Keyboard.KeyCodes.D,
            Dash:  Phaser.Input.Keyboard.KeyCodes.E
        });

        this.inputkeys = this.input.keyboard.addKeys({
            kill: Phaser.Input.Keyboard.KeyCodes.E,
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
        this.Zombiehealth = 20;
        this.Zombies = new Array();
        this.ZombieSpeed = 0.5;

        this.HighScore = 0;
        this.Score = 0;
        //----------------------------------------------------------------

        //cursor
        this.input.setDefaultCursor('url(assets/cursor.png), pointer');

        this.cursorCords = [];
        //----------------------------------------------------------------

        //Filters Plugin
        this.pipelineInstance = this.plugins.get('rexkawaseblurpipelineplugin');
        //----------------------------------------------------------------
        this.checkCollisions();

        this.pathfindersetup();
    }

    update(){
        //update of Player + Zombies + UI
        this.player.update(this);

        //updates the Zombie
        for(let i = 0; i < this.Zombies.length; i++){
            if (this.Zombies[i] != undefined) {
                this.Zombies[i].update(this);
            }
        }
        //updates UI
        this.events.emit('setValues', this.Zombienum,this.Score,this.player.Dashcheck,this.HighScore);
        //----------------------------------------------------------------

        //This Calculates the position of the Cursor in the world, using positon of the camera
        //first i take the cords of the camera X & Y, then i add the ones from the cursor to it
        //i do the -640 / -400, because the center of these coordinates is in the center
        //but the coordinates of the game start at the top-left
        //so i have to add/subtract half of the Viewport length to align them
        this.cursorCords[0] = Math.round(this.cameras.main.scrollX)+(this.wit/2) + ((this.input.mousePointer.x - this.wit/2)/3)+3;
        this.cursorCords[1] = Math.round(this.cameras.main.scrollY)+(this.hit/2) + ((this.input.mousePointer.y - this.hit/2)/3) - 22; //the cors are a bit offset, idk why, but this fixes it
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
            this.Wave++;

            //5 ℯ^(((1)/(5)) x)

            let euler = 2.718;

            let exponent = this.Wave *  0.2;

            this.Spawnnum = Math.round(5 * (Math.pow(euler,exponent)));
            
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
                }
                n++;
                if(n == this.Zombies.length){
                    loop = false;
                    this.SpawnZombie(n);
                }
            }
            while(loop == true)
            this.Spawnnum--;
        }
        //----------------------------------------------------------------

        //checking if any Zombies are dead
        for (let i = 0; i < this.Zombies.length; i++) {
            if (this.Zombies[i] != undefined) {
                if(this.Zombies[i].Health <= 0){
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

            //so bullet will always be destroyed on impact
            if(bodyA.label == 'BulletCollider' && bodyB.label != 'ZombieSensor'){
                bodyA.gameObject.destroy()
            }
            else if (bodyB.label == 'BulletCollider' && bodyA.label != 'ZombieSensor'){
                bodyB.gameObject.destroy();
            }
            //----------------------------------------------------------------

            //if bullet and zombie, zombie health - player damage
            if(bodyA.label == 'BulletCollider' && bodyB.label == 'ZombieCollider'){
                bodyB.gameObject.takeDamage(this.player.Damage);
                if(bodyB.gameObject.Health <= 0){
                    this.Score+=10;
                }
            }
            else if (bodyB.label == 'BulletCollider' && bodyA.label == 'ZombieCollider'){
                bodyA.gameObject.takeDamage(this.player.Damage);
                if(bodyA.gameObject.Health <= 0){
                    this.Score+=10;
                }
            }
            else{
                if (bodyA.label == 'DmgSensor' && bodyB.label == 'ZombieCollider' || bodyB.label == 'DmgSensor' && bodyA.label == 'ZombieCollider') {
                    //Delete UI
                    this.scene.stop("UIScene");
                    //launch GameOver scene
                    this.scene.launch('GameOver');
                    this.scene.stop();

                    //insert HighScore into Database here
                }
            }
        });
    }
    GenerateMap(){
        //tilemaps
        this.map = this.make.tilemap({key:'map'});
        //tileset
        this.GroundLayer = this.map.addTilesetImage('tileset8-ground','groundTileset');
        this.OtherLayer = this.map.addTilesetImage('tileset8-otherStuff', 'OtherTileset');

        //layer 1   (ground)
        this.layer1 = this.map.createLayer('ground',this.GroundLayer,0,0);
        //layer 2   (foreground)
        this.layer2 = this.map.createLayer('other',this.OtherLayer,0,0);
        this.layer2.setCollisionByProperty({collides:true});
        this.matter.world.convertTilemapLayer(this.layer2);

        //layer3    (another foreground)
        this.layer3 = this.map.createLayer('other2',this.OtherLayer,0,0);
        this.layer3.setCollisionByProperty({collides: true});
        this.matter.world.convertTilemapLayer(this.layer3);
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
        for (let y = 0; y < this.map.height; y++) {
            var col = [];
            for (let x = 0; x < this.map.width; x++) {
                col.push(this.TileID(x,y));
            }
            this.grid.push(col);
        }
        this.pathfinder.setGrid(this.grid);
        //searches for walkable tiles
        var Tileset = this.map.tilesets[1];
        var properties  = Tileset.tileProperties;
        var acceptable = [];

        for (let i = 0; i < this.map.tilesets[1].total; i++) {
            if(!properties.hasOwnProperty(i)){
                acceptable.push(i);
            }
        }
        this.pathfinder.setAcceptableTiles(-1);
        this.pathfinder.enableSync();
    }
    SpawnZombie(n){
        let SpawnPos = [0,0];
        do{
            SpawnPos[0] = rand(5,1595);
            SpawnPos[1] = rand(5,1595);
        }
        while(this.layer2.getTileAt(SpawnPos[0],SpawnPos[1]) == -1);
        this.Zombies[n] = new Zombie({scene:this,texture:'zombie',Health: this.Zombiehealth,Speed: this.ZombieSpeed,x:SpawnPos[0],y:SpawnPos[1]});
    }
}

//function for generating random number with min and max value
function rand(min, max) {
    return Math.round(Math.random() * (max - min) + min);
}
//----------------------------------------------------------------