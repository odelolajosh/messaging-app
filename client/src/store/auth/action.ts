import AuthProvider from "../../helpers/AuthProvider";
import ErrorHandler from "../../helpers/ErrorHandler";
import AuthRequestProvider from "../../helpers/request/HttpRequestProvider";
import { createAction, RequestAction, RequestActionType } from "../action";
import { ActionsUnion, DispatchAction } from "../type";


export enum AuthActions {
    Login = "auth_login",
    CheckToken = "auth_check_token",
    Logout = "auth_logout"
};

export type RequestResponse = { state: RequestActionType, error?: string | null };
export type LoginResponse = { 
    token?: string | null;
    id?: string | null;
    username?: string | null;
    imageUrl?: string | null
} & RequestResponse;

export type LoginRequest = { username: string, password: string };
export type SignupRequest = LoginRequest & { email: string };

export type CheckTokenRequest = { token: string, id: string };

export const Actions = {
    login: (payload: LoginResponse) => createAction(AuthActions.Login, payload),
    logout: (payload: RequestResponse) => createAction(AuthActions.Logout, payload)
};
export type ActionTypes = ActionsUnion<typeof Actions>;

export const login = (request: LoginRequest): DispatchAction => {
    return async (dispatch) => {
        try {
            dispatch(Actions.login({ state: RequestAction.Pending }));
            const response = await AuthRequestProvider.loginRequest(request);
            if (response.ok) {
                const userData = await response.json();
                if (userData.token) {
                    dispatch(Actions.login({ 
                        state: RequestAction.Success, 
                        id: userData.userId,  
                        token: userData.token,
                        username: userData.username,
                        imageUrl: userData.imageUrl
                    }));
                    return;
                }
                throw new Error('Cannot login');
            }
            throw new Error('Cannot login');
        } catch (err: any) {
            const error = await err;
            dispatch(Actions.login({ state: RequestAction.Failed, error: error.message }))
        }
    };
};

export const signup = (request: SignupRequest): DispatchAction => {
    return async (dispatch) => {
        try {
            dispatch(Actions.login({ state: RequestAction.Pending }));
            const response = await AuthRequestProvider.signupRequest(request);
            if (response.ok) {
                const userData = await response.json();
                if (userData.token) {
                    dispatch(Actions.login({ 
                        state: RequestAction.Success, 
                        id: userData.userId,  
                        token: userData.token,
                        username: userData.username,
                        imageUrl: userData.imageUrl
                    }));
                    return;
                }
                throw new Error('Cannot create account');
            }
            throw new Error('Cannot create account');
        } catch (err: any) {
            const error = await err;
            dispatch(Actions.login({ state: RequestAction.Failed, error: error.message }))
        }
    };
};

export const logout = (): DispatchAction => (
    async (dispatch) => {
        try {
            dispatch(Actions.logout({ state: RequestAction.Pending }));
            const done = await AuthProvider.unauthenticate();
            if (done) {
                dispatch(Actions.logout({ state: RequestAction.Success }));
                return;
            }
            throw new Error();
        } catch(err) {
            await dispatch(Actions.logout({ state: RequestAction.Failed }));
        }
    }
)

export const checkToken = (request: CheckTokenRequest): DispatchAction => {
    return async (dispatch) => {
        try {
            dispatch(Actions.login({ state: RequestAction.Pending }));
            const response: Response = await AuthRequestProvider.checkTokenRequest(request);
            if (response.ok) {
                const userData = await response.json();
                if (userData.token) {
                    dispatch(Actions.login({ 
                        state: RequestAction.Success, 
                        id: userData.userId,  
                        token: userData.token,
                        username: userData.username,
                        imageUrl: userData.imageUrl
                    }));
                    return;
                }
                throw ErrorHandler.getResponseError(response);
            }
            throw ErrorHandler.getResponseError(response);
        } catch (err: any) {
            const error = await err;
            if (error.message === ErrorHandler.UNAUTHENTICATED_USER) {
                dispatch(logout());
                return;
            }
            dispatch(Actions.login({ state: RequestAction.Failed, error: error.message }))
        }
    };
};