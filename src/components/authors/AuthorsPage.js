import React from 'react';
import { connect } from 'react-redux';
import * as authorActions from '../../redux/actions/authorActions';
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
    const { authors, actions } = this.props;

    if (authors.length === 0) {
      actions.loadAuthors().catch(error => {
        alert('Loading authors failed: ' + error);
      });
    }
  }

  handleDeleteAuthor = async author => {
    toast.success('Author deleted');

    try {
      await this.props.actions.deleteAuthor(author);
    } catch (error) {
      toast.error('Delete failed. ' + error.message, { autoClose: false });
    }
  };

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
  actions: PropTypes.object.isRequired,
  loading: PropTypes.bool.isRequired,
};

function mapStateToProps(state) {
  return {
    authors: state.authors,
    loading: state.apiCallsInProgress > 0,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: {
      loadAuthors: bindActionCreators(authorActions.loadAuthors, dispatch),
      deleteAuthor: bindActionCreators(authorActions.deleteAuthor, dispatch),
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(AuthorsPage);
