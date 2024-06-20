import { Request, Response, NextFunction } from "express";
import { AuthRequest } from "./authMiddleware";
import AppError, { errorKinds } from "../utils/AppError";

class CheckRoleMiddleware {
    static isAdmin = (req : Request, res : Response, next : NextFunction) => {
        const authReq = req as AuthRequest;
        if(authReq.user.role_name !== "ADMIN") return AppError.new(errorKinds.forbidden, "forbidden").response(res);
        next();
    }
}

export default CheckRoleMiddleware;