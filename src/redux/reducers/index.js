import { combineReducers } from 'redux';
import courses from './courseReducer';
import authors from './authorReducer';
import pagination from './paginationReducer';
import apiCallsInProgress from './apiStatusReducer';

const rootReducer = combineReducers({
  courses,
  authors,
  apiCallsInProgress,
  pagination,
});

export default rootReducer;
