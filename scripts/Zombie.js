export default class Zombie extends Phaser.Physics.Matter.Sprite {
    constructor(data,SpawnHealth,SpawnDamage){
        let {scene,x,y,texture,frame} = data;
        super(scene.matter.world,x,y,texture);
        this.scene.add.existing(this);

        const {Body,Bodies} = Phaser.Physics.Matter.Matter;
        var Collider = Bodies.circle(this.x,this.y,7,{isSensor:false,label:'ZombieCollider'});
        const compundBody = Body.create({
            parts:[Collider],
            frictionAir:0.2,
        });
        this.setExistingBody(compundBody);
        this.setFixedRotation();

        this.Health = SpawnHealth;      //Health of the Zombie
        this.Speed = rand(0.3,1.4);     //speed the zombie moves at, is randomized
        this.Damage = SpawnDamage;      //the amount of Damage the zombie does to the player
        this.healthTxt = scene.add.text(this.x,this.y,this.Health ,{ font: '10px Arial', fill: '#000000' });    //text that displays the current health of the zombie
        this.healthTxt.setOrigin(0.5,0.5)
    }

    static preload(scene){
        scene.load.image('zombie', 'assets/Zombies/images/Zombies.png');
    }
    update(Player){

        //updating text position
        this.healthTxt.x = this.x;
        this.healthTxt.y = this.y+12;
        //----------------------------------------------------------------

        //updating healthtext
        this.healthTxt.text = this.Health;
        //----------------------------------------------------------------

        //when player in reach show health
        if(Player.x+50 > this.x && Player.x-50 < this.x){
            if(Player.y+50 > this.y && Player.y-50 < this.y){
                this.healthTxt.alpha = 1;
            }
        }
        else{
            this.healthTxt.alpha = 0;
        }
        //----------------------------------------------------------------

        let Velocity = new Phaser.Math.Vector2();
        //simple system for Following Player    //bad way to do this    //will improve that later on
        if (this.x > Player.x + 10) {
            Velocity.x = -1;
        }
        else if (this.x < Player.x - 10){
            Velocity.x = 1;
        }
        else {
            Velocity.x = 0;
        }

        if (this.y > Player.y + 10) {
            Velocity.y = -1;
        }
        else if (this.y < Player.y - 10){
            Velocity.y = 1;
        }
        else {
            Velocity.y = 0;
        }

        Velocity.normalize();
        Velocity.scale(this.Speed);
        this.setVelocity(Velocity.x, Velocity.y);
        //----------------------------------------------------------------
    }
}
function rand(min, max) {
    return Math.round(Math.random() * (max - min) + min);
}