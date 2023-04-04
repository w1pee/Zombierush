var config = {
  type: Phaser.CANVAS,
  width: 1280,
  height: 800,
  parent: "thegame",
  scene: {
      preload: preload,
      create: create,
      update: update,
      render: render 
  },
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 0 },
      debug: false
    }
  }
};

  var game  = new Phaser.Game(config,'game-area');

  function preload() {
    this.load.image('zombie', 'assets/zombie.png');
    this.load.image('player', 'assets/player.png');
    this.load.image('roof1', 'assets/roof1.png')
    this.load.image('roof2', 'assets/roof2.png')
    this.load.image('floor', 'assets/floor.png')
    this.load.image('trees', 'assets/trees.png')
  }

  //class of the map
  class buildings{
    constructor(size) {
      this.s = size;
      this.lvl = new Array(size);
      for (let i = 0; i < this.lvl.length; i++) {
        this.lvl[i] = new Array(size);
      }
    }
    //generating 1 random house structure
    //doesnt check yet if there is something already, need to add that later!
    gen(max){
      let occupied = [];
    
      occupied[0] = new Array(2);
    

      let hspoint1;
      let hspoint2;

      do{
        hspoint1 = rand(5, this.s-5);
        hspoint2 = rand(5, this.s-5);
      }
      while(this.lvl[hspoint1][hspoint2] != 0)

      occupied[0][0] = hspoint1;
      occupied[0][1] = hspoint2; 

      let x;
      let y;
      let z;

      for (let i = 1; i < max; i++) {
        
        do{
          x = occupied[rand(0,occupied.length-1)][0];
          y = occupied[rand(0,occupied.length-1)][1];
          z = rand(0,3);
        }
        while(this.lvl[this.cedgex(x,z)][this.cedgey(y,z)]!= 0)

        occupied[i] = new Array(2);
        occupied[i][0] = this.cedgex(x,z);
        occupied[i][1] = this.cedgey(y,z);
      }

      for (let i = 0; i < occupied.length-1; i++) {
        let element1 = occupied[i][0];
        let element2 = occupied[i][1];
        
        this.lvl[element1][element2] = 1;
      }
    }
    cedgex(x,i){
      let dx = [1, 0, -1, 0];
      return x + dx[i];
    }
    cedgey(y,i){
      let dy = [0, 1, 0, -1];
      return y + dy[i];
    }
    //function for adding a layer of 2s to the house structures
    fillgaps(){
      let fill2 = new Array(8);
      for (let i = 3; i < this.lvl.length-3; i++) {

        for (let j = 3; j < this.lvl.length-3; j++) {

          if (this.lvl[i][j] == 1) {

            for (let c = 0; c < 8; c++) {
              fill2[c] = new Array(2);
              fill2[c] = this.gaps(i,j,c)
            }
            let x;
            let y;
            for (let i = 0; i < 8; i++) {
              x = fill2[i][0];
              y = fill2[i][1];
              this.lvl[x][y] = 2;
            }
            }
        }
      }
    }
    gaps(x,y,c){
      let dx = [-1,-1,0,1,1,1,0,-1];
      let dy = [0,1,1,1,0,-1,-1,-1];
      if (this.lvl[x+dx[c]][y+dy[c]] == 1){
        return [0,0];
      }
      return [x+dx[c],y+dy[c]];
    }
    //function for filling the empty array with 0
    arrange(){
      for (let i = 0; i < this.s; i++) {
        for (let j = 0; j < this.s; j++) {
          this.lvl[i][j] = 0;
        }
      }
      
    }
    //generates walls around the playfield
    walls(){
      for (let i = 1; i < this.s-1; i++) {
        this.lvl[i][0] = 17;
        this.lvl[i][this.s-1] = 17;
      }
      for (let i = 1; i < this.s-1; i++) {
        this.lvl[0][i] = 16;
        this.lvl[this.s-1][i] = 16;
      }
      this.lvl[0][0] = 21;
      this.lvl[0][this.s-1] = 20;
      this.lvl[this.s-1][0] = 18;
      this.lvl[this.s-1][this.s-1] = 19;
    }
    //connects the generated spaces, so it dosnt look rubbish
    //also it removes any 2s that are just there to keep the houses apart
    connect(){
      let fill = [false, false, false, false];

      let countof1s = 0;

      for (let i = 0; i < this.lvl.length; i++) {
        for (let j = 0; j < this.lvl.length; j++) {
          if (this.lvl[i][j] == 1) {
            countof1s++;
          }
        }
      }
      let tobefilled = new Array(countof1s);

      //loops through the array and looks for 1s around the choosen place
      let c = 0;
      for (let y = 0; y < this.s; y++) {

        for (let x = 0; x < this.s; x++) {

          if(this.lvl[x][y] == 2){
            this.lvl[x][y] = 0;
          }

          if (this.lvl[y][x] == 1) {
            
            if (this.lvl[y-1][x] == 1){
              fill[3] = true;
            }
            if (this.lvl[y][x+1] == 1){
              fill[2] = true;
            }
            if (this.lvl[y+1][x] == 1){
              fill[1] = true;
            }
            if (this.lvl[y][x-1] == 1){
              fill[0] = true;
            }
            tobefilled[c] = new Array(3);
            tobefilled[c][0] = y;
            tobefilled[c][1] = x;
            tobefilled[c][2] = this.decoder(fill);
            fill = [false, false, false, false];
            c++;
          }
        }
      }

      let el1 = 0;
      let el2 = 0;
      let el3 = 0;

      for (let i = 0; i < tobefilled.length; i++) {
       
        el1 = tobefilled[i][0];
        el2 = tobefilled[i][1];
        el3 = tobefilled[i][2];

        this.lvl[el1][el2] = el3;
      }

    }
    //decodes an array of 0s and 1s into a number
    decoder(array){
      let number = 0;
      for (let i = 0; i < array.length; i++) {
        number += array[i] * this.quad(2,i);
      }
      return number;
    }
    //just a function that calculates square number, num1^num2
    //unnecesary, but cool
    quad(num1,num2){
      let num3 = 1;
      for (let i = 0; i < num2; i++) {num3 *= num1;}
      return num3;
    }
  }
//this is the class for the background
//only do it when finished with the more important stuff

  class back{
    constructor(size) {
      this.s = size;
      this.lvl = new Array(size);
      for (let i = 0; i < this.lvl.length; i++) {
        this.lvl[i] = new Array(size);
      }
    }
    generate(){
      for (let i = 0; i < this.lvl.length; i++) {

        for (let j = 0; j < this.lvl.length; j++) {
          this.lvl[i][j] = rand(0,1);
        }
      }
    }
  }

  function create() {
    
    const fr = new buildings(50);
    fr.arrange();
    for (let i = 0; i < 20; i++) {
      fr.gen(50);
      fr.fillgaps();
    }
    fr.walls();
    fr.connect();

    const br = new back(50);

    br.generate();
    
    const mapwithcol = this.make.tilemap({data:fr.lvl, tileWidth: 32, tileHeight: 32});
    const tiles = mapwithcol.addTilesetImage('roof2');


    const background = this.make.tilemap({data:br.lvl, tileWidth: 32, tileHeight: 32})
    const tiles2 = background.addTilesetImage('floor');

    const layer2 = background.createLayer(0,tiles2,0,0)
    const layer = mapwithcol.createLayer(0,tiles,0,0)
    
    //player
    this.player = this.physics.add.sprite(400, 300, 'player');
    this.player.setCollideWorldBounds(true);
    //cursor
    this.cursors = this.input.keyboard.createCursorKeys();

    //camera


  }

  function update() {
    
    var speed = 50;
    var directioncheckX = 0;
    var directioncheckY = 0;

    if (this.cursors.left.isDown) {
      directioncheckX--;
    }
    if (this.cursors.right.isDown) {
      directioncheckX++;
    }
    this.player.setVelocityX(speed * directioncheckX);

    if (this.cursors.up.isDown) {
      directioncheckY--;
    } 
    if (this.cursors.down.isDown) {
      directioncheckY++;
    } 
    this.player.setVelocityY(speed * directioncheckY);
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

  function render() {
    game.debug.cameraInfo(game.camera, 32, 32);
    game.debug.spriteCoords(player, 32, 500);

}