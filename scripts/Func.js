export default class Func{
    //function for rounding a number to the lower value
    static MinRound(number){
        var NewNumber = Math.round(number);
        if(NewNumber > number){
            return (NewNumber - 1);
        }
        return NewNumber;
    }
    //----------------------------------------------------------------

    //function for generating random number with min and max value
    static rand(min, max) {
        return Math.round(Math.random() * (max - min) + min);
    }
    //----------------------------------------------------------------

    //function for getting the distance from two points
    static Distance(X1,X2,Y1,Y2){
        const newX = Math.pow((X1 - X2),2);
        const newY = Math.pow((Y1 - Y2),2);
        return (Math.pow(newX+newY,0.5));
    }
}