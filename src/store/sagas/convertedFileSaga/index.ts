import { call, put, takeLatest } from "redux-saga/effects";
import { PayloadAction } from "@reduxjs/toolkit";
import { AxiosResponse } from "axios";
import { ApiServices } from "../../../utilities/services/convertFileAPI.services";
import { convertedFileActions } from "../../reducers/convertedFileSlice";
import { encryptDatawith1Days } from "../../../utilities/utils";

export function* handleFileConvert(action: PayloadAction<any>) {
  try {
    const response: AxiosResponse = yield call(
      ApiServices.postData,
      `jobs`,
      action.payload
    );
    if (response.status === 200) {
      yield put(convertedFileActions.FilesToConvertSuccess());
      encryptDatawith1Days("files", response.data.data, 1);
    }
  } catch (error: any) {
    yield put(convertedFileActions.FilesToConvertFailed(error));
  }
}
export function* handleDownloadAllFiles(action: PayloadAction<any>) {
  try {
    const response: AxiosResponse = yield call(
      ApiServices.postData,
      `allZip`,
      action.payload
    );
    if (response.status === 200) {
      yield put(convertedFileActions.getAllFilesSuccess());
      console.log(response?.data);
    }
  } catch (error: any) {
    yield put(convertedFileActions.getAllFilesFailed(error));
  }
}
export function* handleGetFileExtensions() {
  try {
    const response: AxiosResponse = yield call(
      ApiServices.getData,
      `fileFormat`
    );
    if (response.status === 200) {
      yield put(
        convertedFileActions.getFileExtensionSuccess(response?.data?.data)
      );
    }
  } catch (error: any) {
    yield put(convertedFileActions.getFileExtensionFailed(error));
  }
}

// Root saga to watch for Converted File actions
export default function* convertedFileSaga() {
  yield takeLatest(convertedFileActions.FilesToConvert.type, handleFileConvert);
  yield takeLatest(
    convertedFileActions.getFileExtension.type,
    handleGetFileExtensions
  );
  yield takeLatest(
    convertedFileActions.getAllFiles.type,
    handleDownloadAllFiles
  );
}
