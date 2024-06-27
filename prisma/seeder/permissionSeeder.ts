import { access } from "fs";
import prisma from "../client";
import SeederModel from "./model/SeederModel";

const permissions = [
    {action : "CREATE" , resource : "USER"},
    {action : "READ" , resource : "USER"},
    {action : "UPDATE" , resource : "USER"},
    {action : "DELETE" , resource : "USER"},
];

class PersmissionSeeder extends SeederModel{
    async seed(){
        for (const permission of permissions) {
            await prisma.permission.create({
              data : {
                action : permission.action,
                resource : permission.resource
              }  
            })
        }
    }
}

export default PersmissionSeeder;