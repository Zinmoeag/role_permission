import { Response, Request, NextFunction } from "express";
import { verifyWithRS256 } from "../helper";
import AppError, { errorKinds } from "../utils/AppError";
import { TokenUser, User } from "../core/entitity/User";
import UserRepository from "../core/infrastructure/UserRepository";
import prisma, { UserWithRoleAndPermission } from "../../prisma/client";

const userRepo = new UserRepository(prisma);

export interface AuthRequest extends Request {
  user?: User;
}


/**
 * middleware function that verify token
 *  middleware function that deserilize user into request 
 */

export const deserilizedUser = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {    

    let access_token;

      if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      access_token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies.auth_access) {
      access_token = req.cookies.auth_access;
    }

    if (!access_token) {
      return next(new AppError(errorKinds.notAuthorized, 'You are not logged in'));
    }
    
    const decodedUser = verifyWithRS256<TokenUser>(access_token, "ACCESS_TOKEN_PUBLIC_KEY");
    if (!decodedUser)
      throw AppError.new(errorKinds.notAuthorized, "session expired");

    const user : UserWithRoleAndPermission = await userRepo.get({
      where : {
        id : decodedUser.id
      },
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
    })

    req.user = new User(user);

    next();
  } catch (e) {
    if (e instanceof AppError) {
      next(e);
    } else {
      next(AppError.new(errorKinds.notAuthorized, "internal Server Error"));
    }
  }
};

export const verifyRoles = (allowedRoles: any[]) => {
  return function (req: AuthRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user || !req.user?.role_name)
        throw AppError.new(errorKinds.forbidden, "User not allowed");

      const isRoleAllow = allowedRoles.includes(req.user.role_name);
      if (!isRoleAllow)
        throw AppError.new(errorKinds.forbidden, "User not Allowed");

      next()
    } catch (e) {
      if (e instanceof AppError) {
        next(e);
      } else {  
        next(AppError.new(errorKinds.forbidden, "internal serer Error"));
      }
    }
  };
};


export const allowedVerifiedUser = () => {
  return function (req: AuthRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user || !req.user?.verify) {
        throw AppError.new(errorKinds.unVerifyAccount, "Please Verify Your Account");
      }
      next();
    } catch (e) {
      if (e instanceof AppError) {
        next(e);
      } else {
        next(AppError.new(errorKinds.notAuthorized, "internal Server Error"));
      }
    }
  };
}

// export default authMiddleWare;
