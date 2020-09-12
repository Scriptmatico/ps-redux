import React from 'react';
import TextInput from '../common/TextInput';
import PropTypes from 'prop-types';

const AuthorForm = props => {
  return (
    <form onSubmit={props.onSave}>
      <h2>Author</h2>
      {props.errors.onSave && (
        <div className="alert alert-danger" role="alert">
          {props.errors.onSave}
        </div>
      )}
      <TextInput
        name="name"
        label="Author Name"
        placeholder="Enter author name"
        value={props.author.name}
        onChange={props.onNameChange}
        error={props.errors.name}
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
  errors: PropTypes.object.isRequired,
};

export default AuthorForm;
