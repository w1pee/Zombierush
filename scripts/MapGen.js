export default class MapGen {
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
}