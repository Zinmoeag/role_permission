import { exclude } from "../helper"
import {z} from "zod";
import { ReturnUser } from "../types/user";

export default abstract class Service {
    abstract _exclude : string[];

    exclude(data : Object){
        const filteredEntries = exclude(this._exclude, data);
        // console.log("filter",filteredEntries)
        return filteredEntries;
    }

    getUser(rawUser : any) : z.infer<typeof ReturnUser>{
        return {
            id : rawUser.id,
            name : rawUser.name,
            email : rawUser.email,
            roleId : rawUser.roleId,
            role_name : rawUser.role.role_name,
            permission : rawUser.role.permission,
        }
    }
}