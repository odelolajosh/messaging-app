import { Action as ReduxAction, Store as ReduxStore } from "redux";
import { ThunkAction, ThunkDispatch } from "redux-thunk";
import * as authReducer from './auth';

type AnyFunction = (...args: any[]) => any;
export type StringMap<T> = { [Key: string]: T };

export type Action<T extends string = string, P = void> = P extends void
    ? ReduxAction<T>
    : ReduxAction<T> & Readonly<{ payload: P }>;

export type ActionsUnion<A extends StringMap<AnyFunction>> = ReturnType<A[keyof A]>;

export type State = {
  auth: ReturnType<typeof authReducer.reducer>
};

export type Store = ReduxStore<State, Action> & {
    dispatch: Dispatch;
}

export type Dispatch = ThunkDispatch<State, void, Action>;

export type Actions = authReducer.ActionTypes;

export type DispatchAction<T = void> = ThunkAction<
  Promise<T>,
  State,
  void,
  Action
>;