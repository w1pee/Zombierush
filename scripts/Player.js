export default class Player extends Phaser.Physics.Matter.Sprite {
    constructor(data){
        let {scene,x,y,texture,frame} = data;
        super(scene.matter.world,x,y,texture,frame);
        this.scene.add.existing(this);

        const {Body,Bodies} = Phaser.Physics.Matter.Matter;
        var playerCollider = Bodies.circle(this.x,this.y,7,{isSensor:false,label:'playerCollider'});
        var DmgSensor = Bodies.circle(this.x,this.y,20,{isSensor:true,label:'DmgSensor'});
        const compundBody = Body.create({
            parts:[playerCollider,DmgSensor],
            frictionAir:0.2,
        });
        this.setExistingBody(compundBody);
        this.setFixedRotation();

        this.Health = 100;
        this.HealthTxt = scene.add.text(x, y, this.Health);
    }

    static preload(scene){
        scene.load.atlas('player', 'assets/MainPlayer/mainplayer.png', 'assets/MainPlayer/mainplayer_atlas.json');
    }

    update(){

        this.HealthTxt.text = 'health: ' + this.Health;
        this.Health += 1;

        const speed = 1.8;
        let playerVelocity = new Phaser.Math.Vector2();
        if(this.inputkeys.left.isDown){
            playerVelocity.x = -1;
        }
        else if(this.inputkeys.right.isDown){
            playerVelocity.x = 1;
        }

        if(this.inputkeys.up.isDown){
            playerVelocity.y = -1;
        }
        else if(this.inputkeys.down.isDown){
            playerVelocity.y = 1;
        }
        playerVelocity.normalize();
        playerVelocity.scale(speed);
        this.setVelocity(playerVelocity.x, playerVelocity.y);
    }
    
    say(txt){
        console.log('player say: ' + txt);
    }
}