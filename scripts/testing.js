import Map from './MapGen.js';

var Canvas = document.getElementById("myCanvas");
var ctx = Canvas.getContext('2d');

// ctx.fillStyle = '#7CFEF0';
// ctx.fillRect(0, 0, 100, 100);

// ctx.fillStyle = '#2A6041';
// ctx.fillRect(25,25,50,50);

let array = Map.PerlinNoise(100,100,8,1);

for (let i = 0; i < array.length; i++) {

    for (let n = 0; n < array.length; n++) {

        const value = Math.round(array[i][n]*254 + 1);
        let hex = value.toString(16);
        if(hex.length == 1){
            hex = '0' + hex;
        }
        ctx.fillStyle = '#' + hex + hex + hex;
        ctx.fillRect(i,n,1,1);
    }
}