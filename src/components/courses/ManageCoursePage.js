import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import {
  loadCourses,
  saveCourse,
  historyCourseCreated,
  historyCourseUpdated,
} from '../../redux/actions/courseActions';
import { loadAuthors } from '../../redux/actions/authorActions';
import PropTypes from 'prop-types';
import CourseForm from './CourseForm';
import { newCourse } from '../../../tools/mockData';
import Spinner from '../common/Spinner';
import { toast } from 'react-toastify';
import { Prompt } from 'react-router-dom';

export function ManageCoursePage({
  courses,
  authors,
  loadAuthors,
  loadCourses,
  saveCourse,
  historyCourseCreated,
  historyCourseUpdated,
  history,
  redirectTo404,
  ...props
}) {
  const [course, setCourse] = useState({ ...props.course });
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [formSaved, setFormSaved] = useState(true);

  useEffect(() => {
    redirectTo404 && history.push('/not-found');

    if (courses.length === 0) {
      loadCourses().catch(error => {
        alert('Loading courses failed: ' + error);
      });
    } else {
      setCourse({ ...props.course });
    }
  }, [props.course]);

  useEffect(() => {
    if (authors.length === 0) {
      loadAuthors().catch(error => {
        alert('Loading authors failed: ' + error);
      });
    }
  }, [authors.length]);

  function handleChange(event) {
    const { name, value } = event.target;
    setCourse(prevCourse => ({
      ...prevCourse,
      [name]: name === 'authorId' ? parseInt(value, 10) : value,
    }));

    if (formSaved) setFormSaved(false);
  }

  function formIsValid() {
    const { title, authorId, category } = course;
    const errors = {};

    if (!title) errors.title = 'Title is required';
    if (!authorId) errors.author = 'Author is required';
    if (!category) errors.category = 'Category is required';

    setErrors(errors);
    return Object.keys(errors).length === 0;
  }

  function handleSave(event) {
    event.preventDefault();
    if (!formIsValid()) return;

    setSaving(true);

    saveCourse(course)
      .then(() => {
        setFormSaved(true);
        props.slug
          ? historyCourseUpdated(course.title)
          : historyCourseCreated(course.title);
        toast.success('Course saved.');
        history.push('/courses');
      })
      .catch(error => {
        setSaving(false);
        setErrors({ onSave: error.message });
      });
  }

  return props.loading ? (
    <Spinner />
  ) : (
    <>
      <Prompt
        when={!formSaved}
        message="Changes are not saved. Leave the page?"
      />
      <CourseForm
        course={course}
        errors={errors}
        authors={authors}
        onChange={handleChange}
        onSave={handleSave}
        saving={saving}
      />
    </>
  );
}

ManageCoursePage.propTypes = {
  slug: PropTypes.string,
  course: PropTypes.object.isRequired,
  authors: PropTypes.array.isRequired,
  courses: PropTypes.array.isRequired,
  loadAuthors: PropTypes.func.isRequired,
  loadCourses: PropTypes.func.isRequired,
  saveCourse: PropTypes.func.isRequired,
  historyCourseCreated: PropTypes.func.isRequired,
  historyCourseUpdated: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired,
  loading: PropTypes.bool.isRequired,
  redirectTo404: PropTypes.bool.isRequired,
};

function getCourseBySlug(courses, slug) {
  return courses.find(course => course.slug === slug) || null;
}

function mapStateToProps(state, ownProps) {
  const slug = ownProps.match.params.slug;
  const course =
    slug && state.courses.present.length > 0
      ? getCourseBySlug(state.courses.present, slug)
      : newCourse;

  return {
    slug,
    course,
    courses: state.courses.present,
    authors: state.authors.present,
    loading: state.apiCallsInProgress > 0,
    redirectTo404: !course,
  };
}

const mapDispatchToProps = {
  loadCourses,
  loadAuthors,
  saveCourse,
  historyCourseCreated,
  historyCourseUpdated,
};

export default connect(mapStateToProps, mapDispatchToProps)(ManageCoursePage);
