import { errorKinds, errorKindsType } from "../utils/AppError";

export const returnStates = {
    SUCCESS : "SUCCESS",
    FAILED : "FAILED",
} as const;

export type ReturnState = typeof returnStates[keyof typeof returnStates];

export type success<T> = {
    state : typeof returnStates.SUCCESS,
    payload : T
}

export type failed<T> = {
    state : typeof returnStates.FAILED
    errorKind : keyof typeof errorKinds
    message : string
    errors : T
}

export type Result<T, E> = success<T> | failed<E> 