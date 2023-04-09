import MainScene from "./MainScene.js";

var config = {
  type: Phaser.Auto,
  width: 1280,
  height: 800,
  parent: 'container',
  scene: [MainScene],
  backgroundColor: '#0000ff',
  scale:{
    zoom: 2,
  },
  physics: {
    default: 'matter',
    matter: {
      gravity: { y:0},
      debug: true
    }
  },
  plugins: {
    scene: {
      plugin: PhaserMatterCollisionPlugin,
      key: 'matterCollision',
      mapping:'matterCollision'
    }
  }
};
new Phaser.Game(config);