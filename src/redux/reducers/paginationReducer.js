import initialState from './initialState';
import * as types from '../actions/actionTypes';

let startIndex = 0;

export default function paginationReducer(
  state = initialState.pagination,
  action
) {
  switch (action.type) {
    // courses
    case types.PAGINATION_COURSES_PAGE:
      startIndex =
        (parseInt(action.pageNumber) - 1) * state.courses.itemsPerPage;

      return {
        ...state,
        courses: {
          ...state.courses,
          startIndex,
          activePage: parseInt(action.pageNumber),
        },
      };

    case types.PAGINATION_COURSES_ITEMSPERPAGE:
      return {
        ...state,
        courses: {
          ...state.courses,
          itemsPerPage: action.itemsPerPage,
        },
      };

    // authors
    case types.PAGINATION_AUTHORS_PAGE:
      startIndex =
        (parseInt(action.pageNumber) - 1) * state.authors.itemsPerPage;

      return {
        ...state,
        authors: {
          ...state.authors,
          startIndex,
          activePage: parseInt(action.pageNumber),
        },
      };

    case types.PAGINATION_AUTHORS_ITEMSPERPAGE:
      return {
        ...state,
        authors: {
          ...state.authors,
          itemsPerPage: action.itemsPerPage,
        },
      };

    default:
      return state;
  }
}
