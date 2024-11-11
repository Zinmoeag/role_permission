export type IAvailableFlterInput = {
  filter: string;
};

export type IAvailableFlterOutput<T> = {
  where: T;
};

export type IAvailableFlter<T> = {
  [key: string]: (params: IAvailableFlterInput) => IAvailableFlterOutput<T>;
};

export type IAppliedFlterOption<T> = {
  [P in keyof T]: string;
};

export type IApplyFiltersInput<T> = {
  appliedFilters: IAppliedFlterOption<T>;
  availableFilters: IAvailableFlter<T>;
};

export type IApplyFiltersOutput<T> = {
  where: T;
};
