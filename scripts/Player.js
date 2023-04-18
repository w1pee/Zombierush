export default class Player extends Phaser.Physics.Matter.Sprite {
    constructor(data){
        let {scene,x,y,texture,frame} = data;
        super(scene.matter.world,x,y,texture,frame);
        this.scene.add.existing(this);

        const {Body,Bodies} = Phaser.Physics.Matter.Matter;
        var playerCollider = Bodies.circle(this.x,this.y,5,{isSensor:false,label:'playerCollider'});
        var DmgSensor = Bodies.circle(this.x,this.y,20,{isSensor:true,label:'DmgSensor'});
        const compundBody = Body.create({
            parts:[playerCollider,DmgSensor],
            frictionAir:0.5,
        });
        this.setExistingBody(compundBody);
        this.setFixedRotation();

        this.Health = 100;
    }

    static preload(scene){
        scene.load.atlas('player', 'assets/MainPlayer/mainplayer.png', 'assets/MainPlayer/mainplayer_atlas.json');
        scene.load.image('bullet', 'assets/MainPlayer/bullet.png')
    }

    update(){

        const speed = 1.8;
        let playerVelocity = new Phaser.Math.Vector2();
        if(this.inputkeys.left.isDown && this.inputkeys.right.isDown){
            playerVelocity.x = 0;
        }
        else if(this.inputkeys.left.isDown){
            playerVelocity.x = -1;
        }
        else if(this.inputkeys.right.isDown){
            playerVelocity.x = 1;
        }

        if(this.inputkeys.up.isDown && this.inputkeys.down.isDown){
            playerVelocity.y = 0;
        }
        else if(this.inputkeys.up.isDown){
            playerVelocity.y = -1;
        }
        else if(this.inputkeys.down.isDown){
            playerVelocity.y = 1;
        }
        playerVelocity.normalize();
        playerVelocity.scale(speed);
        this.setVelocity(playerVelocity.x, playerVelocity.y);

        // this.on('pointerdown', this.shootBullet, this)
    }
    // shootBullet(scene) {
    //     console.log('working bullet');
    //     // Create a new bullet sprite at the player's position
    //     const bullet = scene.add.sprite(this.x, this.y, 'bullet');
        
    //     // // Add the bullet to the physics engine
    //     // this.scene.physics.add.existing(bullet);
      
    //     // // Set the bullet's velocity in the direction the player is facing
    //     // const velocity = new Phaser.Math.Vector2();
    //     // velocity.x = Math.cos(this.rotation) * 1000;
    //     // velocity.y = Math.sin(this.rotation) * 1000;
    //     // bullet.body.setVelocity(velocity.x, velocity.y);
      
    //     // Destroy the bullet after 2 seconds
    //     this.scene.time.delayedCall(2000, () => {
    //       bullet.destroy();
    //     });
    //   }
}