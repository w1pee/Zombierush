var config = {
  type: Phaser.CANVAS,
  width: 1280,
  height: 800,
  parent: "thegame",
  scene: {
      preload: preload,
      create: create,
      update: update
  }
};

  var game  = new Phaser.Game(config,'game-area');

  function preload() {
    this.load.image('player', 'assets/player.png');
    this.load.image('line', 'assets/lines.png')
    this.load.image('tileset', 'assets/tileset2.png')
  }

  class gamemap{
    constructor(size) {
      this.s = size;
      this.lvl = new Array(size);
      for (let i = 0; i < this.lvl.length; i++) {
        this.lvl[i] = new Array(size);
      }
      console.log(this.lvl)
    }
    //generating 1 random house structure
    //doesnt check yet if there is something already, need to add that later!
    gen(){
      let x = rand(3,this.s-3);
      let y = rand(3,this.s-3);

      this.lvl[x][y] = 1;
      if (rand(0,1) == 2) {
        this.lvl[x + des()][y] = 1;
        if (rand(0,3) == 2) {
          this.lvl[x][y + des()] = 1;
        }
      }
      else if (rand(0,1) == 1) {
        this.lvl[x][y + des()] = 1;
        if (rand(0,3) == 2) {
          this.lvl[x + des()][y] = 1;
        }
      }
    }
    //function for filling the empty array
    arrange(){
      for (let i = 0; i < this.s; i++) {
        for (let j = 0; j < this.s; j++) {
          this.lvl[i][j] = 0;
        }
      }
      for (let i = 1; i < this.s-1; i++) {
        this.lvl[i][0] = 5;
        this.lvl[i][this.s-1] = 5;
      }
      for (let i = 1; i < this.s-1; i++) {
        this.lvl[0][i] = 8;
        this.lvl[this.s-1][i] = 8;
      }
      this.lvl[0][0] = 9;
      this.lvl[0][this.s-1] =10;
      this.lvl[this.s-1][0] = 6;
      this.lvl[this.s-1][this.s-1] = 7;
    }
    //connects the generated spaces, so it dosnt look rubbish
    connect(){
      for (let i = 1; i < this.s-1; i++) {
        for(let j = 1; j < this.s-1; j++){

          if(this.lvl[i][j] != 0){
            let filled = [false,false,false,false];
            if (this.lvl[i+1][j] != 0) {
              filled[0] = true;
            }
            if (this.lvl[i][j+1] != 0) {
              filled[1] = true;
            }
            if (this.lvl[i-1][j] != 0) {
              filled[2] = true;
            }
            if (this.lvl[i][j-1] != 0) {
              filled[3] = true;
            }
            this.lvl[i][j] = this.decoder(filled);
            }

        }
      }
    }
    decoder(array){
      if (array[0] == false && array[1] == false && array[2] == false && array[3] == false) {
        return 11;
      }
      else if (array[0] == true && array[1] == false && array[2] == false && array[3] == false) {
        return 1;
      }
      else if (array[0] == false && array[1] == true && array[2] == false && array[3] == false) {
        return 4;
      }
      else if (array[0] == false && array[1] == false && array[2] == true && array[3] == false) {
        return 3;
      }
      else if (array[0] == false && array[1] == false && array[2] == false && array[3] == true) {
        return 2;
      }
      else if (array[0] == true && array[1] == true && array[2] == false && array[3] == false) {
        return 9;
      }
      else if (array[0] == true && array[1] == false && array[2] == true && array[3] == false) {
        return 5;
      }
      else if (array[0] == true && array[1] == false && array[2] == false && array[3] == true) {
        return 10;
      }
      else if (array[0] == false && array[1] == true && array[2] == true && array[3] == false) {
        return 6;
      }
      else if (array[0] == false && array[1] == true && array[2] == false && array[3] == true) {
        return 8;
      }
      else if (array[0] == false && array[1] == false && array[2] == true && array[3] == true) {
        return 7;
      }

    }
    quad(num1,num2){
      num3 = 1;
      for (let i = 0; i < num2; i++) {
          num3 *= num1;
      }
      return num3;
    }
  }

  function create() {
    
    const game = new gamemap(50);
    game.arrange();
    for (let i = 0; i < 100; i++) {
      game.gen(); 
    }
    game.connect();

    const map = this.make.tilemap({data:game.lvl, tileWidth: 16, tileHeight: 16, width:1600, height: 1600});
    const tiles = map.addTilesetImage('tileset');
    const layer = map.createLayer(0,tiles,0,0)
    


    player = this.physics.add.image(100,450,'player');
    cursors = this.input.keyboard.createCursorKeys();
  }

  function update() {
    if (cursors.left.isDown)
    {
      player.setVelocityX(-160);
    }
    else if (cursors.right.isDown)
    {
      player.setVelocityX(160);
    }
    else{
      player.setVelocityX(0);
    }

    if (cursors.up.isDown) {
      player.setVelocityY(-160);
    }
    else if (cursors.down.isDown){
      player.setVelocityY(160);
    }
    else{
      player.setVelocityY(0);
    } 
  }
  //function for generating random number with min and max value
  function rand(min, max) {
    return Math.round(Math.random() * (max - min) + min);
  }
  //function that returns -1 or 1 randomly
  function des(){
    switch(rand(0,1)){
      case 0:return -1;
      case 1:return 1;
    }
  }