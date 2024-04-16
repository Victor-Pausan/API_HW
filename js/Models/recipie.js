export class Recipie{
    ingredients = [];
    index = 1;

    constructor(obj){
        this.name = obj.strMeal;
        this.instructions = obj.strInstructions;
        this.picture = obj.strMealThumb;
        while(obj[`strIngredient${this.index}`]){
            this.ingredients.push({
                name: obj[`strIngredient${this.index}`],
                measure: obj[`strMeasure${this.index}`]
            });
            this.index++;
        }
    }
}