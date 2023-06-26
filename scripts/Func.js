export default class Func{
    //function for generating random number with min and max value
    static rand(min, max) {
        return Math.round(Math.random() * (max - min) + min);
    }
    //----------------------------------------------------------------

    //function for getting the distance from two points
    static Distance(obj1,obj2){
        const newX = Math.pow((obj1.x - obj2.x),2);
        const newY = Math.pow((obj1.y - obj2.y),2);
        return (Math.pow(newX+newY,0.5));
    }
}