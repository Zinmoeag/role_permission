import prisma from "../client";
import SeederModel from "./model/SeederModel";

const roles = [
    {id : 1 , name : 'USER'},
    {id : 2 , name : "ADMIN"},
];

const permissions = [
    {permission_name : "WRITE", description : "thsi si write", roles : [0,1]},
    {permission_name : "ACCESS_TO_DASHBOARD", description : "thsi si only admin can do that", roles : [1]},
]

class PersmissionSeeder extends SeederModel{
    async seed(){
        for (const permission of permissions) {
            await prisma.permission.create({
                data : {
                    permission_name : permission.permission_name,
                    description : permission.description,
                    roles : {
                        create : permission.roles.map(role => ({
                            role : {
                                connectOrCreate : {
                                    where : {
                                        role_id : roles[role].id,
                                    },
                                    create : {
                                        role_id : roles[role].id,
                                        role_name : roles[role].name
                                    }
                                }
                            }
                        }))
                    }
                }
            })
        }
    }
}

export default PersmissionSeeder;