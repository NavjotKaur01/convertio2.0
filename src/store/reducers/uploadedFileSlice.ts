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
      state.isLoading = true;
      const { newFiles, updateConversion, initialActiveState, randomformat } =
        processFiles(
          action.payload.UploadedFiles,
          action.payload.possibleFormat,
          action.payload?.pageName,
          action.payload?.type,
          action.payload?.conversionType
        );
      state.uploadedFileList = [...state.uploadedFileList, ...newFiles];
      state.conversionFormat = [...state.conversionFormat, ...updateConversion];
      state.verticalActive = initialActiveState;
      const hasConversionFormat = state.conversionFormat.length !== 0;
      const allFilesConverted =
        state.conversionFormat.length === state.uploadedFileList.length;
      if (hasConversionFormat && allFilesConverted) {
        const fileExtensions = state.conversionFormat.map(
          (file: ConversionFormat) => file?.fileType || ""
        );
        const allExtensionsSame = fileExtensions.every(
          (ext: any) => ext === fileExtensions[0]
        );
        state.IsFileExtension = allExtensionsSame;
        state.ExtensionName = allExtensionsSame ? randomformat : "";
        state.IsErrorShow = !allExtensionsSame;
      } else {
        state.IsErrorShow = !hasConversionFormat || !allFilesConverted;
      }
      state.isLoading = false;
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
      state.ExtensionName = format;
      state.IsErrorShow = false;
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
      state.ExtensionName = conversionExtension;
      state.IsErrorShow = false;
    },
    setVerticalActive(state, action: PayloadAction<{ [key: string]: string }>) {
      state.verticalActive = { ...state.verticalActive, ...action.payload };
    },
    setIsErrorShow(state) {
      state.IsErrorShow = true;
    },
    resetUploadFileState(state) {
      state.isLoading = false;
      state.isSuccess = false;
      state.uploadedFileList = [];
      state.conversionFormat = [];
      state.verticalActive = {};
      state.ExtensionName = "";
      state.IsErrorShow = false;
      state.IsFileExtension = false;
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
export const SelectExtensionName = (state: RootState) =>
  state.uploadedFileData.ExtensionName;
export const SelectIsErrorShow = (state: RootState) =>
  state.uploadedFileData.IsErrorShow;
export const SelectIsFileExtension = (state: RootState) =>
  state.uploadedFileData.IsFileExtension;
// Export the reducer
export const SelectVerticalActive = (state: RootState) =>
  state.uploadedFileData.verticalActive;
export const SelectIsLoading = (state: RootState) =>
  state.uploadedFileData.isLoading;
const uploadedFileReducer = uploadedFileSlice.reducer;
export default uploadedFileReducer;
