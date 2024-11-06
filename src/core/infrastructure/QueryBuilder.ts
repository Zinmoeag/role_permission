export class QueryBuilder {
    private static whereObj = {};
    private query = () => {};
    constructor() {
        console.log(QueryBuilder.whereObj)
    }

    static where(key : any, value : any, operator : "=" | "!=" | ">" | "<" | ">=" | "<=") {
        this.whereObj = {
            [key] : value
        };
        return new QueryBuilder();
    }
}