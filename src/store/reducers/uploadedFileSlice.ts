import { PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";
import {
  ConversionFormat,
  uploadedFileInitialModel,
} from "../../models/uploadedFileModal";
import { RootState } from "../store";
import { processFiles } from "../../utilities/fileconverterFunction";

// Define the initial state for the uploaded File slice
const initialState: uploadedFileInitialModel = {
  isLoading: false,
  isSuccess: false,
  uploadedFileList: [],
  conversionFormat: [],
  verticalActive: {},
  ExtensionName: "",
  IsErrorShow: false,
  IsFileExtension: false,
};

// Create a Redux slice for uploaded File
const uploadedFileSlice = createSlice({
  name: "uploadedFileData",
  initialState,
  reducers: {
    //store upload files
    uploadFileListData(state, action: PayloadAction<any>) {
      const { newFiles, updateConversion, initialActiveState } = processFiles(
        action.payload.UploadedFiles,
        action.payload.possibleFormat
      );
      state.uploadedFileList = [...state.uploadedFileList, ...newFiles];
      state.conversionFormat = [...state.conversionFormat, ...updateConversion];
      state.verticalActive = initialActiveState;
    },
    chooseConversionFormat(
      state,
      action: PayloadAction<{
        format: string;
        fileName: string;
        isComman?: boolean;
      }>
    ) {
      const { format, fileName } = action.payload;
      const fileIndex = state.conversionFormat.findIndex(
        (item: ConversionFormat) => item.fileName === fileName
      );
      if (fileIndex !== -1) {
        state.conversionFormat[fileIndex] = {
          ...state.conversionFormat[fileIndex],
          conversionFormat: format,
        };
      } else {
        state.conversionFormat.push({ conversionFormat: format, fileName });
      }
    },
    removeFile(
      state,
      action: PayloadAction<{ fileName: string; idx: number }>
    ) {
      const { fileName, idx } = action.payload;
      state.uploadedFileList = state.uploadedFileList.filter(
        (_: any, index: number) => index !== idx
      );
      state.conversionFormat = state.conversionFormat.filter(
        (conversion: ConversionFormat) => conversion.fileName !== fileName
      );
    },
    updateConversionFormat(state, action: PayloadAction<string>) {
      const conversionExtension = action.payload;
      const updatedConversionFormat = state.uploadedFileList.map(
        (uploadedFile: { fileName: any; fileType: any }) => {
          const existingFormat = state.conversionFormat.find(
            (format: { fileName: any }) =>
              format.fileName === uploadedFile.fileName
          );
          return existingFormat
            ? { ...existingFormat, conversionFormat: conversionExtension }
            : {
                conversionFormat: conversionExtension,
                fileName: uploadedFile.fileName,
                fileType: uploadedFile.fileType,
              };
        }
      );
      state.conversionFormat = updatedConversionFormat;
    },
    setVerticalActive(state, action: PayloadAction<{ [key: string]: string }>) {
      state.verticalActive = { ...state.verticalActive, ...action.payload };
    },
  },
});

// Actions created
export const uploadedFileActions = uploadedFileSlice.actions;
export const SelectUploadedFile = (state: RootState) => {
  return state.uploadedFileData.uploadedFileList;
};
export const SelectConversionFormat = (state: RootState) =>
  state.uploadedFileData.conversionFormat;
export const SelectVerticalActive = (state: RootState) =>
  state.uploadedFileData.verticalActive;
// Export the reducer
const uploadedFileReducer = uploadedFileSlice.reducer;
export default uploadedFileReducer;
