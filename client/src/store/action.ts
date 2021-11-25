import { Action } from "./type";


function isPayloadAction<T extends string, P>(action: {
    type: T;
    payload?: P;
}): action is Action<T, P> {
    return action.payload !== undefined;
}

export function createAction<T extends string>(type: T): Action<T>;
export function createAction<T extends string, P>(
    type: T,
    payload: P
): Action<T ,P>;

export function createAction<T extends string, P>(
    type: T,
    payload?: P
): Action<T> | Action<T, P> {
    const action = { type, payload };
    return isPayloadAction(action) ? action: { type };
}

export type RequestState = {
    pending: boolean,
    error: string | null | undefined
}
export type RequestActionType = RequestAction.Pending | RequestAction.Success | RequestAction.Failed;
export enum RequestAction {
    Pending = "request_pending",
    Success = "request_success",
    Failed = "request_failed"
}
export function mapRequestToState(requestAction: RequestActionType, errorMsg: (string | null) = null): RequestState {
    switch(requestAction) {
        case RequestAction.Pending:
            return { pending: true, error: null }
        case RequestAction.Success:
            return { pending: false, error: null }
        case RequestAction.Failed:
            return { pending: false, error: errorMsg }
        default:
            return { pending: false, error: null }
    }
}