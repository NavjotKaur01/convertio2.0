import { PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";
import {
  ConvertedFileStateModel,
  FileExtensions,
} from "../../models/convertedFileModel";
import { RootState } from "../store";

// Define the initial state for the Converted File slice
const initialState: ConvertedFileStateModel = {
  isLoading: false,
  isSuccess: false,
  FileExtension: {} as FileExtensions,
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
    //Reducer to convert files
    getAllFiles(state, _action) {
      state.isLoading = true;
    },
    //Reducer to handle convert files success
    getAllFilesSuccess(state) {
      state.isLoading = false;
    },
    //Reducer to handle convert files failure
    getAllFilesFailed(state, _action) {
      state.isLoading = false;
    },

    // Reducer to reset the Converted state to initial state
    resetConvertedState(state) {
      state.isLoading = false;
      state.isSuccess = false;
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
// Export the reducer
const convertedFileReducer = convertedFileSlice.reducer;
export default convertedFileReducer;
