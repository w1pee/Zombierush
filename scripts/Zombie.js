import Func from "./Func.js";
export default class Zombie extends Phaser.Physics.Matter.Sprite {
    constructor(data){
        let {scene,x,y,texture} = data;
        super(scene.matter.world,x,y,texture);
        this.scene.add.existing(this);

        const {Body,Bodies} = Phaser.Physics.Matter.Matter;
        var Collider = Bodies.circle(this.x,this.y,3,{isSensor:false,label:'ZombieCollider'});
        var Sensor = Bodies.circle(this.x,this.y,15,{isSensor:true,label:'ZombieSensor'});
        const compundBody = Body.create({
            parts:[Collider,Sensor],
            frictionAir:0.2,
        });
        this.setExistingBody(compundBody);
        this.setFixedRotation();

        this.Health = 20;
        this.Speed = Func.rand(1,1.5);     //adds a little random to Speed
        this.healthTxt = scene.add.text(this.x,this.y,this.Health ,{ font: '9px', fontFamily: 'CustomFont', color: '#ffffff',stroke: '#000000',strokeThickness:3});
        this.healthTxt.setOrigin(0.5,0.5)

        this.OldPlayerX = 0;
        this.OldPlayerY = 0;

        this.pathposition;
    }

    static preload(scene){
        scene.load.atlas('default_zombiedino1', 'assets/Zombies/default_zombiedino1.png', 'assets/Zombies/default_zombiedino1_atlas.json');
        scene.load.animation('default_zombiedino1_anims', 'assets/Zombies/default_zombiedino1_anim.json'); 
    }

    update(){

        //updating text position
        this.healthTxt.x = this.x;
        this.healthTxt.y = this.y+12;
        //----------------------------------------------------------------

        //updating healthtext
        this.healthTxt.text = this.Health;
        //----------------------------------------------------------------

        //when cursor in reach show health
        if(Func.Distance({x: this.x, y: this.y},{x: this.scene.cursorCords.x, y:this.scene.cursorCords.y}) < 75){
            this.healthTxt.alpha = 1;
        }
        else{
            this.healthTxt.alpha = 0;
        }
        //----------------------------------------------------------------

        //Player position
        const PlayerX = Math.floor(this.scene.player.x / 16);
        const PlayerY = Math.floor(this.scene.player.y / 16);
        //----------------------------------------------------------------

        //finding Path
        //When Player changes tile hes on, Zombie searches for a new path
        if(this.OldPlayerX != PlayerX || this.OldPlayerY != PlayerY){
            this.scene.pathfinder.findPath(Math.floor(this.x/16), Math.floor(this.y/16), PlayerX, PlayerY, function(path) {
                if (path === null) {
                    console.warn("Path was not found.");
                }
                else {
                    this.path = path;
                    this.pathposition = 1;
                }
            }.bind(this));
            this.scene.pathfinder.calculate();
            this.OldPlayerX = PlayerX;
            this.OldPlayerY = PlayerY;
        }
        //----------------------------------------------------------------

        //Movement
        if(this.path.length > 0){
            this.Move(this.path);
            if(Math.floor(this.x / 16) === this.path[this.pathposition-1].x && Math.floor(this.y / 16) === this.path[this.pathposition-1].y){
                this.pathposition++;
            }
        }
        //----------------------------------------------------------------
    }
    //function for the Zombie taking damage
    takeDamage(dmg){
        this.Health -= dmg;

        this.tint =  0xfc2803;

        this.scene.time.delayedCall(100, () => {
            this.clearTint();
        });
    }
    //function for moving the Zombie
    Move(){
        console.log(this.path);

        let Pos = this.pathposition;
        
        if(Pos >= this.path.length){
            Pos = this.path.length-1;
        }

        var vector = new Phaser.Math.Vector2();

        let PathX = (this.path[Pos].x * 16) + 8;
        let PathY = (this.path[Pos].y * 16) + 8;
        vector.x = PathX - this.x;
        vector.y = PathY - this.y;
        
        vector.normalize();
        vector.scale(this.Speed);
        this.setVelocity(vector.x, vector.y);
        if(Math.abs(vector.x) > 0.1 || Math.abs(vector.y) > 0.1){
                    this.anims.play('walkrightz', true);
                }
                //needs to be fixed that when zombiedino goes into the left direction screen, the walkleftz animation plays
                //fixidea: if statement by locating Players direction from the zombiedino     
                if(Math.abs(vector.x) < 0 || Math.abs(vector.y) < 0){
                    this.anims.play('walkleftz', true);
                } 
                if(Math.abs(vector.x) == 0 || Math.abs(vector.y) == 0){
                    this.anims.play('idlez', true);
                }   
    }
}

export class Coin extends Phaser.Physics.Matter.Sprite{
    constructor(data){
        let {scene,x,y,texture} = data;
        super(scene.matter.world,x,y,texture);
        this.scene.add.existing(this);

        const {Body,Bodies} = Phaser.Physics.Matter.Matter;
        var Sensor = Bodies.circle(this.x,this.y,15,{isSensor:true,label:'CoinSensor'});
        const compundBody = Body.create({
            parts: [Sensor],
        });
        this.setExistingBody(compundBody);
        this.setFixedRotation();
    }

    static preload(scene){
        scene.load.image('10', 'assets/coin10.png');
        scene.load.image('25', 'assets/coin25.png');
        scene.load.image('75', 'assets/coin75.png');
    }

    value(){
        return parseInt(this.texture.key);
    }
}