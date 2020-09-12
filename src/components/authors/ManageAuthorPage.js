import React, { useEffect, useState } from 'react';
import AuthorForm from './AuthorForm';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { loadAuthors, saveAuthor } from '../../redux/actions/authorActions';
import Spinner from '../common/Spinner';
import { toast } from 'react-toastify';
import { Prompt } from 'react-router-dom';

const ManageAuthorPage = ({
  loadAuthors,
  saveAuthor,
  authors,
  redirectTo404,
  history,
  ...props
}) => {
  const [author, setAuthor] = useState({ ...props.author });
  const [formSaved, setFormSaved] = useState(true);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    redirectTo404 && history.push('/not-found');

    if (authors.length === 0) {
      loadAuthors().catch(error => {
        alert('Loading authors failed: ' + error);
      });
    } else {
      setAuthor({ ...props.author });
    }
  }, [authors.length]);

  const handleNameChange = event => {
    const { name, value } = event.target;

    setAuthor(prevAuthor => ({
      ...prevAuthor,
      [name]: value,
    }));

    if (formSaved) setFormSaved(false);
  };

  const handleAuthorSave = event => {
    event.preventDefault();

    if (!formIsValid()) return;

    saveAuthor(author)
      .then(() => {
        setFormSaved(true);
        history.push('/authors');
        toast.success('Author saved!');
      })
      .catch(error => {
        setErrors({ onSave: error.message });
        setFormSaved(false);
      });
  };

  const formIsValid = () => {
    const { name } = author;
    const errors = {};

    if (!name) errors.name = 'Name is required';

    setErrors(errors);
    return Object.keys(errors).length === 0;
  };

  return props.loading ? (
    <Spinner />
  ) : (
    <>
      <Prompt when={!formSaved} message="Changes are not saved. Leave page?" />
      <AuthorForm
        author={author}
        onNameChange={handleNameChange}
        onSave={handleAuthorSave}
        errors={errors}
      />
    </>
  );
};

ManageAuthorPage.propTypes = {
  author: PropTypes.object.isRequired,
  authors: PropTypes.array.isRequired,
  loadAuthors: PropTypes.func.isRequired,
  saveAuthor: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
  history: PropTypes.object.isRequired,
  redirectTo404: PropTypes.bool.isRequired,
};

const findAuthorById = (authors, authorId) =>
  authors.find(author => author.id === authorId) || null;

const mapStateToProps = (state, ownProps) => {
  const authorId = ownProps.match.params.authorId;
  const author =
    authorId && state.authors.length > 0
      ? findAuthorById(state.authors, parseInt(authorId))
      : { id: null, name: '' };

  return {
    author,
    authors: state.authors,
    loading: state.apiCallsInProgress > 0,
    redirectTo404: !author,
  };
};

const mapDispathToProps = {
  loadAuthors,
  saveAuthor,
};

export default connect(mapStateToProps, mapDispathToProps)(ManageAuthorPage);
