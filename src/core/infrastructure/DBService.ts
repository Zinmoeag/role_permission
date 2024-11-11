import { PrismaClient, Prisma } from "@prisma/client";
import AppError, { errorKinds } from "../../utils/AppError";
import { ar } from "@faker-js/faker";

class DBService {
  private prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  getAll = async (arg: any[]): Promise<any> => {
    try {
      return await this.prisma.user.findMany(...arg);
    } catch (e) {
      throw AppError.new(errorKinds.internalServerError, "Prisma Error");
    }
  }
}

export default DBService;
