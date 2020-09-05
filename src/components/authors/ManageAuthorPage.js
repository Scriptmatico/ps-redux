import React, { useEffect, useState } from 'react';
import AuthorForm from './AuthorForm';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { loadAuthors } from '../../redux/actions/authorActions';
import Spinner from '../common/Spinner';

const ManageAuthorPage = ({ loadAuthors, authors, ...props }) => {
  const [author, setAuthor] = useState({ ...props.author });
  console.log('props.author', props.author);
  console.log('state.author', author);

  useEffect(() => {
    if (authors.length === 0) {
      loadAuthors().catch(error => {
        alert('Loading authors failed: ' + error);
      });
    } else {
      setAuthor({ ...props.author });
    }
  }, [props.author]);

  const handleNameChange = event => {
    const { name, value } = event.target;

    setAuthor(prevAuthor => ({
      ...prevAuthor,
      [name]: value,
    }));
  };

  return props.loading ? (
    <Spinner />
  ) : (
    <AuthorForm author={author} onNameChange={handleNameChange} />
  );
};

ManageAuthorPage.propTypes = {
  author: PropTypes.object.isRequired,
  authors: PropTypes.array.isRequired,
  loadAuthors: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
};

const findAuthorById = (authors, authorId) =>
  authors.find(author => author.id === authorId) || null;

const mapStateToProps = (state, ownProps) => {
  console.log('mapStateToProps called');
  const authorId = ownProps.match.params.authorId;
  const author =
    authorId && state.authors.length > 0
      ? findAuthorById(state.authors, parseInt(authorId))
      : { id: null, name: '' };

  return {
    author,
    authors: state.authors,
    loading: state.apiCallsInProgress > 0,
  };
};

const mapDispathToProps = {
  loadAuthors,
};

export default connect(mapStateToProps, mapDispathToProps)(ManageAuthorPage);
