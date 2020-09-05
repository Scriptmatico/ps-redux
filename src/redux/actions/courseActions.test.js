import { courses } from '../../../tools/mockData';
import * as types from './actionTypes';
import * as courseActions from './courseActions';
import thunk from 'redux-thunk';
import fetchMock from 'fetch-mock';
import configureMockStore from 'redux-mock-store';

const middleware = [thunk];
const mockStore = configureMockStore(middleware);

describe('Async Actions', () => {
  afterEach(() => {
    fetchMock.restore();
  });

  it('should create BEGIN_API_CALL and LOAD_COURSES_SUCCESS when loading courses', () => {
    fetchMock.mock('*', {
      body: courses,
      headers: { 'content-type': 'application/json' },
    });

    const expectedActions = [
      { type: types.BEGIN_API_CALL },
      { type: types.LOAD_COURSES_SUCCESS, courses },
    ];

    const store = mockStore({ courses: [] });
    return store.dispatch(courseActions.loadCourses()).then(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });
  });
});

describe('CreateCourseSuccess', () => {
  it('should create a CREATE_COURSE_SUCCESS action', () => {
    // arrange
    const course = courses[0];
    const expectedAction = {
      type: types.CREATE_COURSE_SUCCESS,
      course,
    };

    // act
    const action = courseActions.createCourseSuccess(course);

    //aasert
    expect(action).toEqual(expectedAction);
  });
});
