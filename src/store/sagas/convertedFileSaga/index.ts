import { call, put, takeLatest } from "redux-saga/effects";
import { PayloadAction } from "@reduxjs/toolkit";
import { AxiosResponse } from "axios";
import { ApiServices } from "../../../utilities/services/convertFileAPI.services";
import { convertedFileActions } from "../../reducers/convertedFileSlice";
import { encryptDatawith1Days } from "../../../utilities/utils";
import {
  ChangeStatusPayload,
  DeleteFilePayload,
} from "../../../models/convertedFileModel";

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
export function* handleGetFiles(action: PayloadAction<{ _id: string }>) {
  try {
    const response: AxiosResponse = yield call(
      ApiServices.getData,
      `getFiles/${action.payload._id}`
    );
    if (response.status === 200) {
      yield put(convertedFileActions.getFilesSuccess(response?.data?.data));
    }
  } catch (error: any) {
    yield put(convertedFileActions.getFilesFailed(error));
  }
}
export function* handleDeleteFile(action: PayloadAction<DeleteFilePayload>) {
  try {
    const response: AxiosResponse = yield call(
      ApiServices.postData,
      `deleteFile`,
      action.payload
    );
    if (response.status === 200) {
      yield put(
        convertedFileActions.deleteSingleFileSuccess(response?.data?.data)
      );
    }
  } catch (error: any) {
    yield put(convertedFileActions.deleteSingleFileFailed(error));
  }
}
export function* handleChangeStatusFile(
  action: PayloadAction<ChangeStatusPayload>
) {
  try {
    const response: AxiosResponse = yield call(
      ApiServices.postData,
      `updateFile`,
      action.payload
    );
    if (response.status === 200) {
      yield put(
        convertedFileActions.changeStatusFileSuccess(response?.data?.data)
      );
    }
  } catch (error: any) {
    yield put(convertedFileActions.FilesToConvertFailed(error));
  }
}

// Root saga to watch for Converted File actions
export default function* convertedFileSaga() {
  yield takeLatest(convertedFileActions.FilesToConvert.type, handleFileConvert);
  yield takeLatest(
    convertedFileActions.getFileExtension.type,
    handleGetFileExtensions
  );
  yield takeLatest(convertedFileActions.getFiles.type, handleGetFiles);
  yield takeLatest(
    convertedFileActions.deleteSingleFile.type,
    handleDeleteFile
  );
  yield takeLatest(
    convertedFileActions.changeStatusFile.type,
    handleChangeStatusFile
  );
}
