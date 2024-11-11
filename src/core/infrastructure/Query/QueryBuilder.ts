import { availableParallelism } from "os";
import { IApplyFiltersInput, IApplyFiltersOutput } from "./type";
import prisma from "../../../../prisma/client";
import { Prisma } from "@prisma/client";
import AppError, { errorKinds } from "../../../utils/AppError";

export const whereQuery = <T extends object>(
  params: IApplyFiltersInput<T>
): IApplyFiltersOutput<T> => {
  try {
    const { availableFilters, appliedFilters } = params;
    const whereBuilder: T = {} as T;

    for (const [key, value] of Object.entries(appliedFilters)) {
      if (availableFilters[key] && value) {
        const { where } = availableFilters[key](value as any);
        Object.assign(whereBuilder, where);
      }
    }

    return {
      where: whereBuilder,
    };
  } catch (error) {
    throw AppError.new(errorKinds.internalServerError, "Failed To Filter");
  }
};

// class QueryBuilder {
//   private whereQuery: W | {} = {};

//   constructor(where?: W) {
//     this.whereQuery = where || {}
//   }

//   sta
// }

// export default QueryBuilder;

// QueryBuilder
//   .where(availableParallelism, appliedParallelism)
//   .getBy()

class QueryBuilder<T> {
  private whereQuery: T | {} = {};

  private db = prisma;

  constructor(where?: T) {
    this.whereQuery = where || {};
  }

  static where<T extends object>(params: IApplyFiltersInput<T>) {
    const { availableFilters, appliedFilters } = params;
    const whereBuilder = whereQuery(params);

    return new QueryBuilder(whereBuilder.where);
  }

  getAll = async (params?: Prisma.UserFindManyArgs): Promise<any> => {
    try {
      return await this.db.user.findMany({
        ...(params ?? {}),
        where: this.whereQuery,
      });
    } catch (e) {
      throw AppError.new(errorKinds.internalServerError, "Prisma Error");
    }
  };
}

export default QueryBuilder;
