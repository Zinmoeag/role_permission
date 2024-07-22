import { verify } from 'crypto';
import {z} from 'zod';

export const ReturnUser = z.object({
    id : z.string(),
    name : z.string(),
    email : z.string().email(),
    avatar : z.string(),
    roleId : z.number(),
    role_name : z.string(),
    verify : z.boolean(),
    permission : z.array(z.object({
        id : z.number(),
        action : z.string(),
        resource : z.string(),
    }))
});