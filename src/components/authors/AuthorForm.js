import React from 'react';
import TextInput from '../common/TextInput';
import PropTypes from 'prop-types';

const AuthorForm = props => {
  const handleFormSubmit = e => {
    e.preventDefault();
  };
  return (
    <form onSubmit={handleFormSubmit}>
      <h2>Author</h2>
      <TextInput
        name="name"
        label="Author Name"
        placeholder="Enter author name"
        value={props.author.name}
        onChange={props.onNameChange}
      />
      <button type="submit" className="btn btn-primary">
        Save
      </button>
    </form>
  );
};

AuthorForm.propTypes = {
  author: PropTypes.object.isRequired,
  onNameChange: PropTypes.func.isRequired,
};

export default AuthorForm;
