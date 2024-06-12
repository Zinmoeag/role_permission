import {z} from 'zod';

export const ReturnUser = z.object({
    id : z.string(),
    name : z.string(),
    email : z.string().email(),
    roleId : z.number(),
    role_name : z.string(),
})