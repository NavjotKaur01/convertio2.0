import { all } from "redux-saga/effects";
import convertedFileSaga from "./convertedFileSaga";
import searchSaga from "./searchSaga";
export default function* rootSaga() {
  yield all([convertedFileSaga(), searchSaga()]);
}
