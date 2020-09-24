import * as types from './actionTypes';
import * as authorApi from '../../api/authorApi';
import { beginApiCall, apiCallError } from './apiStatusActions';

export function loadAuthorSuccess(authors) {
  return { type: types.LOAD_AUTHORS_SUCCESS, authors };
}

export function createAuthorSuccess(author) {
  return { type: types.CREATE_AUTHOR_SUCCESS, author };
}

export function updateAuthorSuccess(author) {
  return { type: types.UPDATE_AUTHOR_SUCCESS, author };
}

export function deleteAuthorOptimistic(author) {
  return { type: types.DELETE_AUTHOR_OPTIMISTIC, author };
}

export function loadAuthors() {
  return function (dispatch) {
    dispatch(beginApiCall());
    return authorApi
      .getAuthors()
      .then(authors => {
        dispatch(loadAuthorSuccess(authors));
      })
      .catch(error => {
        dispatch(apiCallError(error));
        throw error;
      });
  };
}

export function saveAuthor(author) {
  return function (dispatch) {
    dispatch(beginApiCall());
    return authorApi
      .saveAuthor(author)
      .then(savedAuthor => {
        author.id
          ? dispatch(updateAuthorSuccess(savedAuthor))
          : dispatch(createAuthorSuccess(savedAuthor));
      })
      .catch(error => {
        dispatch(apiCallError(error));
        throw error;
      });
  };
}

export function deleteAuthor(author) {
  return function (dispatch) {
    dispatch(deleteAuthorOptimistic(author));
    return authorApi.deleteAuthor(author.id);
  };
}

export function gotoPage(pageNumber) {
  return function (dispatch) {
    dispatch({ type: types.PAGINATION_AUTHORS_PAGE, pageNumber });
  };
}

export function updateItemsPerPage(itemsPerPage) {
  return function (dispatch) {
    dispatch({ type: types.PAGINATION_AUTHORS_ITEMSPERPAGE, itemsPerPage });
  };
}

export function sortAuthorsTable(sortKey) {
  return function (dispatch) {
    dispatch({ type: types.SORTING_AUTHORS_SORT, sortKey });
  };
}
