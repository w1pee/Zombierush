import Func from './Func.js'
export default class MapGen{

    static NoiseMap(width,height,freq){
        
        let map = this.generatePerlinNoise(width,height,freq,5);

        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                map[y][x] = Math.round((((map[y][x]) + freq) / freq) * 2) + 1;
            }
        }
        console.log(map);
        return map;
    }

    static generatePerlinNoise(width, height, octaves, persistence) {
        // Initialize the 2D array
        const noiseArray = new Array(height);
        for (let i = 0; i < height; i++) {
            noiseArray[i] = new Array(width);
            for (let n = 0; n < width; n++) {
                noiseArray[i][n] = 0;
            }
        }
      
        // Generate random gradients
        const gradients = new Array(width * height * 2);
        for (let i = 0; i < width * height * 2; i += 2) {
            const angle = Math.random() * 2 * Math.PI;
            gradients[i] = Math.cos(angle);
            gradients[i + 1] = Math.sin(angle);
        }
      
        // Interpolate values based on gradients
        const lerp = (a, b, t) => a + t * (b - a);
      
        // Smoothly interpolate between values
        const smoothstep = t => t * t * (3 - 2 * t);
      
        // Generate Perlin noise values for each octave
        for (let octave = 0; octave < octaves; octave++) {
            const octaveScale = Math.pow(2, octave);
            const octaveAmplitude = Math.pow(persistence, octave);
        
            for (let y = 0; y < height; y++) {
                for (let x = 0; x < width; x++) {
                    const cellX = x / width * octaveScale;
                    const cellY = y / height * octaveScale;
            
                    const cellX1 = Math.floor(cellX);
                    const cellY1 = Math.floor(cellY);
                    const cellX2 = cellX1 + 1;
                    const cellY2 = cellY1 + 1;

                    const dx1 = cellX - cellX1;
                    const dy1 = cellY - cellY1;
                    const dx2 = cellX - cellX2;
                    const dy2 = cellY - cellY2;

                    const index1 = (cellY1 * width + cellX1) * 2;
                    const index2 = (cellY1 * width + cellX2) * 2;
                    const index3 = (cellY2 * width + cellX1) * 2;
                    const index4 = (cellY2 * width + cellX2) * 2;

                    const dot1 = gradients[index1] * dx1 + gradients[index1 + 1] * dy1;
                    const dot2 = gradients[index2] * dx2 + gradients[index2 + 1] * dy1;
                    const dot3 = gradients[index3] * dx1 + gradients[index3 + 1] * dy2;
                    const dot4 = gradients[index4] * dx2 + gradients[index4 + 1] * dy2;

                    const weightX = smoothstep(dx1);
                    const weightY = smoothstep(dy1);

                    const valueX1 = lerp(dot1, dot2, weightX);
                    const valueX2 = lerp(dot3, dot4, weightX);
            
                    // Accumulate the Perlin noise values for each octave
                    noiseArray[y][x] += lerp(valueX1, valueX2, weightY) * octaveAmplitude;
                }
            }
        }
        return noiseArray;
    }

    static SinNoise(width,height,stretch){

        var array = new Array(width);
        for (let i = 0; i < width; i++) {
            array[i] = new Array(height);

            var st = stretch + (1 / Func.rand(20,22));
            for (let n = 0; n < height; n++) {
                array[i][n] = Math.sin((n * st));
            }
        }
        return array;
    }
}