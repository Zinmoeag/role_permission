export class Permission {
    public id : number;
    public action : string;
    public resource : string;

    constructor(data : any){
        this.id = data.id;
        this.action = data.action;
        this.resource = data.resource;
    }
}