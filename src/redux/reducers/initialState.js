export default {
  courses: [],
  authors: [],
  apiCallsInProgress: 0,
  coursesView: {
    sorting: {
      sortKey: 'title',
      sortDescending: false,
      sortCurrentKey: 'title',
    },
    pagination: {
      itemsPerPage: 5,
      startIndex: 0,
      activePage: 1,
    },
  },
  authorsView: {
    sorting: {
      sortKey: 'name',
      sortDescending: false,
      sortCurrentKey: 'name',
    },
    pagination: {
      itemsPerPage: 5,
      startIndex: 0,
      activePage: 1,
    },
  },
};
