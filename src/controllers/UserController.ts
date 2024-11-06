import { Request, Response, NextFunction } from "express";
import UserService from "../core/usecase/UserService";
import AppError from "../utils/AppError";
import { errorKinds } from "../utils/AppError";

const userService = new UserService();

class UserController {
  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const limit = parseInt(req.query.limit as string);
      const page = parseInt(req.query.page as string);

      const paginatedData = await userService.getPaginatedUsers(page, limit);
      res.status(200).json({
        users: paginatedData,
      });
    } catch (err) {
        if(err instanceof AppError) {
            next(err)
        }
        next(AppError.new(errorKinds.internalServerError, "Internal server error with get all users"));
    }
  }
}

export default UserController;
