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
    this.load.image('tileset', 'assets/tileset4.png')
  }

  //class of the map
  class gamemap{
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
      let occupied = [[1, 2]];
      for (let i = 0; i < max+1; i++) {
        occupied[i] = new Array(2);
      } // initialize with one element
      occupied[0][0] = rand(3, this.s-3);
      occupied[0][1] = rand(3, this.s-3);

      let x;
      let y;
      let z;

      for (let i = 0; i < max; i++) {
        
        x = occupied[i][0];
        y = occupied[i][1];
        z = rand(0,3);

        occupied[i+1][0] = this.cedgex(x,z);
        occupied[i+1][1] = this.cedgey(y,z);
      }

      for (let i = 0; i < occupied.length-1; i++) {
        let element1 = occupied[i][0];
        let element2 = occupied[i][1];
        
        this.lvl[element1][element2] = 1;
      }
    }
    cedgex(x,i){
      switch (i) {
        case 0: return x+1;
        case 1: return x;
        case 2: return x-1;
        case 3: return x;
        default: return 0;
      }
    }
    cedgey(y,i){
      switch (i) {
        case 0: return y;
        case 1: return y+1;
        case 2: return y;
        case 3: return y-1;
        default: return 0;
      }
    }
    //function for filling the empty array with 0 + borders
    arrange(){
      for (let i = 0; i < this.s; i++) {
        for (let j = 0; j < this.s; j++) {
          this.lvl[i][j] = 0;
        }
      }
      for (let i = 1; i < this.s-1; i++) {
        this.lvl[i][0] = 10;
        this.lvl[i][this.s-1] = 10;
      }
      for (let i = 1; i < this.s-1; i++) {
        this.lvl[0][i] = 5;
        this.lvl[this.s-1][i] = 5;
      }
      this.lvl[0][0] = 6;
      this.lvl[0][this.s-1] = 3;
      this.lvl[this.s-1][0] = 12;
      this.lvl[this.s-1][this.s-1] = 9;
    }
    //connects the generated spaces, so it dosnt look rubbish
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
      console.log(countof1s);
      let tobefilled = new Array(countof1s);

      let c = 0;
      for (let y = 2; y < this.s - 2; y++) {

        for (let x = 2; x < this.s - 2; x++) {

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
            console.log(fill);
            tobefilled[c][0] = y;
            tobefilled[c][1] = x;
            tobefilled[c][2] = this.decoder(fill);
            fill = [false, false, false, false];
            c++;
          }
        }
      }
      console.log(tobefilled);

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

  function create() {
    
    const game = new gamemap(50);
    game.arrange();
    for (let i = 0; i < 10; i++) {
      game.gen(5);
    }

    game.connect();

    const map = this.make.tilemap({data:game.lvl, tileWidth: 16, tileHeight: 16, width:1600, height: 1600});
    const tiles = map.addTilesetImage('tileset');
    const layer = map.createLayer(0,tiles,0,0)
  }

  function update() {

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