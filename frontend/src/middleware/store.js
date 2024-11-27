import { configureStore } from '@reduxjs/toolkit';
import { thunk } from 'redux-thunk';
import { rootReducer } from "../reducers/rootReducer"
const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore non-serializable fields like `UserImpl`
        ignoredActions: ['auth/loginSuccess'],
        ignoredPaths: ['auth.user'],
      },
    }).concat(thunk),
});

export default store;
