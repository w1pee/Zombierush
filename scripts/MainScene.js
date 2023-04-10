import Player from "./Player.js";
import Zombie from "./Zombie.js";

export default class MainScene extends Phaser.Scene {
    constructor() {
        super("MainScene");
    }
    preload(){
        
        Player.preload(this);
        Zombie.preload(this);

        this.load.image('tileset', 'assets/tileset7.png');

        //tilemap number 1
        this.load.tilemapCSV('ground', 'assets/TileMaps/tilemap1_ground.csv');
        this.load.tilemapCSV('roofCol', 'assets/TileMaps/tilemap1_roof.csv');
        this.load.tilemapCSV('roof', 'assets/TileMaps/tilemap1_roof2.csv');
    }
    create(){
        console.log('create');


        //tilemaps
        const map = this.make.tilemap({ key: "ground", tileWidth: 16, tileHeight: 16 });
        const map2 = this.make.tilemap({ key: "roofCol", tileWidth: 16, tileHeight: 16 });
        const map3 = this.make.tilemap({ key: "roof", tileWidth: 16, tileHeight: 16 });

        const tileset = map.addTilesetImage("tileset");

        var grnd = map.createLayer(0, tileset);

        this.player = new Player({scene:this,x:640,y:640,texture:'player',frame:'walk_2'});

        this.tstZombie = new Zombie({scene:this,x:640,y:640,texture:'zombie'});

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
            out: Phaser.Input.Keyboard.KeyCodes.F,
            in: Phaser.Input.Keyboard.KeyCodes.R,
        });

        this.inputkeys = this.input.keyboard.addKeys({
            up: Phaser.Input.Keyboard.KeyCodes.W,
            down: Phaser.Input.Keyboard.KeyCodes.S,
            left: Phaser.Input.Keyboard.KeyCodes.A,
            right: Phaser.Input.Keyboard.KeyCodes.D,
            out: Phaser.Input.Keyboard.KeyCodes.F,
            in: Phaser.Input.Keyboard.KeyCodes.R,
        });
        //camera setup
        this.camera = this.cameras.main;

        this.camera.startFollow(this.player);
        this.camera.setZoom(4);
        this.camera.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
        this.zoom = 3;

    }

    
    update(){
        this.player.update();

        const zoomspeed = 0.1;
        const ZoomMax = 9;
        const ZoomMin = 1;

        if (this.inputkeys.out.isDown) {
            if (this.zoom > ZoomMin) {
                this.zoom -= zoomspeed;;
            }
        }
        else if(this.inputkeys.in.isDown) {
            if (this.zoom < ZoomMax) {
                this.zoom += zoomspeed;
            }
        }

        this.camera.setZoom(this.zoom);
    } 
} 

 //function for generating random number with min and max value
 function rand(min, max) {
  return Math.round(Math.random() * (max - min) + min);
}