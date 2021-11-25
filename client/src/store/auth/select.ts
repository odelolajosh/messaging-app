import { State } from "../type";
import { AuthState } from "./reducer";


export const selectAuthValue = (state: State): AuthState => state.auth