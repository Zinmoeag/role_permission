import prisma from "../../../prisma/client";
import UserRepository from "../infrastructure/UserRepository";
import Pagination from "../../utils/Pagination";
import { DisplayUser } from "../entitity/User";
import AppError, { errorKinds } from "../../utils/AppError";

const userRepo = new UserRepository(prisma);
class UserService {
  async getPaginatedUsers(page: number, limit: number) {
    try {
      const count = await userRepo.count();

      const pagination = Pagination.new<DisplayUser[]>(page, limit, count);

      const rawUser = await userRepo.getAll({
        include: {
          role: {
            include: {
              permissions: true,
            },
          },
        },
        take: pagination.limit,
        skip: pagination.startIdx,

      });

      const paginatedUsers = rawUser.map((user: any) => new DisplayUser(user));

      return pagination.setPaginatedData(paginatedUsers).getResult();
    } catch (e) {
        if(e instanceof AppError){
            throw e
        }
        throw AppError.new(errorKinds.internalServerError, "Internal Server Error")
    }
  }
}

export default UserService;
