import AppError from "./AppError";

const catchError = <T, E extends new (...args: any[]) => Error>(
  promise: Promise<T>,
  ErrorInstance?: E[]
): Promise<[undefined, T] | [Error]> => {
  return promise
    .then((data) => [undefined, data] as [undefined, T])
    .catch((err) => {
      if (ErrorInstance === undefined) return [err];
      if (ErrorInstance.some((errorinstance) => err instanceof errorinstance))
        return [err];
      if (err instanceof Error) return [err];
      throw err;
    });
};

export const tryAndThrow = async <Arg extends any[]>(
  fn: (...arg: Arg) => Promise<any>
): Promise<any> => {
  return async function (...arg: Arg) {
    return await fn(...arg)
      .then((data) => data)
      .catch((err) => {
        throw err;
      });
  };
};

export default catchError;
