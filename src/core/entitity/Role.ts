export type role =  {
    role_id : number,
    role_name : string,
}

class Role {
    constructor({
        role_id,
        role_name,
    } : role ){
        return {
            role_id : role_id,
            role_name : role_name,
        }
    }
}   

export default Role;