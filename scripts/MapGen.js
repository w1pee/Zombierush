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

            const Tile = 16;

            const OffsetX = Math.round(Math.random()*6 - 3);
            const OffsetY = Math.round(Math.random()*6 - 3);
            
            //choosing a 9x9 Structure that will be inserted into the Grid
            const choose = Math.round(Math.random()*4);
            const Structure = Struct(choose);

            //System for filling in the Structure in
            for (let i = 0; i < 9; i++) {
                for (let j = 0; j < 9; j++) {
                    var element;
                    if(Structure[i][j] === 1){
                        element = 16;
                    }
                    else{
                        element = -1;
                    }
                    Grid_result[x+i-4+OffsetX][y+j-4+OffsetY] = element;
                }
            }

            //here are all the buildings saved
            function Struct(value){
                switch(value){
                    case 0:
                        return [
                            [0,0,1,1,1,1,0,0,0],
                            [0,0,1,1,1,1,0,0,0],
                            [0,0,1,1,1,1,0,0,0],
                            [0,0,1,1,1,1,1,1,0],
                            [0,0,1,1,1,1,1,1,0],
                            [0,0,1,1,1,1,1,1,0],
                            [0,0,1,1,1,1,0,0,0],
                            [0,0,1,1,1,1,0,0,0],
                            [0,0,0,0,0,0,0,0,0]
                        ];
                    case 1:
                        return [
                            [0,0,0,0,0,1,1,1,1],
                            [0,0,0,0,0,1,1,1,1],
                            [0,0,0,0,0,1,1,1,1],
                            [0,0,0,1,1,1,1,1,1],
                            [0,0,0,1,1,1,1,1,1],
                            [0,0,0,1,1,1,1,1,1],
                            [0,0,0,0,0,0,0,0,0],
                            [0,0,0,0,0,0,0,0,0],
                            [0,0,0,0,0,0,0,0,0]
                        ];
                    case 2:
                        return [
                            [0,0,0,0,0,0,0,0,0],
                            [0,0,0,0,0,0,0,0,0],
                            [0,0,0,0,0,0,0,0,0],
                            [0,1,1,1,1,1,1,0,0],
                            [0,1,1,1,1,1,1,0,0],
                            [0,1,1,1,1,1,1,0,0],
                            [0,0,0,0,1,1,1,0,0],
                            [0,0,0,0,0,0,0,0,0],
                            [0,0,0,0,0,0,0,0,0]
                        ];
                    case 3:
                        return [
                            [0,0,0,0,0,0,0,0,0],
                            [0,0,0,0,0,0,0,0,0],
                            [0,0,0,0,0,0,0,0,0],
                            [0,0,0,1,1,1,1,1,0],
                            [0,0,0,1,1,1,1,1,0],
                            [0,0,0,1,1,1,1,1,0],
                            [0,0,0,0,1,1,1,0,0],
                            [0,0,0,0,0,0,0,0,0],
                            [0,0,0,0,0,0,0,0,0]
                        ];
                    case 4:
                        return [
                            [0,0,0,0,0,0,0,0,0],
                            [0,0,0,0,0,0,0,0,0],
                            [0,0,0,1,1,1,0,0,0],
                            [0,0,0,1,1,1,0,0,0],
                            [0,0,0,1,1,1,0,0,0],
                            [0,0,0,1,1,1,0,0,0],
                            [0,0,0,0,0,0,0,0,0],
                            [0,0,0,0,0,0,0,0,0],
                            [0,0,0,0,0,0,0,0,0]
                        ];
                }
            }
        }
        return Grid_result;
    }
}