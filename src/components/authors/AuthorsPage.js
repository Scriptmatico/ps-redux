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

class AuthorsPage extends React.Component {
  state = {
    redirectToAddAuthorPage: false,
  };

  componentDidMount() {
    const { authors, actions, courses } = this.props;

    if (authors.length === 0) {
      actions.loadAuthors().catch(error => {
        toast.error('Loading authors failed: ' + error);
      });
    }

    if (courses.length === 0) {
      actions.loadCourses().catch(error => {
        toast.error('Loading courses failed: ' + error);
      });
    }
  }

  handleDeleteAuthor = async author => {
    if (this.isAuthorHaveCourse(author)) {
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

  render() {
    return (
      <>
        {this.state.redirectToAddAuthorPage && <Redirect to="/author" />}
        <h2>Authors ({this.props.authors.length})</h2>
        {this.props.loading ? (
          <Spinner />
        ) : (
          <>
            <button
              style={{ marginBottom: 20 }}
              className="btn btn-primary add-course"
              onClick={() => this.setState({ redirectToAddAuthorPage: true })}
            >
              Add Author
            </button>

            {this.props.authors.length > 0 && (
              <AuthorList
                onDeleteClick={this.handleDeleteAuthor}
                authors={this.props.authors}
              />
            )}
          </>
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
};

function mapStateToProps(state) {
  return {
    authors: state.authors,
    courses: state.courses,
    loading: state.apiCallsInProgress > 0,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: {
      loadAuthors: bindActionCreators(authorActions.loadAuthors, dispatch),
      deleteAuthor: bindActionCreators(authorActions.deleteAuthor, dispatch),
      loadCourses: bindActionCreators(loadCourses, dispatch),
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(AuthorsPage);
