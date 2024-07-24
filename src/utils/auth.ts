import { ReturnUser } from "../types/user"
import {z} from "zod";

export const getUser = (data : any) : z.infer<typeof ReturnUser> => {
    return {
        id : data.id,
        name : data.name,
        verify : data.verify,
        email : data.email,
        avatar : data.avatar,
        roleId : data.roleId,
        role_name : data.role.role_name,
        permission : data.role.permissions.map((data: any) => data.permission),
    }
}