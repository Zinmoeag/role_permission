import prisma from "../client";
import { faker } from '@faker-js/faker';
import SeederModel from "./model/SeederModel";

class UserSeeder extends SeederModel
{
    async seed (){
        console.log("running user seeding")
        await prisma.user.createMany({
            data : [
                ...Array.from({length  : 10}).map(() => ({
                    name : faker.internet.userName(),
                    email : faker.internet.email(),
                    password : faker.internet.password(),
                }))
            ]
        })
    }
}

export default UserSeeder;