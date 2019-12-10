import UsersSagas from "./users";
// all => Promise.all()
import { all } from "redux-saga/effects";
export default function* rootSaga() {
  // allow all forked sagas to be created in parallel
  yield all([...UsersSagas]);
}
