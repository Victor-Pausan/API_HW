export class MyRecipie{
    constructor(obj){
        this.id = obj.id,
        this.data = {
            recipie: obj.data.recipie,
            ingredients: obj.data.ingredients,
            instructions: obj.data.instructions
        }
    }
}