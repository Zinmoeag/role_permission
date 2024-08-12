import prisma from "../../../prisma/client";
import AppError, { errorKinds } from "../../utils/AppError";

type room =  {
    room_id : string,
    room_name : string,
    created_At : Date,
    role_id : number,
    role : string,
}

class RoomService {
    getRoom(data : any){
        return {
            room_id : data.room.id,
            room_name : data.room.name,
            created_At : data.room.created_At,
            role_id : data.role.role_id,
            role : data.role.role_name,
        }
    }

    async getAllRoomByUser(id : string) : Promise<room[]> {

        try{
            const roomData = await prisma.roomUser.findMany({
                where : {
                    user_id : id
                },
                include : {
                    room : true,
                    role : true
                },
            })
    
            const rooms : room[] = roomData.map((data : any) => {
                return this.getRoom(data);
            })
    
            return rooms;
        }catch(e){
            throw AppError.new(errorKinds.badRequest, "Invalid User id")
        }
    }

    async createRoomAndConnect(room_name : string, user_id : string) {
        const newRoom = await prisma.room.create({
            data : {
                name : room_name,
                users : {
                    create : {
                        user : {
                            connect : {
                                id : user_id
                            }
                        },
                        role : {
                            connect : {
                                role_id : 2
                            }
                        },
                    }
                },

            }
        })

        console.log(newRoom);
        return this.getRoom(newRoom)
    }
}

export default RoomService;