import { Request, Response, NextFunction } from "express";
import { AuthRequest } from "../middlewares/authMiddleware";
import AppError, { errorKinds } from "../utils/AppError";
import RoomService from "../core/usecase/RoomService";
import RoomRepository from "../core/infrastructure/RoomRepository";
import prisma from "../../prisma/client";

const roomService = new RoomService(new RoomRepository(prisma));

class RoomController {
    async getRooms(req : Request, res : Response, next : NextFunction) {
        const authReq = req as AuthRequest
        try{
            const rooms = await roomService.getAllRoomByUser(authReq.user.id);
            res.json({rooms}).end();
        }catch(e){
            next(AppError.new(errorKinds.internalServerError, "internal server error"))
        }
    }

    async create(req : Request, res : Response, next : NextFunction){
        const authReq = req as AuthRequest;
        const newRoom = await roomService.createRoom("Hello Room", authReq.user.id);
        res.json(newRoom).end();
    }
}

const roomController = new RoomController();
export default roomController;