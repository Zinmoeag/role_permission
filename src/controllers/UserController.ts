import { Request, Response, NextFunction } from "express";
import UserService from "../core/usecase/UserService";
import AppError from "../utils/AppError";
import { errorKinds } from "../utils/AppError";

const userService = new UserService();

class UserController {
  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      //pagination
      const limit = parseInt(req.query.limit as string);
      const page = parseInt(req.query.page as string);

      //filter
      const searchBy = req.query.searchBy as string;
      const searchValue = req.query.searchValue as string;
      const role = req.query.role as string || "all";

      // sorting
      const sort = req.query.sort as string;
      const sortBy = req.query.sortBy as string;

      const paginatedData = await userService.getUsers({
        pagination: {
          page: page,
          limit: limit,
        },
        filter: {
          searchBy: searchBy,
          searchValue: searchValue,
          role: role,
        },
        order: sort && sortBy ? { sort: sort, sortBy: sortBy } : undefined,
      });

      res.status(200).json({
        users: paginatedData,
      });
    } catch (err) {
      if (err instanceof AppError) {
        next(err);
      }
      next(
        AppError.new(
          errorKinds.internalServerError,
          "Internal server error with get all users"
        )
      );
    }
  }
}

export default UserController;
