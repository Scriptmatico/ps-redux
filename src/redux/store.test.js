import { createStore } from 'redux';
import initialState from './reducers/initialState';
import rootReducer from './reducers';
import * as courseActions from './actions/courseActions';

it('should handle creating courses', () => {
  //assert
  const store = createStore(rootReducer, initialState);
  const course = { title: 'My Course Title' };

  //act
  const action = courseActions.createCourseSuccess(course);
  store.dispatch(action);

  //assert
  const createdCourse = store.getState().courses[0];
  expect(createdCourse).toEqual(course);
});

it('should handle creating and updating courses', () => {
  //assert
  const store = createStore(rootReducer, initialState);
  const courseA = { id: 1, title: 'Course A' };
  const courseB = { id: 2, title: 'Course B' };
  const updatedCourseB = { id: 2, title: 'New Course B' };

  //act
  let action = courseActions.createCourseSuccess(courseA);
  store.dispatch(action);

  action = courseActions.createCourseSuccess(courseB);
  store.dispatch(action);

  action = courseActions.updateCourseSuccess(updatedCourseB);
  store.dispatch(action);

  //assert
  const courses = store.getState().courses;
  expect(courses.length).toEqual(2);
  expect(courses[0].title).toEqual(courseA.title);
  expect(courses[1].title).toEqual(updatedCourseB.title);
});
