import { AxiosResponse } from "axios";
import { call, put, takeLatest } from "redux-saga/effects";
import { ApiServices } from "../../../utilities/services/convertFileAPI.services";
import { searchActions } from "../../reducers/searchSlice";
export function* handleSearch() {
  try {
    const response: AxiosResponse = yield call(
      ApiServices.getData,
      `allConversion`
    );
    if (response.status === 200) {
      yield put(searchActions.allConversionSuccess(response?.data?.data));
    }
  } catch (error: any) {
    yield put(searchActions.allConversionFailed(error));
  }
}
export default function* searchSaga() {
  yield takeLatest(searchActions.allConversion.type, handleSearch);
}
