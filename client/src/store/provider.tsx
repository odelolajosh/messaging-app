import { ReactNode } from 'react';
import { Provider } from "react-redux";
import { applyMiddleware, compose, createStore } from "redux";
import thunk from "redux-thunk";
import { reducer } from "./reducer";
import { Store } from "./type";

const composeEnhancers = process.env.NODE_ENV === "development"
    ? (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose
    : compose;

const store: Store = createStore(
    reducer,
    composeEnhancers(applyMiddleware(thunk))
);

type Props = {
    children: ReactNode;
}
export function StoreProvider(props: Props): JSX.Element {
    const { children } = props;
    return <Provider store={store}>{ children }</Provider>
}