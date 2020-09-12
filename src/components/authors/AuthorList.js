import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import TablePagination from '../common/TablePagination';

const AuthorList = ({
  authors,
  filterValue,
  pagination,
  onDeleteClick,
  onPageClick,
  onPreviousClick,
  onNextClick,
  onItemsPerPageChange,
}) => (
  <div className="container">
    <table className="table">
      <thead>
        <tr>
          <th>Name</th>
          <th />
        </tr>
      </thead>
      <tbody>
        {authors
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
                      className="btn btn-outline-danger"
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
    />
  </div>
);

AuthorList.propTypes = {
  authors: PropTypes.array.isRequired,
  filterValue: PropTypes.string,
  pagination: PropTypes.object.isRequired,
  onDeleteClick: PropTypes.func.isRequired,
  onPageClick: PropTypes.func.isRequired,
  onPreviousClick: PropTypes.func.isRequired,
  onNextClick: PropTypes.func.isRequired,
  onItemsPerPageChange: PropTypes.func.isRequired,
};

export default AuthorList;
