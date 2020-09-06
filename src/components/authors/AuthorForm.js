import React from 'react';
import TextInput from '../common/TextInput';
import PropTypes from 'prop-types';

const AuthorForm = props => {
  return (
    <form onSubmit={props.onSave}>
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
  onSave: PropTypes.func.isRequired,
};

export default AuthorForm;
