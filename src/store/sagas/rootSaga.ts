import { all } from "redux-saga/effects";
import convertedFileSaga from "./convertedFileSaga";
export default function* rootSaga() {
  yield all([convertedFileSaga()]);
}
