export default class MapGen{

    static NoiseMap(){
        
        let map = this.generatePerlinNoise(100,100);

        for (let i = 0; i < map.length; i++) {
            for (let n = 0; n < map.length; n++) {
                map[i][n] = ((map[i][n] + 1) / 2) * 255;
            }
        }
        return map;
    }

    // Generate a 2D array filled with Perlin noise
    static generatePerlinNoise(width, height) {
        // Initialize the 2D array
        const noiseArray = new Array(height);
        for (let i = 0; i < height; i++) {
        noiseArray[i] = new Array(width);
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
    
        // Generate Perlin noise values
        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                const cellX = x / width;
                const cellY = y / height;
        
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
        
                noiseArray[y][x] = lerp(valueX1, valueX2, weightY);
            }
        }
        return noiseArray;
    }
}