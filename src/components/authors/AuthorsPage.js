import React from 'react';
import { connect } from 'react-redux';
import * as authorActions from '../../redux/actions/authorActions';
import { loadCourses } from '../../redux/actions/courseActions';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import AuthorList from './AuthorList';
import { Redirect } from 'react-router-dom';
import Spinner from '../common/Spinner';
import { toast } from 'react-toastify';
import TextInput from '../common/TextInput';

class AuthorsPage extends React.Component {
  state = {
    redirectToAddAuthorPage: false,
    filterValue: '',
  };

  componentDidMount() {
    this.fetchAuthors();
    this.fetchCourses();
  }

  fetchAuthors() {
    const { authors, actions } = this.props;

    if (authors.length === 0) {
      actions.loadAuthors().catch(error => {
        toast.error('Loading authors failed: ' + error);
      });
    }
  }

  fetchCourses() {
    const { actions, courses } = this.props;
    if (courses.length === 0) {
      actions.loadCourses().catch(error => {
        toast.error('Loading courses failed: ' + error);
      });
    }
  }

  handleDeleteAuthor = async author => {
    if (this.isAuthorHaveCourse(author)) {
      this.fetchAuthors();
      toast.warn('Author have courses');
      return;
    }

    toast.success('Author deleted');

    try {
      await this.props.actions.deleteAuthor(author);
    } catch (error) {
      toast.error('Delete failed. ' + error.message, { autoClose: false });
    }
  };

  isAuthorHaveCourse(author) {
    const { courses } = this.props;
    if (courses.length > 0) {
      return courses.some(course => course.authorId === author.id);
    }

    return false;
  }

  handleFilterAuthor = event => {
    const { value } = event.target;
    this.setState({ filterValue: value });
  };

  handlePageClick = pageNumber => {
    const { actions } = this.props;
    actions.gotoPage(pageNumber);
  };

  handlePreviousClick = () => {
    const { actions, pagination } = this.props;
    pagination.activePage - 1 > 0 &&
      actions.gotoPage(pagination.activePage - 1);
  };

  handleNextClick = () => {
    const { actions, pagination, courses } = this.props;
    pagination.activePage + 1 <=
      Math.ceil(courses.length / pagination.itemsPerPage) &&
      actions.gotoPage(pagination.activePage + 1);
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
        {this.state.redirectToAddAuthorPage && <Redirect to="/author" />}
        <h2>Authors ({this.props.authors.length})</h2>
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
                    this.setState({ redirectToAddAuthorPage: true })
                  }
                >
                  Add Author
                </button>
              </div>

              {this.props.authors.length > 0 && (
                <div className="col align-self-end">
                  <TextInput
                    name="filter"
                    label=""
                    placeholder="Filter by name"
                    onChange={this.handleFilterAuthor}
                    value={this.state.filterValue}
                  />
                </div>
              )}
            </div>
            {this.props.authors.length > 0 && (
              <div className="row">
                <AuthorList
                  onDeleteClick={this.handleDeleteAuthor}
                  authors={this.props.authors}
                  filterValue={this.state.filterValue}
                  pagination={this.props.pagination}
                  sorting={this.props.sorting}
                  onPageClick={this.handlePageClick}
                  onNextClick={this.handleNextClick}
                  onPreviousClick={this.handlePreviousClick}
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

AuthorsPage.propTypes = {
  authors: PropTypes.array.isRequired,
  courses: PropTypes.array.isRequired,
  actions: PropTypes.object.isRequired,
  loading: PropTypes.bool.isRequired,
  pagination: PropTypes.object.isRequired,
  sorting: PropTypes.object.isRequired,
};

function mapStateToProps(state) {
  return {
    authors: [...state.authors],
    courses: [...state.courses],
    loading: state.apiCallsInProgress > 0,
    pagination: state.authorsView.pagination,
    sorting: state.authorsView.sorting,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: {
      loadAuthors: bindActionCreators(authorActions.loadAuthors, dispatch),
      deleteAuthor: bindActionCreators(authorActions.deleteAuthor, dispatch),
      loadCourses: bindActionCreators(loadCourses, dispatch),
      gotoPage: bindActionCreators(authorActions.gotoPage, dispatch),
      updateItemsPerPage: bindActionCreators(
        authorActions.updateItemsPerPage,
        dispatch
      ),
      sortTable: bindActionCreators(authorActions.sortAuthorsTable, dispatch),
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(AuthorsPage);
