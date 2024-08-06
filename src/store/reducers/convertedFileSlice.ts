import { PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";
import {
  AllConvertedFiles,
  ChangeStatusPayload,
  ConvertedFileStateModel,
  DeleteFilePayload,
  FileExtensions,
} from "../../models/convertedFileModel";
import { RootState } from "../store";

// Define the initial state for the Converted File slice
const initialState: ConvertedFileStateModel = {
  isLoading: false,
  isSuccess: false,
  FileExtension: {} as FileExtensions,
  allConvertedFiles: [],
  isDelete: false,
};

// Create a Redux slice for Converted File
const convertedFileSlice = createSlice({
  name: "convertedFileData",
  initialState,
  reducers: {
    //Reducer to convert files
    FilesToConvert(state, _action: PayloadAction<any>) {
      state.isLoading = true;
      state.isSuccess = false;
    },
    //Reducer to handle convert files success
    FilesToConvertSuccess(state) {
      state.isLoading = false;
      state.isSuccess = true;
    },
    //Reducer to handle convert files failure
    FilesToConvertFailed(state, _action) {
      state.isLoading = false;
    },
    //Reducer to convert files
    getFileExtension(state) {
      state.isLoading = true;
    },
    //Reducer to handle convert files success
    getFileExtensionSuccess(state, action: PayloadAction<FileExtensions>) {
      state.isLoading = false;
      state.FileExtension = action.payload;
    },
    //Reducer to handle convert files failure
    getFileExtensionFailed(state, _action) {
      state.isLoading = false;
    },
    //Reducer to get files
    getFiles(state, _action: PayloadAction<{ _id: string }>) {
      state.isLoading = true;
    },
    //Reducer to handle get files success
    getFilesSuccess(
      state,
      action: PayloadAction<{ convertedFile: AllConvertedFiles[] }>
    ) {
      state.isLoading = false;
      state.allConvertedFiles = action.payload?.convertedFile;
    },
    //Reducer to handle get files failure
    getFilesFailed(state, _action) {
      state.isLoading = false;
    },
    //Reducer to delete single file files
    deleteSingleFile(state, _action: PayloadAction<DeleteFilePayload>) {
      state.isLoading = true;
      state.isDelete = false;
    },
    //Reducer to handle delete files success
    deleteSingleFileSuccess(
      state,
      action: PayloadAction<{ convertedFile: AllConvertedFiles[] }>
    ) {
      state.isLoading = false;
      state.isDelete = true;
      state.allConvertedFiles = action.payload?.convertedFile;
    },
    //Reducer to handle delete files failure
    deleteSingleFileFailed(state, _action) {
      state.isLoading = false;
    },
    //Reducer to change status file
    changeStatusFile(state, _action: PayloadAction<ChangeStatusPayload>) {
      state.isLoading = true;
    },
    //Reducer to change status file  success
    changeStatusFileSuccess(
      state,
      action: PayloadAction<{ convertedFile: AllConvertedFiles[] }>
    ) {
      state.isLoading = false;
      state.allConvertedFiles = action.payload?.convertedFile;
    },
    //Reducer to change status file  failure
    changeStatusFileFailed(state, _action) {
      state.isLoading = false;
    },

    // Reducer to reset the Converted state to initial state
    resetConvertedState(state) {
      state.isLoading = false;
      state.isSuccess = false;
      state.allConvertedFiles = [];
      state.isDelete = false;
    },
  },
});

// Actions created
export const convertedFileActions = convertedFileSlice.actions;
export const SelectIsSuccess = (state: RootState) => {
  return state.convertedFileData.isSuccess;
};
export const SelectFileExtension = (state: RootState) => {
  return state.convertedFileData.FileExtension;
};
export const SelectAllConvertedFile = (state: RootState) => {
  return state.convertedFileData.allConvertedFiles;
};
export const SelectIsDelete = (state: RootState) => {
  return state.convertedFileData.isDelete;
};
export const SelectIsLoading = (state: RootState) => {
  return state.convertedFileData.isLoading;
};

// Export the reducer
const convertedFileReducer = convertedFileSlice.reducer;
export default convertedFileReducer;
