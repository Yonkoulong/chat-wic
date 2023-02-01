import createSagaMiddleware from "redux-saga";
import React, { PropsWithChildren } from "react";
import { applyMiddleware, compose, createStore } from "redux";
import { Provider } from "react-redux";

import { RootReducer } from "../reducers/root.reducer";
import { RootSaga } from "../sagas/root.saga";

declare global {
    interface Window {
        __REDUX_DEVTOOLS_EXTENSION_COMPOSE__?: typeof compose;
    }
}

const composeEnhancers = (typeof window !== "undefined" && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) || compose;
const sagaMiddleware = createSagaMiddleware();
const middleware = [sagaMiddleware];

export const store = createStore(
    RootReducer,
    composeEnhancers(applyMiddleware(...middleware))
);

sagaMiddleware.run(RootSaga);

export function ReduxStoreProvider({
    children,
}: PropsWithChildren<any>) {
    return <Provider store={store}>{children}</Provider>;
}

// Infer the `RooteState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
//Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
