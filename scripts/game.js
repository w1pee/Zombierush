import MainScene from "./MainScene.js";
import Pause, { GameOver,Start} from "./Scenes.js";
import UIScene from "./UI.js";

//plugin for Path finding
// import BoardPlugin from 'phaser3-rex-plugins/plugins/board-plugin.js';

var config = {
  type: Phaser.Auto,
  width: window.innerWidth,
  height:  window.innerHeight-80,
  parent: 'container',
  scene: [Start,MainScene,UIScene,Pause,GameOver],
  backgroundColor: '#0000ff',
  scale:{
    zoom: 2,
  },
  physics: {
    default: 'matter',
    matter: {
      gravity: { y:0},
      debug: false
    }
  },
  plugins: {
    scene: {
      plugin: PhaserMatterCollisionPlugin,
      key: 'matterCollision',
      mapping:'matterCollision',
    }
  },
  //capping the fps at 60fps
  fps: {
    target: 60,
    forceSetTimeOut: true
  },
  
};
var game = new Phaser.Game(config);