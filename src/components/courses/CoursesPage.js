import React from 'react';
import { connect } from 'react-redux';
import * as courseActions from '../../redux/actions/courseActions';
import * as authorActions from '../../redux/actions/authorActions';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import CourseList from './CourseList';
import { Redirect } from 'react-router-dom';
import Spinner from '../common/Spinner';
import { toast } from 'react-toastify';
import TextInput from '../common/TextInput';

class CoursesPage extends React.Component {
  state = {
    redirectToAddCoursePage: false,
    filterValue: '',
  };

  componentDidMount() {
    this.fetchCourses();
    this.fetchAuthors();
  }

  fetchCourses() {
    const { courses, actions } = this.props;
    if (courses.length === 0) {
      actions.loadCourses().catch(error => {
        alert('Loading courses failed: ' + error);
      });
    }
  }

  fetchAuthors() {
    const { authors, actions } = this.props;
    if (authors.length === 0) {
      actions.loadAuthors().catch(error => {
        alert('Loading authors failed: ' + error);
      });
    }
  }

  handleDeleteCourse = async course => {
    toast.success('Course deleted');

    try {
      await this.props.actions.deleteCourse(course);
    } catch (error) {
      this.fetchCourses();
      toast.error('Delete failed. ' + error.message, { autoClose: false });
    }
  };

  handleFilterCourse = event => {
    const { value } = event.target;
    this.setState({ filterValue: value });
  };

  handlePageClick = pageNumber => {
    const { actions, pagination, courses } = this.props;
    const totalPages = Math.ceil(courses.length / pagination.itemsPerPage);
    if (pageNumber > 0 && pageNumber <= totalPages) {
      actions.gotoPage(pageNumber);
    }
  };

  handleItemsPerPage = e => {
    const { actions } = this.props;
    const totalItemsSelected = parseInt(e.target.value);
    actions.updateItemsPerPage(totalItemsSelected);
  };

  handleHeaderClick = headerSortKey => {
    const { actions } = this.props;
    actions.sortTable(headerSortKey);
  };

  render() {
    return (
      <>
        {this.state.redirectToAddCoursePage && <Redirect to="/course" />}
        <h2>Courses ({this.props.courses.length})</h2>
        {this.props.loading ? (
          <Spinner />
        ) : (
          <div className="container">
            <br />
            <div className="row">
              <div className="col align-self-start">
                <button
                  style={{ marginBottom: 20 }}
                  className="btn btn-primary add-course"
                  onClick={() =>
                    this.setState({ redirectToAddCoursePage: true })
                  }
                >
                  Add Course
                </button>
              </div>

              {this.props.courses.length > 0 && (
                <div className="col align-self-end">
                  <TextInput
                    name="filter"
                    label=""
                    placeholder="Filter by title"
                    onChange={this.handleFilterCourse}
                    value={this.state.filterValue}
                  />
                </div>
              )}
            </div>

            {this.props.courses.length > 0 && (
              <div className="row">
                <CourseList
                  courses={this.props.courses}
                  filterValue={this.state.filterValue}
                  pagination={this.props.pagination}
                  sorting={this.props.sorting}
                  onDeleteClick={this.handleDeleteCourse}
                  onPageClick={this.handlePageClick}
                  onItemsPerPageChange={this.handleItemsPerPage}
                  onHeaderClick={this.handleHeaderClick}
                />
              </div>
            )}
          </div>
        )}
      </>
    );
  }
}

CoursesPage.propTypes = {
  authors: PropTypes.array.isRequired,
  courses: PropTypes.array.isRequired,
  actions: PropTypes.object.isRequired,
  loading: PropTypes.bool.isRequired,
  pagination: PropTypes.object.isRequired,
  sorting: PropTypes.object.isRequired,
};

function mapStateToProps(state) {
  return {
    courses:
      state.authors.length === 0
        ? []
        : state.courses.map(course => {
            return {
              ...course,
              authorName: state.authors.find(a => a.id === course.authorId)
                .name,
            };
          }),
    authors: state.authors,
    loading: state.apiCallsInProgress > 0,
    pagination: state.coursesView.pagination,
    sorting: state.coursesView.sorting,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: {
      loadCourses: bindActionCreators(courseActions.loadCourses, dispatch),
      loadAuthors: bindActionCreators(authorActions.loadAuthors, dispatch),
      deleteCourse: bindActionCreators(courseActions.deleteCourse, dispatch),
      gotoPage: bindActionCreators(courseActions.gotoPage, dispatch),
      updateItemsPerPage: bindActionCreators(
        courseActions.updateItemsPerPage,
        dispatch
      ),
      sortTable: bindActionCreators(courseActions.sortCoursesTable, dispatch),
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(CoursesPage);
