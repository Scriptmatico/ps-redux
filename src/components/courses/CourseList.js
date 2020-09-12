import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import TablePagination from '../common/TablePagination';

/*
todo:
  V move state one level up - keep this component dumb
  V wrap all related state into object
  V move to redux store
  add 'items per page' dropdown
*/

const CourseList = ({
  courses,
  filterValue = '',
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
          <th />
          <th>Title</th>
          <th>Author</th>
          <th>Category</th>
          <th />
        </tr>
      </thead>
      <tbody>
        {courses
          .slice(
            pagination.startIndex,
            pagination.startIndex + pagination.itemsPerPage
          )
          .map(course => {
            return (
              course.title.toLowerCase().indexOf(filterValue.toLowerCase()) >=
                0 && (
                <tr key={course.id}>
                  <td>
                    <a
                      className="btn btn-light"
                      href={'http://pluralsight.com/courses/' + course.slug}
                    >
                      Watch
                    </a>
                  </td>
                  <td>
                    <Link to={'/course/' + course.slug}>{course.title}</Link>
                  </td>
                  <td>{course.authorName}</td>
                  <td>{course.category}</td>
                  <td>
                    <button
                      className="btn btn-outline-danger"
                      onClick={() => onDeleteClick(course)}
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
      pages={Math.ceil(courses.length / pagination.itemsPerPage)}
      onPageClick={onPageClick}
      onPrevious={onPreviousClick}
      onNext={onNextClick}
      onItemsPerPageChange={onItemsPerPageChange}
      active={pagination.activePage}
    />
  </div>
);

CourseList.propTypes = {
  courses: PropTypes.array.isRequired,
  filterValue: PropTypes.string,
  pagination: PropTypes.object.isRequired,
  onDeleteClick: PropTypes.func.isRequired,
  onPageClick: PropTypes.func.isRequired,
  onPreviousClick: PropTypes.func.isRequired,
  onNextClick: PropTypes.func.isRequired,
  onItemsPerPageChange: PropTypes.func.isRequired,
};

export default CourseList;
