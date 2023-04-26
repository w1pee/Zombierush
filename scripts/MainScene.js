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
        this.load.image('tilesetGround', 'assets/tileset8-ground.png');
        this.load.image('tilesetOther', 'assets/tileset8-otherStuff.png');
        this.load.image('tilesetRoof', 'assets/tileset8-roof.png')
        this.load.image('cursor', 'assets/cursor.png');

        //tilemap number 1
        this.load.tilemapCSV('ground', 'assets/TileMaps/tilemap1_ground.csv');
        this.load.tilemapCSV('Col', 'assets/TileMaps/tilemap1_col.csv');
        this.load.tilemapCSV('extras', 'assets/TileMaps/tilemap1_extra.csv');
    }
    create(){
        //tilemaps
        this.map = this.make.tilemap({ key: "ground", tileWidth: 16, tileHeight: 16 });
        this.map2 = this.make.tilemap({ key: "Col", tileWidth: 16, tileHeight: 16 });
        this.map3 = this.make.tilemap({ key: "extras", tileWidth: 16, tileHeight: 16 });

        const tilesetGround = this.map.addTilesetImage("tilesetGround");
        const tilesetOther = this.map.addTilesetImage("tilesetOther");
        const tilesetRoof = this.map.addTilesetImage("tilesetRoof");

        this.Ground = this.map.createLayer(0, tilesetGround);

        //player creation
        this.player = new Player({scene:this,x:640,y:400,texture:'player',frame:'walk_2'});

        this.extra = this.map3.createLayer(0, tilesetOther);
        this.Collision = this.map2.createLayer(0, tilesetOther);

        this.Collision.setCollisionByExclusion([ -1 ]);
        this.matter.world.convertTilemapLayer(this.Collision);

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
        this.Spawnnum = 5;
        this.Zombiehealth = 20;
        this.Zombies = new Array();
        this.ZombieSpeed = 0.5;

        this.Score = 0;
        //----------------------------------------------------------------

        //cursor
        this.input.setDefaultCursor('url(assets/cursor.png), pointer');

        this.cursorCords = [];
        //----------------------------------------------------------------

        //Filters Plugin
        this.pipelineInstance = this.plugins.get('rexkawaseblurpipelineplugin');
        //----------------------------------------------------------------
        this.checkCollisions(this);
    }

    update(){
        //update of Player + Zombies + UI
        this.player.update(this);

        //updates the Zombie
        for(let i = 0; i < this.Zombies.length; i++){
            if (this.Zombies[i] != undefined) {
                this.Zombies[i].update(this.player);
            }
        }
        //updates UI
        this.events.emit('setValues', this.Zombienum,this.Score,this.player.Dashcheck);
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
            this.Spawnnum = (2*(this.Wave+1)) * rand(1,3);
            this.Wave++;
            
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
        //this drastically improves performence, as the game does not have to wait for every zombie to spawn to start the next frame
        if(this.Spawnnum > 0){
            this.spawn(this.Zombiehealth,this.ZombieSpeed);
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
    }
    //----------------------------------------------------------------

    //spawns zombie
    spawn(health,Speed){
        //generates random number for spawn location of the zombie
        //need to improve later
        let xspawn;
        let yspawn;
        let check;

        do{
            xspawn = rand(0,1280);
            yspawn = rand(0,1280);
        
            //check x
            if(xspawn > this.player.x-300 && xspawn < this.player.x+300){
                //check y
                if(yspawn > this.player.y-300 && yspawn < this.player.y+300){
                check = true;
                }
                else{
                    check = false;
                }
            }
            else{
                check = false;
            }
        }
        while(check == true);
        //----------------------------------------------------------------

        //this is the system for spawing zombies
        //it first checks if an undefined spot is avaible and fills that in
        //if not it creates a new spot
        let loop = true;
        let n = 0;
        do{
            if (this.Zombies[n] == undefined) {
                loop = false;
                this.Zombies[n] = new Zombie({scene:this,x:xspawn,y:yspawn,texture:'zombie'},health,Speed);
            }
            n++;
            if(n == this.Zombies.length){
                loop = false;
                this.Zombies[n] = new Zombie({scene:this,x:xspawn,y:yspawn,texture:'zombie'},health,Speed);
            }
        }
        while(loop == true)
        //----------------------------------------------------------------
    }
    //----------------------------------------------------------------

    //here are all the collisons and its actions listed     //best way of doing it i could come up with since phaser.io is down
    checkCollisions(scene){
        this.matter.world.on('collisionstart', (event,bodyA,bodyB) => 
        {
            //Player DmgSensor label:   DmgSensor      
            //Bullet Collider label:    BulletCollider
            //Zombie Collider label:    ZombieCollider


            //so bullet will always be destroyed on impact
            if(bodyA.label == 'BulletCollider'){
                bodyA.gameObject.destroy()
            }
            else if (bodyB.label == 'BulletCollider'){
                bodyB.gameObject.destroy();
            }
            //----------------------------------------------------------------

            //if bullet and zombie, zombie health - player damage
            if(bodyA.label == 'BulletCollider' && bodyB.label == 'ZombieCollider'){
                bodyB.gameObject.Health -= this.player.Damage;
                if(bodyB.gameObject.Health <= 0){
                    this.Score+=10;
                }
            }
            else if (bodyB.label == 'BulletCollider' && bodyA.label == 'ZombieCollider'){
                bodyA.gameObject.Health -= this.player.Damage;
                if(bodyA.gameObject.Health <= 0){
                    this.Score+=10;
                }
            }
            else{
                if (bodyA.label == 'DmgSensor' && bodyB.label == 'ZombieCollider') {
                    //Delete UI
                    scene.scene.stop("UIScene");
                    //launch GameOver scene
                    scene.scene.launch('GameOver');
                    scene.scene.stop();
                }
                else if(bodyB.label == 'DmgSensor' && bodyA.label == 'ZombieCollider'){
                    //Delete UI
                    scene.scene.stop("UIScene");
                    //launch GameOver scene
                    scene.scene.launch('GameOver');
                    scene.scene.stop();
                }
            }
        });
    }
}
//----------------------------------------------------------------

//function for generating random number with min and max value
function rand(min, max) {
    return Math.round(Math.random() * (max - min) + min);
}
//----------------------------------------------------------------