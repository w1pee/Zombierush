export default class MapGen {
    //function that generates perlin noise that is used at the ground
    static PerlinNoise(width, height, frequency, amplitude) {
        // Create a 2D array to store the noise values
        const noise = new Array(height).fill(null).map(() => new Array(width));
      
        // Generate random gradient vectors
        const gradients = [];
        for (let i = 0; i < width; i++) {
            gradients.push([]);
            for (let j = 0; j < height; j++) {
                const angle = Math.random() * 2 * Math.PI;
                gradients[i].push({ x: Math.cos(angle), y: Math.sin(angle) });
            }
        }
      
        // Smoothstep function
        function smoothstep(t) {
            return t * t * (3 - 2 * t);
        }
      
        // Dot product function
        function dotProduct(a, b) {
            return a.x * b.x + a.y * b.y;
        }
        // Interpolation function
        function interpolate(a, b, t) {
            return a * (1 - t) + b * t;
        }  
      
        // Generate Perlin noise
        for (let i = 0; i < width; i++) {
            for (let j = 0; j < height; j++) {
                const cellX = i / width * frequency;
                const cellY = j / height * frequency;
        
                const gridX = Math.floor(cellX);
                const gridY = Math.floor(cellY);
        
                const topLeftGradient = gradients[gridX][gridY];
                const topRightGradient = gradients[gridX + 1][gridY];
                const bottomLeftGradient = gradients[gridX][gridY + 1];
                const bottomRightGradient = gradients[gridX + 1][gridY + 1];
        
                const distanceToTopLeft = { x: cellX - gridX, y: cellY - gridY };
                const distanceToTopRight = { x: cellX - (gridX + 1), y: cellY - gridY };
                const distanceToBottomLeft = { x: cellX - gridX, y: cellY - (gridY + 1) };
                const distanceToBottomRight = { x: cellX - (gridX + 1), y: cellY - (gridY + 1) };
        
                const dotProductTopLeft = dotProduct(distanceToTopLeft, topLeftGradient);
                const dotProductTopRight = dotProduct(distanceToTopRight, topRightGradient);
                const dotProductBottomLeft = dotProduct(distanceToBottomLeft, bottomLeftGradient);
                const dotProductBottomRight = dotProduct(distanceToBottomRight, bottomRightGradient);
        
                const u = smoothstep(distanceToTopLeft.x);
                const v = smoothstep(distanceToTopLeft.y);
        
                const noiseValue = interpolate(
                    interpolate(dotProductTopLeft, dotProductTopRight, u),
                    interpolate(dotProductBottomLeft, dotProductBottomRight, u),
                    v
            );
            noise[i][j] = (noiseValue + 1) / 2 * amplitude; // Normalize and scale the value
            }
        }
        return noise;
    }
    static buildings(){
        var Grid_result = new Array(100).fill(null).map(() => new Array(100));

        for (let i = 0; i < 100; i++) {
            for (let j = 0; j < 100; j++) {
                Grid_result[i][j] = -1;
            }
        }
        
        var Grid_Base = new Array(10).fill(null).map(() => new Array(10));

        //choosing random locations for Buidlings
        for (let i = 0; i < 10; i++) {
            for (let j = 0; j < 10; j++) {
                Grid_Base[i][j] = Math.round(Math.random());
            }
        }

        //assigning the spots to the result grid
        for (let i = 1; i < 9; i++) {
            for (let j = 1; j < 9; j++) {
                if (Grid_Base[i][j] === 1) {
                    Assign((i*10),(j*10));
                }
            }
        }

        function Assign(x,y){

            const OffsetX = Math.round(Math.random()*4 - 2);
            const OffsetY = Math.round(Math.random()*4 - 2);
            
            //choosing a 7x7 Structure that will be inserted into the Grid
            const choose = Math.round(Math.random()*6);
            const Structure = Struct(choose);

            //System for filling in the Structure
            //automatically fills in needed tile because im too lazy to do it manually
            for (let i = 1; i < 8; i++) {
                for (let j = 1; j < 8; j++) {
                    if(Structure[i][j] === 1){
                        let connections = [0,0,0,0,0,0,0,0]; 
                        
                        if(Structure[i-1][j-1]  != 0){connections[0] = 1}
                        if(Structure[i-1][j]    != 0){connections[1] = 1}
                        if(Structure[i-1][j+1]  != 0){connections[2] = 1};
                        //------------------------------------------
                        if(Structure[i][j-1]    != 0){connections[3] = 1};    
                        if(Structure[i][j+1]    != 0){connections[4] = 1}; 
                        //------------------------------------------
                        if(Structure[i+1][j-1]  != 0){connections[5] = 1}; 
                        if(Structure[i+1][j]    != 0){connections[6] = 1}; 
                        if(Structure[i+1][j+1]  != 0){connections[7] = 1}; 

                        const element = chooseTile(decode(connections.reverse()));

                        Grid_result[x+i-4+OffsetX][y+j-4+OffsetY] = element;
                    }
                }
            }

            //here are all the buildings saved
            //saved as 9x9 but only uses 7x7
            //please leave a border of 0s
            //else it doesnt work // the border is used as a buffer // easiest solution it think
            function Struct(value){
                switch(value){
                    case 0:
                        return [
                            [0,0,0,0,0,0,0,0,0],
                            [0,1,1,1,1,1,0,0,0],
                            [0,1,1,1,1,1,1,1,0],
                            [0,1,1,1,1,1,1,1,0],
                            [0,1,1,1,1,1,1,1,0],
                            [0,1,1,1,1,1,1,1,0],
                            [0,1,1,1,1,1,1,1,0],
                            [0,1,1,1,1,1,0,0,0],
                            [0,0,0,0,0,0,0,0,0]
                        ];
                    case 1:
                        return[
                            [0,0,0,0,0,0,0,0,0],
                            [0,0,1,1,1,1,1,0,0],
                            [0,0,1,1,1,1,1,0,0],
                            [0,0,1,1,1,1,1,0,0],
                            [0,0,1,1,1,1,1,0,0],
                            [0,0,1,1,1,1,1,0,0],
                            [0,0,1,1,1,1,1,0,0],
                            [0,0,1,1,1,1,1,0,0],
                            [0,0,0,0,0,0,0,0,0]
                        ]
                    case 2:
                        return[
                            [0,0,0,0,0,0,0,0,0],
                            [0,0,0,0,0,0,0,0,0],
                            [0,1,1,1,1,1,1,1,0],
                            [0,1,1,1,1,1,1,1,0],
                            [0,1,1,1,1,1,1,1,0],
                            [0,1,1,1,1,1,1,1,0],
                            [0,1,1,1,1,1,1,1,0],
                            [0,0,0,0,0,0,0,0,0],
                            [0,0,0,0,0,0,0,0,0]
                        ]
                    case 3:
                        return[
                            [0,0,0,0,0,0,0,0,0],
                            [0,0,1,1,1,1,1,0,0],
                            [0,1,1,1,1,1,1,1,0],
                            [0,1,1,1,1,1,1,1,0],
                            [0,1,1,1,1,1,1,1,0],
                            [0,1,1,1,1,1,1,1,0],
                            [0,1,1,1,1,1,1,1,0],
                            [0,0,0,0,0,0,0,0,0],
                            [0,0,0,0,0,0,0,0,0]
                        ]
                    case 4:
                        return[
                            [0,0,0,0,0,0,0,0,0],
                            [0,0,0,0,0,0,0,0,0],
                            [0,1,1,1,1,1,1,1,0],
                            [0,1,1,1,1,1,1,1,0],
                            [0,1,1,1,1,1,1,1,0],
                            [0,1,1,1,1,1,1,1,0],
                            [0,1,1,1,1,1,0,0,0],
                            [0,1,1,1,1,1,0,0,0],
                            [0,0,0,0,0,0,0,0,0]
                        ]
                    case 5:
                        return[
                            [0,0,0,0,0,0,0,0,0],
                            [0,0,0,0,0,0,0,0,0],
                            [0,1,1,1,1,1,1,1,0],
                            [0,1,1,1,1,1,1,1,0],
                            [0,1,1,1,1,1,1,1,0],
                            [0,1,1,1,1,1,1,1,0],
                            [0,1,1,1,1,1,0,0,0],
                            [0,1,1,1,1,1,0,0,0],
                            [0,0,0,0,0,0,0,0,0]
                        ]
                    case 6:
                        return [
                            [0,0,0,0,0,0,0,0,0],
                            [0,1,1,1,1,1,1,1,0],
                            [0,1,1,1,1,1,1,1,0],
                            [0,1,1,1,1,1,1,1,0],
                            [0,1,1,1,1,1,1,1,0],
                            [0,1,1,1,1,0,0,0,0],
                            [0,1,1,1,1,0,0,0,0],
                            [0,0,0,0,0,0,0,0,0],
                            [0,0,0,0,0,0,0,0,0]
                        ];

                }
            }

            function decode(array){
                let number = 0;
                for (let i = 0; i < array.length; i++) {
                    if (array[i] == true) {
                        number += Math.pow(2,i);
                    }
                }
                return number;
            }
            //this is stupid
            function chooseTile(n){
                switch(n){
                    case 11: return 0;
                    case 15: return 0;
                    case 22: return 2;
                    case 23: return 2;
                    case 31: return 1;
                    case 43: return 0;
                    case 104: return 30;
    
                    case 107: return 15;
                    case 127: return 3;
                    case 150: return 2;
                    case 159: return 1;
                    case 208: return 32;
                    case 214: return 17;
    
                    case 223: return 4;
                    case 240: return 32;
                    case 246: return 17;
                    case 248: return 31;
                    case 251: return 18;
                    case 252: return 31;
                    case 254: return 19;
    
                    case 255: return 16;
                    default: console.log(n); return 5;
                }
            }
        }

        //making a border
        for (let i = 0; i < 100; i++) {
            Grid_result[i][0] = 20;
            Grid_result[i][99] = 22;
            Grid_result[0][i] = 6;
            Grid_result[99][i] = 36;
        }

        Grid_result[0][0] = 5;
        Grid_result[0][99] = 7;
        Grid_result[99][0] = 35;
        Grid_result[99][99] = 37;
        //-----------
        return Grid_result;
    }
}