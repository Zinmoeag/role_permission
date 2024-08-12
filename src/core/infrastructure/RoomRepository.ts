import Room from "../entitity/Room";
import AppError, { errorKinds } from "../../utils/AppError";

class RoomRepository {

    private prisma : any;

    constructor(prisma : any){
        this.prisma = prisma;
    }

    async getAllRoomByUser(id : string) : Promise<Room[]> {

        try{
            const roomData = await this.prisma.roomUser.findMany({
                where : {
                    user_id : id
                },
                include : {
                    room : true,
                    role : true
                },
            })
    
            const rooms : Room[] = roomData.map((data : any) => {
                return new Room(data.room.id, data.room.name, data.room.created_At, data.room.updated_At);
            })
    
            return rooms;
        }catch(e){
            throw AppError.new(errorKinds.badRequest, "Invalid User id")
        }
    }

    async createRoom(room_name : string, user_id : string) : Promise<Room> {
        const newRoom = await this.prisma.room.create({
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
                }
            }
        })
        return newRoom; 
    }

    async getRoom(id : string) : Promise<Room> {
        const roomData = await this.prisma.room.findUnique({
            where : {
                id : id
            },
        })
        return roomData;
    }
    
}

export default RoomRepository;