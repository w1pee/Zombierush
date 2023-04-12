export default class UIScene extends Phaser.Scene{
    constructor(){
        super('UIScene');
        Phaser.Scene.call(this, { key: 'UIScene', active: true });
    }
    preload(){

    }

    create(){
        this.health = this.add.text(0,0,'text', { font: '80px Arial', fill: '#000000' });
    }

    update(){
    }
}