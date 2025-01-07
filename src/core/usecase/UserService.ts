import prisma from "../../../prisma/client";
import UserRepository from "../infrastructure/UserRepository";
import Pagination from "../../utils/Pagination";
import { DisplayUser } from "../entitity/User";
import AppError, { errorKinds } from "../../utils/AppError";
import { Prisma } from "@prisma/client";
import { IAvailableFlter, IDefaultFilter } from "../infrastructure/Query/type";
import { ApplyFilter } from "../infrastructure/Query/QueryBuilder";
import catchError, { tryAndThrow } from "../../utils/catchError";
import ExcelJs from "exceljs";

type SearchParams = {
  searchBy: string;
  searchValue: string;
};

type PaginationParams = {
  page: number;
  limit: number;
};

type SortingParams = {
  sort: string;
  sortBy: string;
};

type ListParams<F> = {
  filter: F & SearchParams;
  sorting?: SortingParams;
};

type ListParamsWithPagination<F> = {
  pagination: PaginationParams;
  filter: F & SearchParams;
  sorting?: SortingParams;
};

type UserFilter = {
  role?: string;
};

class UserService {
  private repository: UserRepository = new UserRepository(prisma);

  private defaultFilter: IDefaultFilter<Prisma.UserWhereInput> = {
    role: () => {
      return {
        role: {
          OR: [
            {
              role_name: "ADMIN",
            },
            {
              role_name: "USER",
            },
          ],
        },
      };
    },
  };

  private availableFilter: IAvailableFlter<Prisma.UserWhereInput> = {
    name: ({ filter }) => {
      return {
        name: {
          contains: String(filter),
        },
      };
    },
    email: ({ filter }) => {
      return {
        email: {
          equals: String(filter),
        },
      };
    },
    role: ({ filter }) => {
      return {
        role: {
          role_name: String(filter),
        },
      };
    },
    OR: ({ filter }) => {
      return {
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
      };
    },
  };

  private availableSorting: IAvailableFlter<Prisma.UserOrderByWithAggregationInput> =
    {
      name: ({ filter }) => {
        return {
          name: filter as Prisma.SortOrder,
        };
      },
  };

  async getUsers(userlist: ListParamsWithPagination<UserFilter>) {
    const { searchBy, searchValue, role } = userlist.filter;
    try {
      // FILTER ===============
      let whereFilter = ApplyFilter({
        appliedFilters: {
          [searchBy === "all" ? "OR" : searchBy]: searchValue,
          [role === "all" ? "undefined" : "role"]: role,
        },
        defaultFilters: this.defaultFilter,
        availableFilters: this.availableFilter,
      });

      // SORTING ===============
      const sortFilter = ApplyFilter({
        appliedFilters: {
          name: "desc",
        },
        availableFilters: this.availableSorting,
      });

      // PAGINATION ===============
      const [error, totalCount] = await catchError(
        this.repository.count({
          where: whereFilter.result,
        })
      );

      if (error) throw error;

      let paginationOptions = {
        page: 1,
        limit: 10,
      } as any;

      if (userlist.pagination) {
        const { page, limit } = userlist.pagination;
        paginationOptions = {
          page: page || 1,
          limit: limit || 10,
        };
      }

      const pagination = Pagination.new<DisplayUser[]>(
        paginationOptions.page,
        paginationOptions.limit,
        totalCount
      );

      const [userError, rawUser] = await catchError(
        this.repository.getAll({
          where: whereFilter.result,
          include: {
            role: {
              include: {
                permissions: true,
              },
            },
          },
          take: pagination.limit,
          skip: pagination.startIdx,
          orderBy: sortFilter.result,
        })
      );

      if (userError) throw error;

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

  async getUserSheet(userlist: ListParams<UserFilter>) {
    // return;
    const { searchBy, searchValue, role } = userlist.filter;

    // FILTER ===============
    const whereFilter = ApplyFilter({
      appliedFilters: {
        [searchBy === "all" ? "OR" : searchBy]: searchValue,
        role: role === "all" ? undefined : role,
      },
      defaultFilters: this.defaultFilter,
      availableFilters: this.availableFilter,
    });

    // SORTING ===============
    const sorting = {} as any;
    if (userlist.sorting) {
      const { sort, sortBy } = userlist.sorting;
      Object.assign(sorting, { [sort]: sortBy });
    }

    const [userError, rawUser] = await catchError(
      this.repository.getAll({
        where: whereFilter.result,
        include: {
          role: {
            include: {
              permissions: true,
            },
          },
        },
        orderBy: {
          ...sorting,
        },
      })
    );

    if (userError) throw userError;

    const workBook = new ExcelJs.Workbook();
    const workSheet = workBook.addWorksheet("users");
    workSheet.columns = [
      {
        header: "ID",
        key: "id",
        style: { alignment: { horizontal: "center" } },
        width: 50,
      },
      { header: "name", key: "name", width: 30 },
      { header: "email", key: "email", width: 50 },
      { header: "role", key: "role_name", width: 30 },
    ];

    const rows = rawUser.map((user: any) => ({
      id: user.id,
      name: user.name,
      email: user.email,
      role_name: user.role.role_name,
    }));

    workSheet.addRows(rows);
    const fileBuffer = await workBook.xlsx.writeBuffer();

    return fileBuffer;
  }
}

export default UserService;
