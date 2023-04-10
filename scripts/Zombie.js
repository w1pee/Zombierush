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
}