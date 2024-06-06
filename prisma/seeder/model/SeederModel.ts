abstract class SeederModel {
    seeders:SeederModel[] = [];
    
    constructor(){
        // this.data = data; 
    }
    abstract seed() : Promise<void>
}

export default SeederModel;