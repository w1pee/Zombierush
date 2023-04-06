var config = {
    type: Phaser.CANVAS,
    width: 1280,
    height: 800,
    scene: {
        preload: preload,
        create: create,
        update: update,
    },
    physics: {
      default: 'arcade',
      arcade: {
        debug: false
      }
    }
  };

  var game  = new Phaser.Game(config);

  var player;

  var camera;
  
  function preload() {
    this.load.image('player', 'assets/player.png');
    this.load.image('tileset', 'assets/tileset7.png');
    this.load.tilemapCSV('roofs', 'assets/tilemap1._roofs.csv');
    this.load.tilemapCSV('floor', 'assets/tilemap1._ground.csv');
  }

  function create() {
    
    const map = this.make.tilemap({ key: "floor", tileWidth: 16, tileHeight: 16 });
    const map2 = this.make.tilemap({ key: "roofs", tileWidth: 16, tileHeight: 16 });

    const tileset = map.addTilesetImage("tileset");

    const grnd = map.createLayer(0, tileset);
    const foof = map2.createLayer(0, tileset); 

    player = this.physics.add.sprite(50, 0, 'player').setOrigin(0,0);
    player.setCollideWorldBounds(true);

    player.setDragX(0.80);
    player.setDragY(0.80);

    foof.setCollisionByExclusion([ -1 ]);
    this.physics.add.collider(player, foof);

    //setting up the camera
    
    camera = this.cameras.main;

    camera.setSize(1280,800);
    
    camera.setBounds(0,0,800,800);

    camera.startFollow(player);
    camera.setZoom(1);
    cursors = this.input.keyboard.createCursorKeys();
}

  function update() {

    const speed = 100;
    player.setVelocityX(0);
    player.setVelocityY(0);

    if (cursors.left.isDown){
      player.setVelocityX(-speed);
    }
    if (cursors.right.isDown){
      player.setVelocityX(speed);
    }
   
    if (cursors.up.isDown){
      player.setVelocityY(-speed);
    }
    if (cursors.down.isDown){
      player.setVelocityY(speed);
    }
}

   //function for generating random number with min and max value
   function rand(min, max) {
    return Math.round(Math.random() * (max - min) + min);
  }