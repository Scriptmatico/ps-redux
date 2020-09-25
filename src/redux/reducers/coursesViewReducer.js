import initialState from './initialState';
import * as types from '../actions/actionTypes';

export default function coursesViewReducer(
  state = initialState.coursesView,
  action
) {
  let startIndex = 0;
  switch (action.type) {
    case types.PAGINATION_COURSES_PAGE:
      startIndex =
        (parseInt(action.pageNumber) - 1) * state.pagination.itemsPerPage;

      return {
        ...state,
        pagination: {
          ...state.pagination,
          startIndex,
          activePage: parseInt(action.pageNumber),
        },
      };

    case types.PAGINATION_COURSES_ITEMSPERPAGE:
      return {
        ...state,
        pagination: {
          ...state.pagination,
          itemsPerPage: action.itemsPerPage,
        },
      };

    case types.SORTING_COURSES_SORT:
      return {
        ...state,
        sorting: {
          ...state.sorting,
          sortKey: action.sortKey,
          sortDescending:
            action.sortKey === state.sorting.sortCurrentKey
              ? !state.sorting.sortDescending
              : state.sorting.sortDescending,
          sortCurrentKey:
            action.sortKey !== state.sorting.sortCurrentKey
              ? action.sortKey
              : state.sorting.sortCurrentKey,
        },
      };

    case types.HISTORY_COURSES_CREATED:
      return {
        ...state,
        history: {
          ...state.history,
          selected: state.history.actions.length + 1,
          actions: [...state.history.actions, `Created: ${action.courseTitle}`],
        },
      };

    case types.HISTORY_COURSES_DELETED:
      return {
        ...state,
        history: {
          ...state.history,
          selected: state.history.actions.length + 1,
          actions: [...state.history.actions, `Deleted: ${action.courseTitle}`],
        },
      };

    case types.HISTORY_COURSES_UPDATED:
      return {
        ...state,
        history: {
          ...state.history,
          selected: state.history.actions.length + 1,
          actions: [...state.history.actions, `Updated: ${action.courseTitle}`],
        },
      };

    case types.HISTORY_COURSES_SELECTED:
      return {
        ...state,
        history: {
          ...state.history,
          selected: action.selected,
        },
      };

    default:
      return state;
  }
}
