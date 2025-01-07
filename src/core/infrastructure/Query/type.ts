export type IAvailableFlterInput = {
  filter : unknown
}

export type IAvailableFlterOutput<T> = {
  where: T;
};

export type IAvailableFlter<T> = {
  [key in keyof T]: (params: IAvailableFlterInput) => T;
};

export type IDefaultFilter<T> = {
  [key in keyof T] : () => T
}

export type IAppliedFlterOption<T> = {
  [key in keyof T]: string;
};

export type IApplyFiltersInput<T> = {
  appliedFilters: IAppliedFlterOption<T>;
  availableFilters: IAvailableFlter<T>;
  defaultFilters ?: IDefaultFilter<T>; 
};

// export type IApplyFiltersOutput<T> = {
//   where: T;
// };
