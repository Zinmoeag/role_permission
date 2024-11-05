import prisma from "../client";
import SeederModel from "./model/SeederModel";


const roles = [
    {id : 1 , name : 'USER'},
    {id : 2 , name : "ADMIN"},
];



class RoleSeeder extends SeederModel
{
    async seed (){
        try{
            for(const role of roles){
                await prisma.role.upsert({
                    where : {
                        role_name : role.name,
                        role_id : role.id
                    },
                    update : {},
                    create : {
                        role_name : role.name,
                        role_id : role.id
                    }
                })   
            }
        }catch(e){
            // console.log(e
            // console.log(Result("failed"))
        }
    }
}

export default RoleSeeder;