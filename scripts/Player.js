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
            collisionFilter: {
                // Set the category and mask bits for the bullet's collision filter
                category: 0x0001, // category 0x0001
            }
        });
        this.setExistingBody(compundBody);
        this.setFixedRotation();

        this.Health = 100;
        this.speed = 2.5;
        this.bulletspeed = 10;
        this.firerate = 2;
    }

    static preload(scene){
        scene.load.atlas('player', 'assets/MainPlayer/mainplayer.png', 'assets/MainPlayer/mainplayer_atlas.json');
        scene.load.image('bullet', 'assets/MainPlayer/bullet.png')
    }

    update(scene){
        //movement system
        //X
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
        //Y
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
        playerVelocity.scale(this.speed);
        this.setVelocity(playerVelocity.x, playerVelocity.y);
        //----------------------------------------------------------------

        // boolean flag to track if shoot button has been pressed
        this.shootPressed = false;
        //----------------------------------------------------------------

        // listen for mouse input to shoot
        scene.input.on('pointerdown', function(pointer) {
            if (pointer.leftButtonDown() && !this.shootPressed) {
                this.shootBullet(scene);
                this.shootPressed = true;
            }
        }, this);
        //----------------------------------------------------------------

        // reset shootPressed flag when left mouse button is released
        scene.input.on('pointerup', function(pointer) {
            if (pointer.leftButtonReleased()) {
                this.shootPressed = false;
            }
        }, this);
        //----------------------------------------------------------------
    }
    shootBullet(scene) {
        
        //vector for the bullet
        let BulletVector = new Phaser.Math.Vector2();
        //----------------------------------------------------------------

        //x & y position of the cursor(where the bullet is supposed to go)
        let x = scene.cursorCords[0];
        let y = scene.cursorCords[1];
        //----------------------------------------------------------------
        console.log([x,y]);
        // Create a new bullet sprite at the player's position
        const bullet = scene.matter.add.sprite(x, y, 'bullet');
        //----------------------------------------------------------------

        //Custom collider for bullet
        const {Body,Bodies} = Phaser.Physics.Matter.Matter;
        var newcollider = Bodies.circle(x,y,2,{label:'BulletCollider'})
        const BulletBody = Body.create({
            parts:[newcollider],
            collisionFilter: {
                // Set the category and mask bits for the bullet's collision filter
                category: 0x0002, // category 0x0002
                mask: 0x0001 // mask 0x0001 (collide with category 0x0001)
            }
        });
        bullet.setExistingBody(BulletBody);
        //----------------------------------------------------------------

        // Destroy the bullet after 2 seconds
        this.scene.time.delayedCall(2000, () => {
            bullet.destroy();
        });
        //----------------------------------------------------------------
    }
}

 // // Add the bullet to the physics engine
        // this.scene.physics.add.existing(bullet);
      
        // // Set the bullet's velocity in the direction the player is facing
        // const velocity = new Phaser.Math.Vector2();
        // velocity.x = Math.cos(this.rotation) * 1000;
        // velocity.y = Math.sin(this.rotation) * 1000;
        // bullet.body.setVelocity(velocity.x, velocity.y);
      