import { Prisma } from "@prisma/client";

const {PrismaClient} = require('@prisma/client')
const prisma = new PrismaClient();

export type UserWithRoleAndPermission = Prisma.UserGetPayload<{
    include : {
        role : {
            include : {
                permissions : {
                    include : {
                        permission : true
                    }
                }
            }
        }
    }
}>


export type Permission = Prisma.PermissionGroupByOutputType

// export type Userdd = Prisma.UserFindUniqueArgs;


export default prisma;