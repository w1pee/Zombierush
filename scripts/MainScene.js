import Player from "./Player.js";
import UIScene from "./UI.js";
import Zombie from "./Zombie.js";

export default class MainScene extends Phaser.Scene {
    constructor() {
        super("MainScene");
    }
    preload(){
        //preload of player + zombie class
        Player.preload(this);
        Zombie.preload(this);

        this.load.image('tileset', 'assets/tileset7.png');
        this.load.image('cursor', 'assets/cursor.png');

        //tilemap number 1
        this.load.tilemapCSV('ground', 'assets/TileMaps/tilemap1_ground.csv');
        this.load.tilemapCSV('roofCol', 'assets/TileMaps/tilemap1_roof.csv');
        this.load.tilemapCSV('roof', 'assets/TileMaps/tilemap1_roof2.csv');
    }
    create(){
        
        //tilemaps
        const map = this.make.tilemap({ key: "ground", tileWidth: 16, tileHeight: 16 });
        const map2 = this.make.tilemap({ key: "roofCol", tileWidth: 16, tileHeight: 16 });
        const map3 = this.make.tilemap({ key: "roof", tileWidth: 16, tileHeight: 16 });

        const tileset = map.addTilesetImage("tileset");

        var grnd = map.createLayer(0, tileset);

        this.player = new Player({scene:this,x:640,y:640,texture:'player',frame:'walk_2'});

        var roof2 = map3.createLayer(0, tileset);
        var roof1 = map2.createLayer(0, tileset);

        roof1.setCollisionByExclusion([ -1 ]);
        this.matter.world.convertTilemapLayer(roof1);


        //inputs from the player
        this.player.inputkeys = this.input.keyboard.addKeys({
            up: Phaser.Input.Keyboard.KeyCodes.W,
            down: Phaser.Input.Keyboard.KeyCodes.S,
            left: Phaser.Input.Keyboard.KeyCodes.A,
            right: Phaser.Input.Keyboard.KeyCodes.D,
        });

        this.inputkeys = this.input.keyboard.addKeys({
            out: Phaser.Input.Keyboard.KeyCodes.F,
            in: Phaser.Input.Keyboard.KeyCodes.R,
            kill: Phaser.Input.Keyboard.KeyCodes.E,
            respawn: Phaser.Input.Keyboard.KeyCodes.Q
        });

        //camera setup
        this.camera = this.cameras.main;

        this.camera.startFollow(this.player);
        this.camera.setZoom(4);
        this.camera.setBounds(0, 0, map.widthInPixels, map.heightInPixeawls);
        this.zoom = 3;

        //waves
        this.Wave = 0;

        this.Zombienum = 3;

        this.Zombies = new Array(3);

        for(let i = 0; i < this.Zombies.length; i++){
            this.Zombies[i] = new Zombie({scene:this,x:640,y:640,texture:'zombie'});
        }

        console.log(this.Zombies);
    }
    update(){

        this.player.update();
        
        for(let i = 0; i < this.Zombies.length; i++){
            if (this.Zombies[i] != undefined) {
                this.Zombies[i].update();
            }
        }

        this.events.emit('setValues',this.player.Health, this.Zombienum);

        //Camera Zoom out/in
        const zoomspeed = 0.1;
        const ZoomMax = 8;
        const ZoomMin = 1;

        if (this.inputkeys.out.isDown) {
            if (this.zoom > ZoomMin) {
                this.zoom -= zoomspeed;
            }
        }
        else if(this.inputkeys.in.isDown) {
            if (this.zoom < ZoomMax) {
                this.zoom += zoomspeed;
            }
        }
        this.camera.setZoom(this.zoom);

        //counts the number of zombies
        this.Zombienum = 0;

        for (let i = 0; i < this.Zombies.length; i++) {
            if (this.Zombies[i] != undefined) {
                this.Zombienum++;
            }
        }

        //kills one zombie
        let zmbtokil = this.Zombienum -1;
        if(this.inputkeys.kill.isDown){
            if (this.Zombies[zmbtokil] != undefined) {
                this.Zombies[zmbtokil].destroy();
                this.Zombies[zmbtokil] = undefined;
            }
        }


        //spawns zombie
        if(this.inputkeys.respawn.isDown) {

            //this is the system for spawing zombies
            // it first checks if an undefined spot is avaible and fills that in
            //if not it creates a new spot
            let loop = true;
            let n = 0;
            do{
                if (this.Zombies[n] == undefined) {
                    loop = false;
                    this.Zombies[n] = new Zombie({scene:this,x:640,y:640,texture:'zombie'});
                }
                n++;
                if(n == this.Zombies.length){
                    loop = false;
                    this.Zombies[n] = new Zombie({scene:this,x:640,y:640,texture:'zombie'});
                }
            }
            while(loop == true)
        }

        // this.input.mousePointer.x
        // this.input.mousePointer.y

        // //Zombies:
        // if (this.WaveOver == true) {
        //     this.Zombies = new Array(this.Wave * 10);
        //     for(let i = 0; i < this.Zombies.length; i++){
        //         this.Zombies[i] = new Zombie({scene:this,x:640,y:640,texture:'zombie'});
        //     }
        //     this.WaveOver = false;
        // }
        
        // if (this.Zombies.length == 0){
        //     this.WaveOver = true;
        // }

    } 
} 

 //function for generating random number with min and max value
 function rand(min, max) {
  return Math.round(Math.random() * (max - min) + min);
}

function tst(){
    console.log('success!');
}
