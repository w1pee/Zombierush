export default class Zombie extends Phaser.Physics.Matter.Sprite {
    constructor(data,SpawnHealth,SpawnSpeed){
        let {scene,x,y,texture,frame} = data;
        super(scene.matter.world,x,y,texture);
        this.scene.add.existing(this);

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

        //pathfinder Setup
        this.pathfindersetup(this.scene);
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
            // Sets up a list of tweens, one for each tile to walk, that will be chained by the timeline
            var tweens = [];
            for(var i = 0; i < path.length-1; i++){
                var ex = path[i+1].x;
                var ey = path[i+1].y;
                tweens.push({
                    targets: zombie,
                    x: {value: ex*scene.map.tileWidth, duration: 200},
                    y: {value: ey*scene.map.tileHeight, duration: 200}
                });
            }

            scene.tweens.timeline({
                tweens: tweens
            });
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

        // this.Velocity = new Phaser.Math.Vector2();
        // // simple system for Following Player    //bad way to do this    //will improve that later on
        // if (this.x > scene.player.x) {
        //     this.Velocity.x--;
        // }
        // else if (this.x < scene.player.x){
        //     this.Velocity.x++;
        // }
        // else {
        //     this.Velocity.x = 0;
        // }

        // if (this.y > scene.player.y) {
        //     this.Velocity.y--;
        // }
        // else if (this.y < scene.player.y){
        //     this.Velocity.y++;
        // }
        // else {
        //     this.Velocity.y = 0;
        // }

        // this.Velocity.normalize();
        // this.Velocity.scale(this.Speed);
        // this.setVelocity(this.Velocity.x, this.Velocity.y);
        //----------------------------------------------------------------
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

        var grid = [];

        //generates a grid for the pathfinding algorithmen
        for (let y = 0; y < scene.map.height; y++) {
            var col = [];
            for (let x = 0; x < scene.map.width; x++) {
                col.push(scene.TileID(x,y));
            }
            grid.push(col);
        }
        scene.pathfinder.setGrid(grid);
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
    }
    // Collisons(scene){
    //     scene.matter.world.on('collision', (event,bodyA,bodyB) =>
    //     {
    //         if (bodyA.label == 'ZombieSensor' || bodyB.label == 'ZombieSensor') {
    //             this.collison = true;
    //         }
    //     });

    //     scene.matter.world.on('collisionend', (event,bodyA,bodyB) =>
    //     {
    //         if (bodyA.label == 'ZombieSensor' || bodyB.label == 'ZombieSensor') {
    //             this.collison = false;
    //         }
    //     });
    // }
}

function rand(min, max) {
    return Math.round(Math.random() * (max - min) + min);
}