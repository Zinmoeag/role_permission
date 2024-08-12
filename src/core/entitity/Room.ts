export type room =  {
    room_id : string,
    room_name : string,
    created_At : Date,
    role_id? : number,
    role? : string,
}

class Room {
    constructor(
        room_id : string,
        room_name : string,
        created_At : Date,
        updated_At : Date,
    ){
        return {
            room_id : room_id,
            room_name : room_name,
            created_At : created_At,
            updated_At : updated_At
        }
    }
}   

export default Room;