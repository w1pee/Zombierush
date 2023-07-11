export default class UIScene extends Phaser.Scene{
    constructor(){
        super('UIScene');
        // Phaser.Scene.call(this, { key: 'UIScene', active: true });
    }
    preload(){
        this.load.image('stamina', 'assets/StaminaArrow.png');
    }

    create(){
        this.load.plugin('rexdropshadowpipelineplugin', 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexdropshadowpipelineplugin.min.js', true);
        //basic UI design
        //function gethighs(){
            //var xhr = new XMLHttpRequest();
            //xhr.open('GET', 'scripts/UI.php', true);
    
            //xhr.onload = function(){
                //if(this.status == 200){
                    //console.log(this.responseText);
                //}
            //}
    
            //xhr.send();
            //}
        //getting Highscore data from database using ajax call //incomplete
        //function gethighs(){
           // var jqXHR = $.ajax({
                          //  url : 'scripts/UI.php',
                           // type : 'POST',
                            //success : function (result) {
                            //    console.log(result);
                          //  },
                           // error : function(){
                           //     console.log('error');
                       //     }
                       //     })
                      //  return jqXHR;
                     //   }
       // var highs = gethighs().done();

        //Highscore // sync with database later
        this.add.text(0,0,'Highscore', { font: '25px', fontFamily: 'CustomFont', fill: '#000000',backgroundColor :'#ffffff'});
        this.Highscore = this.add.text(0,25, 50, { font: '50px', fill: '#ffffff', backgroundColor :'#000000'});
        //----------------------------------------------------------------

        //score
        this.ScoreText = this.add.text(window.innerWidth/2,0,'Score',{font: '25px', fontFamily: 'CustomFont', fill: '#000000',backgroundColor :'#ffffff'});
        this.ScoreText.setOrigin(0.5,0);
        this.Score = this.add.text(window.innerWidth/2,25,0,{font: '50px', fontFamily: 'CustomFont', fill: '#ffffff', backgroundColor :'#000000'});
        this.Score.setOrigin(0.5,0);
        //----------------------------------------------------------------

        //Zombie number
        this.ZombieText = this.add.text(window.innerWidth,0,'Zombies', {font: '25px', fontFamily: 'CustomFont', fill: '#000000', backgroundColor :'#ffffff'});
        this.ZombieText.setOrigin(1,0);
        this.Zombie = this.add.text(window.innerWidth,25,0,{font: '50px', fontFamily: 'CustomFont', fill: '#ffffff', backgroundColor :'#000000'});
        this.Zombie.setOrigin(1,0);
        const myGame = this.scene.get('MainScene');
        //----------------------------------------------------------------

        this.stam1 = this.add.sprite(50 ,window.innerHeight - 120,'stamina').setScale(5).setOrigin(0.5,0.5);
        this.stam2 = this.add.sprite(70 ,window.innerHeight - 120,'stamina').setScale(5).setOrigin(0.5,0.5);
        this.stam3 = this.add.sprite(90,window.innerHeight - 120,'stamina').setScale(5).setOrigin(0.5,0.5);
        this.stam4 = this.add.sprite(110,window.innerHeight - 120,'stamina').setScale(5).setOrigin(0.5,0.5);
        this.stam5 = this.add.sprite(130,window.innerHeight - 120,'stamina').setScale(5).setOrigin(0.5,0.5);

        //dropshadow using plugin
        this.pipelineInstance = this.plugins.get('rexdropshadowpipelineplugin');
        this.pipelineInstance.add(this.stam1,{
            angle: 270,
            distance: 5,
            shadowColor: 0x000000,
            alpha: 0.6,
            name: 'rexDropShadowPostFx'
        });
        this.pipelineInstance = this.plugins.get('rexdropshadowpipelineplugin');
        this.pipelineInstance.add(this.stam2,{
            angle: 270,
            distance: 5,
            shadowColor: 0x000000,
            alpha: 0.6,
            name: 'rexDropShadowPostFx'
        });
        this.pipelineInstance = this.plugins.get('rexdropshadowpipelineplugin');
        this.pipelineInstance.add(this.stam3,{
            angle: 270,
            distance: 5,
            shadowColor: 0x000000,
            alpha: 0.6,
            name: 'rexDropShadowPostFx'
        });
        this.pipelineInstance = this.plugins.get('rexdropshadowpipelineplugin');
        this.pipelineInstance.add(this.stam4,{
            angle: 270,
            distance: 5,
            shadowColor: 0x000000,
            alpha: 0.6,
            name: 'rexDropShadowPostFx'
        });
        this.pipelineInstance = this.plugins.get('rexdropshadowpipelineplugin');
        this.pipelineInstance.add(this.stam5,{
            angle: 270,
            distance: 5,
            shadowColor: 0x000000,
            alpha: 0.6,
            name: 'rexDropShadowPostFx'
        });
        //----------------------------------------------------------------

        //function that syncs the values from the MainScene to UI(here)
        myGame.events.on('setValues', function(zmb,score,Dash,Highscore)
        {
            this.Zombie.text = zmb;
            this.Score.text = score;
            this.Highscore.text = Highscore;

            if(Dash >= 1){this.stam1.alpha = 1;}
            else{this.stam1.alpha = 0;}
            if(Dash >= 2){this.stam2.alpha = 1;}
            else{this.stam2.alpha = 0;}
            if(Dash >= 3){this.stam3.alpha = 1;}
            else{this.stam3.alpha = 0;}
            if(Dash >= 4){this.stam4.alpha = 1;}
            else{this.stam4.alpha = 0;}
            if(Dash >= 5){this.stam5.alpha = 1;}
            else{this.stam5.alpha = 0;}

        },this);
        //----------------------------------------------------------------

        //this function announces the wave, after 2 seconds it deletes itself
        myGame.events.on('announce', function(n)
        {
            let announce = this.add.text(window.innerWidth/2,200,'Wave ' + n, {font: '100px', fill: '#FFFFFFFF',fontFamily: 'CustomFont'});
            announce.setOrigin(0.5,0.5);
            this.time.delayedCall(2000, () => {
                announce.destroy();
            });
        },this);
        //----------------------------------------------------------------

        myGame.events.on('StatsUpgrade', function(){
            let Firerate = this.add.text(1280,400,'+1 firerate',{font: '40px', fill: '#FED766',fontFamily: 'CustomFont'});
            Firerate.setOrigin(1,0.5);
            let DashSpeed = this.add.text(1280,450,'-10% Dash Cooldown', {font: '40px', fill: '#FED766',fontFamily: 'CustomFont'});
            DashSpeed.setOrigin(1,0.5);
            this.time.delayedCall(2000, () => {
                DashSpeed.destroy();
                Firerate.destroy();
            });
        },this);
    }
}