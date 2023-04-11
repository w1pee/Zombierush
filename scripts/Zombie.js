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
    }

    static preload(scene){
        scene.load.image('zombie', 'assets/Zombies/images/Zombies.png');
        console.log('called');
    }
    update(Player){

        let Velocity = new Phaser.Math.Vector2();
        const speed =  rand(0.1,1.3);
        //simple system for Following Player
        if (this.x > Player.x) {
            Velocity.x = -1;
        }
        else if (this.x < Player.x){
            Velocity.x = 1;
        }

        if (this.y > Player.y) {
            Velocity.y = -1;
        }
        else if (this.y < Player.y){
            Velocity.y = 1;
        }

        Velocity.normalize();
        Velocity.scale(speed);
        this.setVelocity(Velocity.x, Velocity.y);
    }
}
function rand(min, max) {
    return Math.round(Math.random() * (max - min) + min);
}