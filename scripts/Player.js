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
        this.setCollisionGroup(-1); //setting collision group, so it wont collide with the Player
        //atribute for the player
        this.maxHealth = 100        //Maximal Player health
        this.Health = 100;          //Player Health
        this.speed = 2.5;           //Player Speed

        this.bulletspeed = 8;       //Bullet Speed
        this.firerate = 2;          //the rate the Player fires at(shots per second)
        this.Damage = 5;            //Damage the bullets inflicts onto zombies
        this.ratecheck = true;      //checks if the cooldown is over
        this.shootPressed = false;  //checks if the cursor is down
        //collision
        // this.setOnCollideWith( function() {
        //     console.log('2');
        // });
    }

    static preload(scene){
        scene.load.atlas('player', 'assets/MainPlayer/mainplayer.png', 'assets/MainPlayer/mainplayer_atlas.json');
        scene.load.image('bullet', 'assets/bullet.png');
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
        
        // listen for mouse input to shoot
        scene.input.on('pointerdown', function(pointer) {
            this.shootPressed = true;
        }, this);
        //----------------------------------------------------------------

        //if the mouse is pressed & the cooldown is not active, then it shoots
        if(this.shootPressed == true){
            if(this.ratecheck == true){
                this.shootBullet(scene);    //shoots the Bullet
                //sets cooldown
                this.ratecheck = false;
                this.scene.time.delayedCall(1000 * (1/this.firerate), () => {   //1000 is 1 second | --> 15 shots per second is 1000 * 1/15
                    this.ratecheck = true;
                });
                //----------------------------------------------------------------
            }
        }
        //----------------------------------------------------------------

        //if the mouse is no longer pressed it set it to false
        scene.input.on('pointerup', function(pointer) {
            this.shootPressed = false;
        },this);
        //----------------------------------------------------------------
    }
    shootBullet(scene) {

        //x & y position of the cursor(where the bullet is supposed to go)
        let x = scene.cursorCords[0];
        let y = scene.cursorCords[1];
        //----------------------------------------------------------------

        //Calculation of the Vector applied to the Bullet
        let BulletVector = new Phaser.Math.Vector2();   //Vector

        BulletVector.x = x - this.x;
        BulletVector.y = y - this.y;

        BulletVector.normalize();
        BulletVector.scale(this.bulletspeed + rand(-0.5,0.5));  //sets the speed of the Bullet with a random value between -0.5 and 0.5 to make it look better
        //----------------------------------------------------------------

        //calculation of the Rotation of the bullet based on the Vector
        let AngleRad = Math.atan(BulletVector.y/BulletVector.x);    //calculation of the angle of the bullet
        let AngleDeg = AngleRad * (180 / Math.PI);  //convertion to Degree

        //adjustment of the angle based on the direction
        if (BulletVector.x < 0) {       
            if(BulletVector.y > 0) {
                AngleDeg += 180;
            }
            else {
                AngleDeg -= 180;
            }
        }
        //----------------------------------------------------------------

        // Create a new bullet sprite at the player's position
        const bullet = scene.matter.add.sprite(this.x, this.y, 'bullet');
        //----------------------------------------------------------------

        //Custom collider for bullet
        const {Body,Bodies} = Phaser.Physics.Matter.Matter;
        var newcollider = Bodies.circle(this.x,this.y,2,{label:'BulletCollider'})
        const BulletBody = Body.create({
            parts:[newcollider],
            collisionFilter: {
            }
        });
        bullet.setExistingBody(BulletBody);

        bullet.setCollisionGroup(-1);   //setting collision group, so it wont collide with the Player
        bullet.setScale(0.75);
        bullet.setOrigin(0.5,0.5);
        bullet.rotation = AngleDeg / (180/Math.PI); //set rotation converted back to radian
        //----------------------------------------------------------------

        //assign the bullet its Vector
        bullet.setVelocity(BulletVector.x,BulletVector.y);
        //----------------------------------------------------------------

        // Destroy the bullet after 2 seconds
        this.scene.time.delayedCall(2000, () => {
            bullet.destroy();
        });
        //----------------------------------------------------------------
    }
}
//function for generating random number with min and max value
function rand(min, max) {
    return Math.random() * (max - min) + min;
}
//----------------------------------------------------------------