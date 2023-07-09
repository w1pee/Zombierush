import Func from "./Func.js";
export default class Player extends Phaser.Physics.Matter.Sprite {
    constructor(data){
        let {scene,x,y,texture,frame} = data;
        super(scene.matter.world,x,y,texture,frame);
        this.scene.add.existing(this);

        const {Body,Bodies} = Phaser.Physics.Matter.Matter;
        var playerCollider = Bodies.circle(this.x,this.y,9,{isSensor:false,label:'playerCollider'});
        var DmgSensor = Bodies.circle(this.x,this.y,15,{isSensor:true,label:'DmgSensor'});
        const compundBody = Body.create({
            parts:[playerCollider,DmgSensor],
            frictionAir:0.5,
        });
        this.setExistingBody(compundBody);
        this.setFixedRotation();
        //atribute for the player
        this.speed = 3.2;           //Player Speed
        this.DashSpeed = 10;        //Speed of the Player during the Dash
        this.DashCooldown = 5;      //cooldown of the Dash in seconds
        this.Dashcheck = true;

        this.bulletspeed = 15;      //Bullet Speed
        this.firerate = 3;          //the rate the Player fires at(shots per second)
        this.Damage = 10;           //Damage the bullets inflicts onto zombies
        this.ratecheck = true;      //checks if the cooldown is over
        this.shootPressed = false;  //checks if the cursor is down

        this.scene.shoot_sound = this.scene.sound.add('shoot1', {loop:false});
        this.scene.walk = this.scene.sound.add('walk1', {loop:false});
        
    }

    static preload(scene){
        scene.load.atlas('default_player1wak', 'assets/MainPlayer/default_player1wak.png', 'assets/MainPlayer/default_player1wak_atlas.json');
        scene.load.animation('default_player1wak_anims', 'assets/MainPlayer/default_player1wak_anim.json');    
        scene.load.image('bullet', 'assets/bullet.png'); 

        scene.load.audio('shoot1',['sounds/shoot.wav']);
       scene.load.audio('walk1',['sounds/walksound.wav']);

    }

    update(){
        let speed = this.speed;
        //Dash      //if activate the player accelerates very fast
        if(this.inputkeys.Dash.isDown && this.Dashcheck){
            speed = this.DashSpeed;
            this.scene.time.delayedCall(250, () => {
                this.Dashcheck = false;
            });
            this.scene.time.delayedCall(this.DashCooldown*1000, () => {
                this.Dashcheck = true;
            });
        }
        //----------------------------------------------------------------
        //movement system
        //X
        let playerVelocity = new Phaser.Math.Vector2();
        if(this.inputkeys.left.isDown && this.inputkeys.right.isDown){
            playerVelocity.x = 0;
        }
        else if(this.inputkeys.left.isDown){
            playerVelocity.x = -1;
            this.anims.play('walkleft', true);
        }
        else if(this.inputkeys.right.isDown){
            playerVelocity.x = 1;
            this.anims.play('walkright', true);
        }
        //Y
        if(this.inputkeys.up.isDown && this.inputkeys.down.isDown){
            playerVelocity.y = 0;
        }
        else if(this.inputkeys.up.isDown){
            playerVelocity.y = -1;
            this.anims.play('walkright', true);
        }
        else if(this.inputkeys.down.isDown){
            playerVelocity.y = 1;
            this.anims.play('walkleft', true);
        }
        else if(this.inputkeys.down.isDown && this.inputkeys.right.isDown) {
            this.anims.play('walkright', true);
        }
        else if(this.inputkeys.up.isDown && this.inputkeys.right.isDown) {
            this.anims.play('walkright', true);
        }
        else if(this.inputkeys.down.isDown && this.inputkeys.left.isDown) {
            this.anims.play('walkleft', true);
        }
        else if(this.inputkeys.up.isDown && this.inputkeys.left.isDown) {
            this.anims.play('walkleft', true);
        }
        else if(Math.abs(playerVelocity.x) == 0 && Math.abs(playerVelocity.y) == 0) {
            this.anims.play('idle', true);  

        }   
    
           if (playerVelocity.x!=0 || playerVelocity.y!=0 ){
            console.log("test");
            this.scene.walk.play();
        }


  
  
        playerVelocity.normalize();
        playerVelocity.scale(speed);
        this.setVelocity(playerVelocity.x, playerVelocity.y);
        //----------------------------------------------------------------
        
        // listen for mouse input to shoot
        this.scene.input.on('pointerdown', function(pointer) {
            this.shootPressed = true;
        }, this);
        //----------------------------------------------------------------

        //if the mouse is pressed & the cooldown is not active, then it shoots
        if(this.shootPressed){
            if(this.ratecheck){
                this.scene.shoot_sound.play();
                this.shootBullet(this.scene);   //shoots the Bullet
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
        this.scene.input.on('pointerup', function(pointer) {
            this.shootPressed = false;
        },this);
        //----------------------------------------------------------------
    }
    shootBullet() {

        //x & y position of the cursor(where the bullet is supposed to go)
        let x = this.scene.cursorCords.x;
        let y = this.scene.cursorCords.y;
        //----------------------------------------------------------------

        //Calculation of the Vector applied to the Bullet
        let BulletVector = new Phaser.Math.Vector2();   //Vector

        BulletVector.x = x - this.x;
        BulletVector.y = y - this.y;

        BulletVector.normalize();

        BulletVector.scale(this.bulletspeed + Func.rand(-0.5,0.5));  //sets the speed of the Bullet with a random value between -0.5 and 0.5 to make it look better
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

        //copying the vector
        let BulletVector2 = new Phaser.Math.Vector2();
        BulletVector2.x = BulletVector.x;
        BulletVector2.y = BulletVector.y;
        BulletVector2.normalize();
        BulletVector2.scale(10)

        // Create a new bullet sprite at the player's position
        const bullet = this.scene.matter.add.sprite(this.x + BulletVector2.x, this.y + BulletVector2.y, 'bullet');
        this.scene.EntityLayer.add(bullet);
        //----------------------------------------------------------------

        //Custom collider for bullet
        const {Body,Bodies} = Phaser.Physics.Matter.Matter;
        var newcollider = Bodies.circle(bullet.x,bullet.y,4,{label:'BulletCollider'})
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