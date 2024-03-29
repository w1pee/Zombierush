import Func from "./Func.js";
export default class Zombie extends Phaser.Physics.Matter.Sprite {
    constructor(data){
        let {scene,x,y,texture} = data;
        super(scene.matter.world,x,y,texture);
        this.scene.add.existing(this);

        this.setFixedRotation();

        this.Health = 20;
        this.Speed = ((Math.random()*1.25)+0.5);     //adds a little random to Speed
        this.healthTxt = scene.add.text(this.x,this.y,this.Health ,{ font: '9px', fontFamily: 'CustomFont', color: '#ffffff',stroke: '#000000',strokeThickness:3});
        this.healthTxt.setOrigin(0.5,0.5)

        this.OldPlayerX = 0;
        this.OldPlayerY = 0;

        this.pathposition;
        this.name = 'Zombie';
    }

    static preload(scene){
        scene.load.atlas('default_zombiedino1', 'assets/Zombies/default_zombiedino1.png', 'assets/Zombies/default_zombiedino1_atlas.json');
        scene.load.animation('default_zombiedino1_anims', 'assets/Zombies/default_zombiedino1_anim.json'); 
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
        if(Func.Distance({x: this.x, y: this.y},{x: this.scene.cursorCords.x, y:this.scene.cursorCords.y}) < 75){
            this.healthTxt.alpha = 1;
        }
        else{
            this.healthTxt.alpha = 0;
        }
        //----------------------------------------------------------------

        //Player position
        const PlayerX = Math.floor(this.scene.player.x / 16);
        const PlayerY = Math.floor(this.scene.player.y / 16);
        //----------------------------------------------------------------

        //finding Path
        //When Player changes tile hes on, Zombie searches for a new path
        if(this.OldPlayerX != PlayerX || this.OldPlayerY != PlayerY){
            this.scene.pathfinder.findPath(Math.floor(this.x/16), Math.floor(this.y/16), PlayerX, PlayerY, function(path) {
                if (path === null) {
                    console.warn("Path was not found.");
                }
                else {
                    this.path = path;
                    this.pathposition = 1;
                }
            }.bind(this));
            this.scene.pathfinder.calculate();
            this.OldPlayerX = PlayerX;
            this.OldPlayerY = PlayerY;
        }
        //----------------------------------------------------------------

        //Movement
        if(this.path.length >= 1){
            this.Move();
            if(this.pathposition <= 1){
                this.pathposition = 1;
            }
            if(this.pathposition >= this.path.length - 1){
                this.pathposition = this.path.length - 1;
            }
            if(Math.floor(this.x / 16) === this.path[this.pathposition-1].x && Math.floor(this.y / 16) === this.path[this.pathposition-1].y){
                this.pathposition++;
            }
        }
        //----------------------------------------------------------------
    }
    //function for the Zombie taking damage
    takeDamage(dmg){
        this.Health -= dmg;
        this.scene.zdeath.play();

        this.tint =  0xfc2803;

        this.scene.time.delayedCall(100, () => {
            this.clearTint();
        });
       
    }
    //function for moving the Zombie
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
        if(vector.x > 0.1){
                    this.anims.play('walkrightzombiedino1', true);
                }
                //needs to be fixed that when zombiedino goes into the left direction screen, the walkleftz animation plays
                //fixidea: if statement by locating Players direction from the zombiedino     
                if(vector.x < 0.1){
                    this.anims.play('walkleftzombiedino1', true);
                } 
                if(vector.x == 0 || Math.abs(vector.y) == 0){
                    this.anims.play('idlezombiedino1', true);
                }   
    }
    kill(){
        //generating coin with random value
        let value;
        switch(Func.rand(0,9)){
            case 0:
            case 1:
            case 2:
            case 3:
            case 4:
            case 5: value = '10';break;
            case 6: 
            case 7: 
            case 8: value = '25';break
            case 9: value = '75';
            default:
        }
        new Coin({scene:this.scene,x:this.x,y:this.y,texture:value});

        //deleting Zombie
        this.healthTxt.destroy();
    }
}

export class Coin extends Phaser.Physics.Matter.Sprite{
    constructor(data){
        let {scene,x,y,texture} = data;
        super(scene.matter.world,x,y,texture);
        this.scene.add.existing(this);

        //idk why, but i have to create a body here so it does not collide
        const {Body,Bodies} = Phaser.Physics.Matter.Matter;
        var Sensor = Bodies.circle(this.x,this.y,15,{isSensor:true,label:'CoinSensor'});
        const compundBody = Body.create({
            parts: [Sensor],
        });
        this.setExistingBody(compundBody);
        this.setFixedRotation();

        this.setCollisionGroup(-1);
        this.setScale(0.75);
        this.setOrigin(0.5,0.5);
        this.scene.EntityLayer.add([this]);

        // if(this.texture.key == '10'){
            // this.anims.play('coin10shining', true);
        // }
        // if(this.texture.key == '25'){
            // this.anims.play('coin25shining', true);
        // }
        // if(this.texture.key == '75'){
            // this.anims.play('coin75shining', true);
        // }


        this.name = 'Coin';
    }

    static preload(scene){
        scene.load.atlas('10', 'assets/Coins/default_coin10.png', 'assets/Coins/default_coin10_atlas.json');
        scene.load.animation('default_coin10_anims', 'assets/Coins/default_coin10_anim.json');
        scene.load.atlas('25', 'assets/Coins/default_coin25.png', 'assets/Coins/default_coin25_atlas.json');
        scene.load.animation('default_coin25_anims', 'assets/Coins/default_coin25_anim.json');    
        scene.load.atlas('75', 'assets/Coins/default_coin75.png', 'assets/Coins/default_coin75_atlas.json');
        scene.load.animation('default_coin75_anims', 'assets/Coins/default_coin75_anim.json');        
    }
    //returning the value of the coin
    value(){
        return parseInt(this.texture.key);  //converting string to int
    }
}