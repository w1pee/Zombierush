export default class Zombie extends Phaser.Physics.Matter.Sprite {
    constructor(data){
        let {scene,x,y,texture,Health,Speed} = data;
        super(scene.matter.world,x,y,texture);
        this.scene.add.existing(this);

        const {Body,Bodies} = Phaser.Physics.Matter.Matter;
        var Collider = Bodies.circle(this.x,this.y,3,{isSensor:false,label:'ZombieCollider'});
        var Sensor = Bodies.circle(this.x,this.y,15,{isSensor:true,label:'ZombieSensor'});
        const compundBody = Body.create({
            parts:[Collider,Sensor],
            frictionAir:0.2,
        });
        this.setExistingBody(compundBody);
        this.setFixedRotation();

        this.Health = Health;
        this.Speed = Speed * rand(0.8,1.2);     //adds a little random to Speed
        this.healthTxt = scene.add.text(this.x,this.y,this.Health ,{ font: '10px Arial', fill: '#000000' });    //text that displays the current health of the zombie
        this.healthTxt.setOrigin(0.5,0.5)

    }

    static preload(scene){
        scene.load.image('zombie', 'assets/Zombies/images/Zombies.png');
    }

    update(scene){
        
        //updating text position
        this.healthTxt.x = this.x;
        this.healthTxt.y = this.y+12;
        //----------------------------------------------------------------

        //updating healthtext
        this.healthTxt.text = this.Health;
        //----------------------------------------------------------------

        //when cursor in reach show health
        if(scene.cursorCords[0]+50 > this.x && scene.cursorCords[0]-50 < this.x){
            if(scene.cursorCords[1]+50 > this.y && scene.cursorCords[1]-50 < this.y){
                this.healthTxt.alpha = 1;
            }
        }
        else{
            this.healthTxt.alpha = 0;
        }
        //----------------------------------------------------------------
        scene.moveZombie = function(path,zombie){
            if(path != null && zombie != null && path != undefined && zombie != undefined && path.length > 1){
                var vector = new Phaser.Math.Vector2();
                vector.x = path[1].x - Math.round(zombie.x/16);
                vector.y = path[1].y - Math.round(zombie.y/16);
                
                vector.normalize();
                vector.scale(zombie.Speed);
                zombie.setVelocity(vector.x, vector.y);
            }
        };
        
        scene.pathfinder.findPath(Math.round(this.x/16), Math.round(this.y/16), Math.round(scene.player.x/16), Math.round(scene.player.y/16), function(path) {
            if (path === null) {
                console.warn("Path was not found.");
            } 
            else {
                scene.moveZombie.bind(this)(path,this);
            }
        }.bind(this));
        scene.pathfinder.calculate();
    }
    takeDamage(dmg){
        this.Health -= dmg;

        this.tint =  0xfc2803;

        this.scene.time.delayedCall(100, () => {
            this.clearTint();
        });
    }
}

function rand(min, max) {
    return Math.round(Math.random() * (max - min) + min);
}