import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import TablePagination from '../common/TablePagination';
import TableHeader from '../common/TableHeader';

const AuthorList = ({
  authors,
  filterValue,
  pagination,
  sorting,
  onDeleteClick,
  onPageClick,
  onPreviousClick,
  onNextClick,
  onItemsPerPageChange,
  onHeaderClick,
}) => {
  const sortByKey = (a, b) =>
    a[sorting.sortKey] > b[sorting.sortKey]
      ? sorting.sortDescending
        ? -1
        : 1
      : sorting.sortDescending
      ? 1
      : -1;

  return (
    <div className="container">
      <table className="table table-striped table-bordered">
        <thead>
          <tr>
            <TableHeader
              sortKey="name"
              sortCurrentKey={sorting.sortCurrentKey}
              descending={sorting.sortDescending}
              onHeaderClick={() => onHeaderClick('name')}
            >
              Name
            </TableHeader>
            <th />
          </tr>
        </thead>
        <tbody>
          {authors
            .sort(sortByKey)
            .slice(
              pagination.startIndex,
              pagination.startIndex + pagination.itemsPerPage
            )
            .map(author => {
              return (
                author.name.toLowerCase().indexOf(filterValue.toLowerCase()) >=
                  0 && (
                  <tr key={author.id}>
                    <td>
                      <Link to={'/author/' + author.id}>{author.name}</Link>
                    </td>
                    <td>
                      <button
                        className="btn btn-danger"
                        onClick={() => onDeleteClick(author)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                )
              );
            })}
        </tbody>
      </table>
      <TablePagination
        pages={Math.ceil(authors.length / pagination.itemsPerPage)}
        onPageClick={onPageClick}
        onPrevious={onPreviousClick}
        onNext={onNextClick}
        onItemsPerPageChange={onItemsPerPageChange}
        active={pagination.activePage}
        itemsPerPage={pagination.itemsPerPage}
      />
    </div>
  );
};

AuthorList.propTypes = {
  authors: PropTypes.array.isRequired,
  filterValue: PropTypes.string,
  pagination: PropTypes.object.isRequired,
  sorting: PropTypes.object.isRequired,
  onDeleteClick: PropTypes.func.isRequired,
  onPageClick: PropTypes.func.isRequired,
  onPreviousClick: PropTypes.func.isRequired,
  onNextClick: PropTypes.func.isRequired,
  onItemsPerPageChange: PropTypes.func.isRequired,
  onHeaderClick: PropTypes.func.isRequired,
};

export default AuthorList;
