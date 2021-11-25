import { RequestState, mapRequestToState } from "../action";
import { Actions } from "../type";
import { AuthActions } from "./action";

export type AuthState = {
    token: string | null;
    id: string | null;
    username: string;
    imageUrl: string | null;
} & RequestState;

const initialState: Readonly<AuthState> = {
    token: null,
    id: null,
    username: "",
    imageUrl: null,
    pending: false,
    error: null
};
export const authReducer = (state: AuthState = initialState, action: Actions): AuthState => {
    switch (action.type) {
        case AuthActions.Login: {
            const { token=null, id=null, username="", imageUrl=null, state: requestResponse, error = null} = action.payload;
            const requestState = mapRequestToState(requestResponse, error);
            return { ...state, token, id, username: username as string, imageUrl, ...requestState }
        }
        case AuthActions.Logout: {
            const { state: requestResponse, error = null} = action.payload;
            const requestState = mapRequestToState(requestResponse, error);
            return { ...initialState, ...requestState }
        }
        default:
            return state;
    }
}