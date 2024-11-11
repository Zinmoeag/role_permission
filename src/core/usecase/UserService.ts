import prisma from "../../../prisma/client";
import UserRepository from "../infrastructure/UserRepository";
import Pagination from "../../utils/Pagination";
import { DisplayUser } from "../entitity/User";
import AppError, { errorKinds } from "../../utils/AppError";
import { Prisma } from "@prisma/client";
import { IAvailableFlter } from "../infrastructure/Query/type";
import { whereQuery } from "../infrastructure/Query/QueryBuilder";

type PaginationParams = {
  page: number;
  limit: number;
};

type FilterParams = {
  searchBy: string;
  searchValue: string;
};

type OrderParams = {
  sort: string;
  sortBy: string;
};

type UserFilter = {
  role?: string;
};

type UserListParaps = {
  pagination: PaginationParams;
  filter: FilterParams & UserFilter;
  order?: OrderParams;
};

class UserService {
  private repository: UserRepository = new UserRepository(prisma);

  private availableFilter: IAvailableFlter<Prisma.UserWhereInput> = {
    name: (filter) => {
      return {
        where: {
          name: {
            contains: String(filter),
          },
        },
      };
    },
    email: (filter) => {
      return {
        where: {
          email: {
            equals: String(filter),
          },
        },
      };
    },
    role: (filter) => {
      return {
        where: {
          role: {
            role_name: String(filter),
          },
        },
      };
    },
    OR: (filter) => {
      return {
        where: {
          OR: [
            {
              name: {
                contains: String(filter),
              },
            },
            {
              email: {
                contains: String(filter),
              },
            },
          ],
        },
      };
    },
  };

  async getUsers(userlist: UserListParaps) {
    const { page, limit } = userlist.pagination;
    const { searchBy, searchValue, role } = userlist.filter;

    try {
      // FILTER ===============
      const dBFilter = whereQuery({
        appliedFilters: {
          [searchBy === "all" ? "OR" : searchBy]: searchValue,
          role: role === "all" ? undefined : role,
        },
        availableFilters: this.availableFilter,
      });

      // SORTING ===============
      const sorting = {} as any;
      if (userlist.order) {
        const { sort, sortBy } = userlist.order;
        Object.assign(sorting, { [sort]: sortBy });
      }

      // PAGINATION ===============
      const totalCount = await this.repository.count({
        where: dBFilter.where,
      });
      const pagination = Pagination.new<DisplayUser[]>(page, limit, totalCount);

      const rawUser = await this.repository.getAll({
        where: dBFilter.where,
        include: {
          role: {
            include: {
              permissions: true,
            },
          },
        },
        take: pagination.limit,
        skip: pagination.startIdx,
        orderBy: {
          ...sorting,
        },
      });

      const paginatedUsers = rawUser.map((user: any) => new DisplayUser(user));
      return pagination.setPaginatedData(paginatedUsers).getResult();
    } catch (e) {
      if (e instanceof AppError) {
        throw e;
      }
      throw AppError.new(
        errorKinds.internalServerError,
        "Internal Server Error"
      );
    }
  }
}

export default UserService;
