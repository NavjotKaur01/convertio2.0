import { call, put, takeLatest } from "redux-saga/effects";
import { PayloadAction } from "@reduxjs/toolkit";
import { AxiosResponse } from "axios";
import { ConvertedFileStateModel } from "../../../models/convertedFileModel";
import { ApiServices } from "../../../utilities/services/convertFileAPI.services";
import { convertedFileActions } from "../../reducers/convertedFileSlice";

// Saga to handle Converted File action
export function* handleConvertFile(
  action: PayloadAction<ConvertedFileStateModel>
) {
  try {
    const response: AxiosResponse = yield call(
      ApiServices.postData,
      `116dsfsdf6dsf4sdf6316dsfsa`,
      action.payload
    );
    if (response.status === 200) {
      yield put(convertedFileActions.convertedFileSuccess());
    }
  } catch (error: any) {
    yield put(convertedFileActions.convertedFileFailed(error));
  }
}

// Root saga to watch for Converted File actions
export default function* convertedFileSaga() {
  yield takeLatest(convertedFileActions.convertedFile.type, handleConvertFile);
}
