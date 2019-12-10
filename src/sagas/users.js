/*
 Helpers are more like what the rxjs equivalents of 
 operators switchMap, mergeMap, etc 
 sagas describe the flow of how side effects are called. 
 generator functions yield values.

  takeEvery - non blocking saga ,takes every dispatched action
  call      - allows us to call a promise & is sequential 
  fork      - all sagas will be forked from rootSaga and will run in separate 
              processes. So since they run separate, errors can be isolated
              and also each saga can be run in parallel
              So getUsers, deleteUsers, updateUsers all run in parallel
  put       - to dispatch an action to reducers
  takeLatest - every time the desired action is dispatched, saga acts upon it,
               if we hit the button again before its completed, first saga 
               is cancelled. ( switchMap )
  take       - we cannot pass a worker saga to take. Its a low level helper
*/

import {
  takeEvery,
  call,
  fork,
  put,
  takeLatest,
  take
} from "redux-saga/effects";
import * as actions from "../actions/users";
import * as api from "../api/users";
import { Types } from "./../actions/users";
//worker saga
function* getUsers() {
  try {
    // once the call is resolved, the result of
    //that is assigned to the const result
    const result = yield call(api.getUsers);
    yield put(
      actions.getUsersSuccess({
        items: result.data.data
      })
    );
    // any code here will run only once the above is resolved.
  } catch (e) {}
}

// watcher saga
function* watchGetUsersRequest() {
  yield takeEvery(actions.Types.GET_USERS_REQUEST, getUsers);
}

function* createUser(action) {
  //always yield atleast 1 value from a generator function;
  // yield;
  try {
    yield call(api.createUser, {
      firstName: action.payload.firstName,
      lastName: action.payload.lastName
    });
    yield call(getUsers);
  } catch (error) {}
}

// watcher saga - calling worker saga to do the real thing.
function* watchCreateUserRequest() {
  yield takeLatest(actions.Types.CREATE_USER_REQUEST, createUser);
}

function* deleteUser({ userId }) {
  try {
    yield call(api.deleteUser, userId);
    yield call(getUsers);
  } catch (error) {
    yield put(
      actions.usersError({
        error: "Error occured while trying to delete user"
      })
    );
  }
}

function* watchDeleteUserRequest() {
  while (true) {
    const action = yield take(actions.Types.DELETE_USER_REQUEST);
    console.log(action);
    yield call(deleteUser, {
      userId: action.payload.id
    });
  }
}

const usersSagas = [
  fork(watchGetUsersRequest),
  fork(watchCreateUserRequest),
  fork(watchDeleteUserRequest)
];
export default usersSagas;
