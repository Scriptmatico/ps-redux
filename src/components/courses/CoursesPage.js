import React from 'react';
import { connect } from 'react-redux';
import * as courseActions from '../../redux/actions/courseActions';
import * as authorActions from '../../redux/actions/authorActions';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import CourseList from './CourseList';
import { Redirect, Link } from 'react-router-dom';
import Spinner from '../common/Spinner';
import { toast } from 'react-toastify';
import TextInput from '../common/TextInput';
import { ActionCreators as UndoActionCreators } from 'redux-undo';

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
      const { actions } = this.props;
      await actions.deleteCourse(course);
      actions.historyCourseDeleted(course.title);
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

  handleHistoryJump = step => {
    const { actions, coursesHistory } = this.props;
    const jumpPast = -Math.abs(coursesHistory.selected - step);
    const jumpFuture = Math.abs(coursesHistory.selected - step);

    step < coursesHistory.selected
      ? actions.jump(jumpPast)
      : actions.jump(jumpFuture);

    actions.historyCourseSelected(step);
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
            <br />
            <h4>Courses history:</h4>
            <ul>
              {this.props.coursesHistory.actions.map((item, index) => (
                <li key={item}>
                  <Link
                    to="#"
                    onClick={() => this.handleHistoryJump(index + 1)}
                    style={{
                      fontWeight:
                        this.props.coursesHistory.selected === index + 1
                          ? 'bold'
                          : 'normal',
                    }}
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
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
  coursesHistory: PropTypes.object.isRequired,
};

function mapStateToProps(state) {
  return {
    courses:
      state.authors.present.length === 0
        ? []
        : state.courses.present.map(course => {
            return {
              ...course,
              authorName: state.authors.present.find(
                a => a.id === course.authorId
              ).name,
            };
          }),
    authors: state.authors.present,
    loading: state.apiCallsInProgress > 0,
    pagination: state.coursesView.pagination,
    sorting: state.coursesView.sorting,
    coursesHistory: state.coursesView.history,
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
      jump: bindActionCreators(UndoActionCreators.jump, dispatch),
      historyCourseCreated: bindActionCreators(
        courseActions.historyCourseCreated,
        dispatch
      ),
      historyCourseDeleted: bindActionCreators(
        courseActions.historyCourseDeleted,
        dispatch
      ),
      historyCourseUpdated: bindActionCreators(
        courseActions.historyCourseUpdated,
        dispatch
      ),
      historyCourseSelected: bindActionCreators(
        courseActions.historyCourseSelected,
        dispatch
      ),
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(CoursesPage);
