import { combineReducers } from 'redux';
import courses from './courseReducer';
import authors from './authorReducer';
import coursesView from './coursesViewReducer';
import authorsView from './authorsViewReducer';
import apiCallsInProgress from './apiStatusReducer';

const rootReducer = combineReducers({
  courses,
  authors,
  apiCallsInProgress,
  coursesView,
  authorsView,
});

export default rootReducer;
