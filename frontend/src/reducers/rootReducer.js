import { combineReducers } from 'redux';
import authReducer from './authReducer';
import patientReducer from './patientReducer';

export const rootReducer = combineReducers({
  auth: authReducer,
  patient: patientReducer,
});
