export default class Zombie extends Phaser.Physics.Matter.Sprite {
    constructor(data,SpawnHealth,SpawnSpeed){
        let {scene,x,y,texture,frame} = data;
        super(scene.matter.world,0,0,texture);
        this.scene.add.existing(this);

        //pathfinder Setup
        this.pathfindersetup(this.scene);

        this.cords(scene.player.x,scene.player.y);

        const {Body,Bodies} = Phaser.Physics.Matter.Matter;
        var Collider = Bodies.circle(this.x,this.y,7,{isSensor:false,label:'ZombieCollider'});
        var Sensor = Bodies.circle(this.x,this.y,15,{isSensor:true,label:'ZombieSensor'});
        const compundBody = Body.create({
            parts:[Collider,Sensor],
            frictionAir:0.2,
        });
        this.setExistingBody(compundBody);
        this.setFixedRotation();

        this.Health = SpawnHealth;      //Health of the Zombie
        this.Speed = SpawnSpeed * rand(0.8,1.2);     //speed the zombie moves at, is randomized
        this.healthTxt = scene.add.text(this.x,this.y,this.Health ,{ font: '10px Arial', fill: '#000000' });    //text that displays the current health of the zombie
        this.healthTxt.setOrigin(0.5,0.5)

    }

    static preload(scene){
        scene.load.image('zombie', 'assets/Zombies/images/Zombies.png');
    }
    update(scene){
        
        //updating text position
        this.healthTxt.x = this.x;
        this.healthTxt.y = this.y+12;
        //----------------------------------------------------------------

        //updating healthtext
        this.healthTxt.text = this.Health;
        //----------------------------------------------------------------

        //when cursor in reach show health
        if(scene.cursorCords[0]+50 > this.x && scene.cursorCords[0]-50 < this.x){
            if(scene.cursorCords[1]+50 > this.y && scene.cursorCords[1]-50 < this.y){
                this.healthTxt.alpha = 1;
            }
        }
        else{
            this.healthTxt.alpha = 0;
        }
        //----------------------------------------------------------------
        scene.moveZombie = function(path,zombie){
            var vector = new Phaser.Math.Vector2();
            
            vector.x = path[1].x - Math.round(zombie.x/16);
            vector.y = path[1].y - Math.round(zombie.y/16);
            
            vector.normalize();
            vector.scale(zombie.Speed);
            zombie.setVelocity(vector.x, vector.y);
        };
        
        scene.pathfinder.findPath(Math.round(this.x/16), Math.round(this.y/16), Math.round(scene.player.x/16), Math.round(scene.player.y/16), function(path) {
            if (path === null) {
                console.warn("Path was not found.");
            } 
            else {
                scene.moveZombie.bind(this)(path,this);
            }
        }.bind(this));
        scene.pathfinder.calculate();
    }
    pathfindersetup(scene){
        //function looks at the tile and returns the index
        scene.TileID = function(x,y){
            var tile = scene.layer2.getTileAt(x,y);
            if(tile == null){
                return -1;
            }
            return tile.index;
        }
        //----------------------------------------------------------------

        this.grid = [];

        //generates a grid for the pathfinding algorithmen
        for (let y = 0; y < scene.map.height; y++) {
            var col = [];
            for (let x = 0; x < scene.map.width; x++) {
                col.push(scene.TileID(x,y));
            }
            this.grid.push(col);
        }
        scene.pathfinder.setGrid(this.grid);
        //searches for walkable tiles
        var Tileset = scene.map.tilesets[1];
        var properties  = Tileset.tileProperties;
        var acceptable = [];

        for (let i = 0; i < scene.map.tilesets[1].total; i++) {
            if(!properties.hasOwnProperty(i)){
                acceptable.push(i);
            }
        }
        scene.pathfinder.setAcceptableTiles(-1);
        scene.pathfinder.enableSync();
    }
    cords(PlayerX,PlayerY){
        let check;
        let x;
        let y;
        do{
            x = rand(10,90);
            y = rand(10,90);
            check = false;

            if (x < PlayerX - 500 && x > PlayerX + 500 && y < PlayerY - 500 && y > PlayerY + 500) {
                check = true
            }
        }
        while(this.grid[x][y] != -1 && check == true)
        this.x = x*16;
        this.y = y*16;
    }
}

function rand(min, max) {
    return Math.round(Math.random() * (max - min) + min);
}