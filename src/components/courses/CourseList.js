import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import TablePagination from '../common/TablePagination';
import TableHeader from '../common/TableHeader';

const columns = [
  { display: 'Title', sortKey: 'title' },
  { display: 'Author', sortKey: 'authorName' },
  { display: 'Category', sortKey: 'category' },
];

const CourseList = ({
  courses,
  filterValue = '',
  pagination,
  sorting,
  onDeleteClick,
  onPageClick,
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
            <th />
            {columns.map(column => (
              <TableHeader
                key={column.sortKey}
                sortKey={column.sortKey}
                sortCurrentKey={sorting.sortCurrentKey}
                descending={sorting.sortDescending}
                onHeaderClick={() => onHeaderClick(column.sortKey)}
              >
                {column.display}
              </TableHeader>
            ))}
            <th />
          </tr>
        </thead>
        <tbody>
          {courses
            .sort(sortByKey)
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
                        className="btn btn-danger"
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
        onItemsPerPageChange={onItemsPerPageChange}
        active={pagination.activePage}
      />
    </div>
  );
};

CourseList.propTypes = {
  courses: PropTypes.array.isRequired,
  filterValue: PropTypes.string,
  pagination: PropTypes.object.isRequired,
  sorting: PropTypes.object.isRequired,
  onDeleteClick: PropTypes.func.isRequired,
  onPageClick: PropTypes.func.isRequired,
  onItemsPerPageChange: PropTypes.func.isRequired,
  onHeaderClick: PropTypes.func.isRequired,
};

export default CourseList;
