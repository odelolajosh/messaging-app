import { combineReducers, Reducer } from "redux";
import { Actions, State } from "./type";
import { reducer as authReducer } from "./auth";

export const reducer: Reducer<State | any, Actions> = combineReducers({ auth: authReducer });