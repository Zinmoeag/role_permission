import RoleRepository from "../infrastructure/RoleRepository";
import Role, { role } from "../entitity/Role";
import AppError, { errorKinds } from "../../utils/AppError";

class RoleService {
    private RoleRepository

    constructor(RoleRepository : RoleRepository){
        this.RoleRepository = RoleRepository;
    }

    async checkId(id : string): Promise<boolean>{
        return this.RoleRepository.checkId(Number(id));
    }

    async getAll() : Promise<Role> {
        return this.RoleRepository.getAll();
    }

    async create({role_id, role_name} : {role_id : string, role_name : string}) : Promise<Role> {
        if(await this.checkId(role_id)){
            throw new AppError(errorKinds.validationFailed, "Rolerole_id already exists");
        }else{
            return this.RoleRepository.create({role_id : role_id, role_name :role_name});
        }
    }
}

export default RoleService;