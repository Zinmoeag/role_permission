import prisma from "../../../prisma/client";
import AppError, { errorKinds } from "../../utils/AppError";
import RoomRepository from "../infrastructure/RoomRepository";
import Room from "../entitity/Room";

class RoomService {
    private RoomRepository : RoomRepository;

    constructor(repository : RoomRepository) {
        this.RoomRepository = repository
    }

    async getAllRoomByUser(id : string) : Promise<Room[]> {
        try{
           const rooms = this.RoomRepository.getAllRoomByUser(id);
           return rooms;   
        }catch(e){
            throw AppError.new(errorKinds.badRequest, "Invalid User id")
        }
    }

    async createRoom(room_name : string, user_id : string) : Promise<Room> {
        try{
            const newRoom = await this.RoomRepository.createRoom(room_name , user_id);
            return newRoom
        }catch(e){
            throw AppError.new(errorKinds.badRequest, "Invalid user Id")
        }
    }
}

export default RoomService;