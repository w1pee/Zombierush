export default class Zombie extends Phaser.Physics.Matter.Sprite {
    constructor(data){
        let {scene,x,y,texture,frame} = data;
        super(scene.matter.world,x,y,texture);
        this.scene.add.existing(this);

        const {Body,Bodies} = Phaser.Physics.Matter.Matter;
        var Collider = Bodies.circle(this.x,this.y,7,{isSensor:false,label:'playerCollider'});
        const compundBody = Body.create({
            parts:[Collider],
            frictionAir:0.2,
        });
        this.setExistingBody(compundBody);
        this.setFixedRotation();

        this.health = 20;
        this.speed = rand(0.1,1.4);
        this.healthTxt = scene.add.text(this.x,this.y,this.health ,{ font: '10px Arial', fill: '#000000' });
        this.healthTxt.setOrigin(0.5,0.5)
    }

    static preload(scene){
        scene.load.image('zombie', 'assets/Zombies/images/Zombies.png');
    }
    update(Player,mousex,mousey){
        
        this.healthTxt.x = this.x;
        this.healthTxt.y = this.y+12;

        if(Player.x+50 > this.x && Player.x-50 < this.x){
            if(Player.y+50 > this.y && Player.y-50 < this.y){
                this.healthTxt.alpha = 1;
            }
        }
        else{
            this.healthTxt.alpha = 0;
        }

        let Velocity = new Phaser.Math.Vector2();
        //simple system for Following Player
        if (this.x > Player.x + 10) {
            Velocity.x = -1;
        }
        else if (this.x < Player.x - 10){
            Velocity.x = 1;
        }
        else {
            Velocity.x = 0;
        }

        if (this.y > Player.y + 10) {
            Velocity.y = -1;
        }
        else if (this.y < Player.y - 10){
            Velocity.y = 1;
        }
        else {
            Velocity.y = 0;
        }

        Velocity.normalize();
        Velocity.scale(this.speed);
        this.setVelocity(Velocity.x, Velocity.y);
        //----------------------------------------------------------------
    }
}
function rand(min, max) {
    return Math.round(Math.random() * (max - min) + min);
}