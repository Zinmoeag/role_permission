import { exclude } from "../helper"
import {z} from "zod";
import { ReturnUser } from "../types/user";
import { getUser } from "../utils/auth";

export default abstract class Service {
    abstract _exclude : string[];

    acesssTokenExp = "20s";
    refreshTokenExp = "1d";

    exclude(data : Object){
        const filteredEntries = exclude(this._exclude, data);
        return filteredEntries;
    }

    getUser(rawUser : any) : z.infer<typeof ReturnUser>{   
        return getUser(rawUser);
    }
}