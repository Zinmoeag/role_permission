import { PrismaClient, Prisma } from "@prisma/client";
import Permission from "../entitity/Permission";

class PermissionRepository {
  private model = "permission";
  private prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  async getAll(): Promise<Permission[]> {
    const permissions = await this.prisma["permission"].findMany();
    return permissions.map((per) => new Permission({ ...per }));
  }

  get = async (arg: Prisma.PermissionFindUniqueArgs): Promise<any> => {
    return await this.prisma["permission"].findUnique(arg);
  };

  findBy = async (arg : Prisma.PermissionFindManyArgs) => {
    return await this.prisma["permission"].findMany(arg);
  }

  // async checkId(id: number): Promise<boolean> {
  //     const role = await this.prisma.role.findUnique({
  //         where: {
  //             role_id : id
  //         },
  //     });

  //     return role !== null;
  // }

  // async create({ role_id, role_name }: { role_id: string, role_name: string }): Promise<Role> {
  //     const newRole = await this.prisma.role.create({
  //         data: {
  //             role_id: Number(role_id),
  //             role_name: role_name
  //         }
  //     })

  //     return new Role({...newRole});
  // }
}

export default PermissionRepository;
