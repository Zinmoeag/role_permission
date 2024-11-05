import { Request, Response, NextFunction } from "express"
import RoleService from "../core/usecase/RoleService";
import RoleRepository from "../core/infrastructure/RoleRepository";
import prisma from "../../prisma/client";
import AppError from "../utils/AppError";
import { errorKinds } from "../utils/AppError";
import { resolveObjectURL } from "buffer";


const roleService = new RoleService(new RoleRepository(prisma));

class RoleController {
    async CheckID(req : Request, res : Response, next : NextFunction){
        const id = req.params.id;
        const isExist = await roleService.checkId(id);
        res.json({
            isExist : isExist
        })
    }

    async List(req : Request, res : Response, next : NextFunction){
        const roles = await roleService.getAll();
        res.json({
            roles : roles
        })
    }

    async Create(req : Request, res : Response, next : NextFunction){
        const body = req.body;
        try{
            const role = await roleService.create(body);
            res.json(role);
        }catch(err){
           if(err instanceof AppError) return err.response(res) 
           else return AppError.new(errorKinds.internalServerError, "internal server error").response(res)
        }
    }
}

export default RoleController