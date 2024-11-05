import { PrismaClient } from '@prisma/client';  
import Room, { room } from '../entitity/Room';
import Role, { role } from '../entitity/Role';

class RoleRepository {
    private prisma: PrismaClient;  

    constructor(prisma: PrismaClient) {
        this.prisma = prisma;
    }

    async getAll(): Promise<Role[]> {
        const roles = await this.prisma.role.findMany();
        return roles.map((role) => new Role({...role}));
    }

    async get(id : number) : Promise<Role | null> {
        const role = await this.prisma.role.findFirst({
            where : {
                role_id : id,
            },
        });

        return role;
    }

    async checkId(id: number): Promise<boolean> {
        const role = await this.prisma.role.findUnique({
            where: {
                role_id : id
            },
        });

        return role !== null;
    }

    async create({ role_id, role_name }: { role_id: string, role_name: string }): Promise<Role> {
        const newRole = await this.prisma.role.create({
            data: {
                role_id: Number(role_id),
                role_name: role_name
            }
        })

        return new Role({...newRole});
    }
}

export default RoleRepository;
