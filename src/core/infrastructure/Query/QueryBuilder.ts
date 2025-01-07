import { IApplyFiltersInput } from "./type";
import { Prisma } from "@prisma/client";
import AppError, { errorKinds } from "../../../utils/AppError";

export const ApplyFilter = <T extends object>(
  params: IApplyFiltersInput<T>
) => {
  try {
    const { defaultFilters, availableFilters, appliedFilters } = params;
    const whereBuilder: T = {} as T;

    if (defaultFilters) {
      for (const [key] of Object.entries(defaultFilters)) {
        const where = defaultFilters[key as keyof T]();
        Object.assign(whereBuilder, where);
      }
    }

    for (const [key, value] of Object.entries(appliedFilters)) {
      if (availableFilters[key as keyof T] && value) {
        const where = availableFilters[key as keyof T]({
          filter: value,
        });
        Object.assign(whereBuilder, where);
      }
    }

    return {
      result: whereBuilder,
    };
  } catch (error) {
    throw AppError.new(errorKinds.internalServerError, "Failed To Filter");
  }
};

export class FilterHelper<T extends Prisma.UserFindManyArgs> {
  static where<T extends object>(params: IApplyFiltersInput<T>) {
    const { result } = ApplyFilter(params);
    return result;
  }

  static sort<T extends object>(params: IApplyFiltersInput<T>) {
    const { result } = ApplyFilter(params);
    return result;
  }
}

// export default QueryBuilder;
