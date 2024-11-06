import { Prisma, PrismaClient } from "@prisma/client";
import AppError from "../../utils/AppError";
import { errorKinds } from "../../utils/AppError";

class UserRepository {
  private prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  count = async () => {
    return await this.prisma.user.count();
  }

  get = async (arg : Prisma.UserFindUniqueArgs): Promise<any> => {
    return await this.prisma.user.findUnique(arg);
  };

  getAll = async (arg : Prisma.UserFindManyArgs): Promise<any> => {
    try{
      return await this.prisma.user.findMany(arg);
    }catch(e){
      throw AppError.new(errorKinds.internalServerError, "Prisma Error")
    }
  };

  create = async (args : Prisma.UserCreateArgs): Promise<any> => {
    try{
      return await this.prisma.user.create(args);
    }catch(e){
      console.log(e)
    }
  };

  update = async (args : Prisma.UserUpdateArgs) : Promise<any> => {
    try {
      return await this.prisma.user.update(args);
    }catch(e){
      throw AppError.new(errorKinds.internalServerError, "Failed to Update User Data");
    }
  };

  getUser = async (where: any): Promise<any> => {
    try {
      const result = await this.prisma.user.findUnique({
        where: {
          ...where,
        },
        include: {
          role: {
            include: {
              permissions: {
                include: {
                  permission: true,
                },
              },
            },
          },
        },
      });
      return result;
    } catch (err) {
      throw AppError.new(
        errorKinds.internalServerError,
        "Internal Server Error"
      );
    }
  };
}

export default UserRepository;
