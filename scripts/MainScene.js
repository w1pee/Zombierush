export default class MainScene extends Phaser.Scene {
    constructor() {
        super("MainScene");
    }
    preload(){
    
        this.load.atlas('player', 'assets/MainPlayer/mainplayer.png', 'assets/MainPlayer/mainplayer_atlas.json');
        this.load.animation('player_walk', 'assets/MainPl')

        this.load.image('tileset', 'assets/tileset7.png');
        this.load.tilemapCSV('roofcol', 'assets/tilemap_roofcollision.csv');
        this.load.tilemapCSV('roof', 'assets/tilemap_roof.csv');
        this.load.tilemapCSV('ground', 'assets/tilemap_ground.csv');
    }
    create(){
        console.log('create');

        const map = this.make.tilemap({ key: "ground", tileWidth: 16, tileHeight: 16 });
        const map2 = this.make.tilemap({ key: "roofcol", tileWidth: 16, tileHeight: 16 });
        const map3 = this.make.tilemap({ key: "roof", tileWidth: 16, tileHeight: 16 });

        const tileset = map.addTilesetImage("tileset");

        var grnd = map.createLayer(0, tileset);
        var roof1 = map2.createLayer(0, tileset);

        var roof2 = map3.createLayer(0, tileset);

        roof1.setCollisionByExclusion([ -1 ]);


        this.player = new Phaser.Physics.Matter.Sprite(this.matter.world,0,0, 'player', 'walk_2');
        this.add.existing(this.player);

        var roof2 = map3.createLayer(0, tileset);

        this.inputkeys = this.input.keyboard.addKeys({
            up: Phaser.Input.Keyboard.KeyCodes.W,
            down: Phaser.Input.Keyboard.KeyCodes.S,
            left: Phaser.Input.Keyboard.KeyCodes.A,
            right: Phaser.Input.Keyboard.KeyCodes.D,
            out: Phaser.Input.Keyboard.KeyCodes.F,
            in: Phaser.Input.Keyboard.KeyCodes.R,
        });

        this.camera = this.cameras.main;

        this.camera.startFollow(this.player);
        this.camera.setZoom(3);
        this.zoom = 3;
    }

    
    update(){

        const zoomspeed = 0.1;
        const ZoomMax = 9;
        const ZoomMin = 2.5;

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

        this.player.anims.play('walk', true);

        const speed = 1.8;
        let playerVelocity = new Phaser.Math.Vector2();
        if(this.inputkeys.left.isDown){
            playerVelocity.x = -1;
        }
        else if(this.inputkeys.right.isDown){
            playerVelocity.x = 1;
        }

        if(this.inputkeys.up.isDown){
            playerVelocity.y = -1;
        }
        else if(this.inputkeys.down.isDown){
            playerVelocity.y = 1;
        }
        playerVelocity.normalize();
        playerVelocity.scale(speed);
        this.player.setVelocity(playerVelocity.x, playerVelocity.y);
    }
} 

 //function for generating random number with min and max value
 function rand(min, max) {
  return Math.round(Math.random() * (max - min) + min);
}