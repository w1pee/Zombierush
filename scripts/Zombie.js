import Func from "./Func.js";
export default class Zombie extends Phaser.Physics.Matter.Sprite {
    constructor(data){
        let {scene,x,y,texture,Health,Speed} = data;
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

        this.Health = Health;
        this.Speed = Speed * Func.rand(0.8,1.2);     //adds a little random to Speed
        this.healthTxt = scene.add.text(this.x,this.y,this.Health ,{ font: '10px Arial', fill: '#000000' });    //text that displays the current health of the zombie
        this.healthTxt.setOrigin(0.5,0.5)

        this.OldPlayerX = 0;
        this.OldPlayerY = 0

        this.pathposition;
    }

    static preload(scene){
        scene.load.image('zombie', 'assets/Zombies/images/Zombies.png');
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
        if(Func.Distance(this.x,this.scene.cursorCords.x,this.y,this.scene.cursorCords.y) < 75){
            this.healthTxt.alpha = 1;
        }
        else{
            this.healthTxt.alpha = 0;
        }
        //----------------------------------------------------------------

        //Player position
        const PlayerX = Func.MinRound(this.scene.player.x / 16);
        const PlayerY = Func.MinRound(this.scene.player.y / 16);
        //----------------------------------------------------------------

        //finding Path
        //When Player changes tile hes on, Zombie searches for a new path
        if(this.OldPlayerX != PlayerX || this.OldPlayerY != PlayerY){
            this.scene.pathfinder.findPath(Func.MinRound(this.x/16), Func.MinRound(this.y/16), PlayerX, PlayerY, function(path) {
                if (path === null) {
                    console.warn("Path was not found.");
                }
                else {
                    this.path = path;
                    this.pathposition = 1;
                    this.Move();
                }
            }.bind(this));
            this.scene.pathfinder.calculate();
            this.OldPlayerX = PlayerX;
            this.OldPlayerY = PlayerY;
        }
        //----------------------------------------------------------------

        //Movement
        this.Move();
        if(Func.MinRound(this.x / 16) === this.path[this.pathposition-1].x && Func.MinRound(this.y / 16) === this.path[this.pathposition-1].y){
            this.pathposition++;
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
    //function for moving the player
    Move(){

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
    }
}