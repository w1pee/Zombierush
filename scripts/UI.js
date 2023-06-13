export default class UIScene extends Phaser.Scene{
    constructor(){
        super('UIScene');
        // Phaser.Scene.call(this, { key: 'UIScene', active: true });
    }

    create(){
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
        function gethighs(){
            var jqXHR = $.ajax({
                            url : 'scripts/UI.php',
                            type : 'POST',
                            success : function (result) {
                                console.log(result);
                            },
                            error : function(){
                                console.log('error');
                            }
                            })
                        return jqXHR;
                        }
        var highs = gethighs().done();

        //Highscore // sync with database later
        this.add.text(0,0,'Highsore', { font: '50px', fontFamily: 'CustomFont', fill: '#000000',backgroundColor :'#ffffff'});
        this.Highscore = this.add.text(0,50, 50, { font: '50px', fill: '#ffffff', backgroundColor :'#000000'});
        //----------------------------------------------------------------

        //score
        this.ScoreText = this.add.text(window.innerWidth/2,0,'Score',{font: '50px', fontFamily: 'CustomFont', fill: '#000000',backgroundColor :'#ffffff'});
        this.ScoreText.setOrigin(0.5,0);
        this.Score = this.add.text(window.innerWidth/2,50,0,{font: '50px', fontFamily: 'CustomFont', fill: '#ffffff', backgroundColor :'#000000'});
        this.Score.setOrigin(0.5,0);
        //----------------------------------------------------------------

        //Zombie number
        this.ZombieText = this.add.text(0,window.innerheight/2,'Zombies: ', {font: '50px', fontFamily: 'CustomFont', fill: '#000000'})
        const myGame = this.scene.get('MainScene');
        //----------------------------------------------------------------

        //Dash availability
        this.DashText = this.add.text(0,800,'Dash', {font: '50px', fontFamily: 'CustomFont', fill: '#000000'})
        this.DashText.setOrigin(0,1)

        //function that syncs the values from the MainScene to UI(here)
        myGame.events.on('setValues', function(zmb,score,Dash,Highscore)
        {
            this.ZombieText.text = 'Zombies: ' + zmb;
            this.Score.text = score;
            this.Highscore.text = Highscore;

            if(Dash){
                this.DashText.setStyle({fill: '#23C552'});
            }
            else{
                this.DashText.setStyle({fill: '#F84F31'});
            }

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