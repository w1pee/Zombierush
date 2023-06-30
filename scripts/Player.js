import Func from "./Func.js";
export default class Player extends Phaser.Physics.Matter.Sprite {
    constructor(data){
        let {scene,x,y,texture,frame} = data;
        super(scene.matter.world,x,y,texture,frame);
        this.scene.add.existing(this);

        const {Body,Bodies} = Phaser.Physics.Matter.Matter;
        var playerCollider = Bodies.circle(this.x,this.y,9,{isSensor:false,label:'playerCollider'});
        const compundBody = Body.create({
            parts:[playerCollider],
            frictionAir:0.5,
        });
        this.setExistingBody(compundBody);
        this.setFixedRotation();
        //atribute for the player
        this.speed = 2.5;           //Player Speed
        this.Stamina = 5;
        this.dash = false;
        this.check = true;

        this.bulletspeed = 7.5;     //Bullet Speed
        this.firerate = 1;          //the rate the Player fires at(shots per second)
        this.Damage = 10;           //Damage the bullets inflicts onto zombies
        this.ratecheck = true;      //checks if the cooldown is over
        this.shootPressed = false;  //checks if the cursor is down

        this.scene.shoot_sound = this.scene.sound.add('shoot1', {loop:false});
    }

    static preload(scene){
        scene.load.atlas('default_player1wak', 'assets/MainPlayer/default_player1wak.png', 'assets/MainPlayer/default_player1wak_atlas.json');
        scene.load.animation('default_player1wak_anims', 'assets/MainPlayer/default_player1wak_anim.json');    
        scene.load.image('bullet', 'assets/bullet.png'); 

        scene.load.audio('shoot1',['sounds/shoot.wav']);
    }

    update(){
        if(this.Stamina < 5){
            this.Stamina+= 1/180;
        }

        //check for input to dash
        if(this.check){
            if(this.inputkeys.Dash.isDown && this.Stamina >= 1){
            this.Stamina-= 1;
            this.dash = true;
            this.check = false;
        }}

        if(!this.inputkeys.Dash.isDown){
            this.check = true;
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
  
  
        playerVelocity.normalize();
        playerVelocity.scale(this.speed);
        this.setVelocity(playerVelocity.x, playerVelocity.y);
        //----------------------------------------------------------------

        if(this.dash){
            let DashVector = new Phaser.Math.Vector2();

            DashVector.x = this.scene.cursorCords.x - this.x;
            DashVector.y = this.scene.cursorCords.y - this.y;

            DashVector.normalize();
            DashVector.scale(this.speed*8);

            this.setVelocity(DashVector.x, DashVector.y);

            this.scene.time.delayedCall(100, () => {
                this.dash = false;
            });
        }
        
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
        BulletVector2.scale(15);

        // Create a new bullet sprite at the player's position
        const bullet = this.scene.matter.add.sprite(this.x + BulletVector2.x, this.y + BulletVector2.y, 'bullet');
        this.scene.EntityLayer.add(bullet);
        bullet.name = 'Bullet';
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