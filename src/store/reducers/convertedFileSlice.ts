import { PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";
import { ConvertedFileStateModel } from "../../models/convertedFileModel";

// Define the initial state for the Converted File slice
const initialState: ConvertedFileStateModel = {
  isLoading: false,
  isSuccess: false,
  error: "",
};

// Create a Redux slice for Converted File
const convertedFileSlice = createSlice({
  name: "convertedFileData",
  initialState,
  reducers: {
    // Reducer for Converted action
    convertedFile(state, _action: PayloadAction<ConvertedFileStateModel>) {
      state.isLoading = true;
    },
    // Reducer for Converted success action
    convertedFileSuccess(state) {
      state.isLoading = false;
      state.error = "";
    },
    // Reducer for Converted failed action
    convertedFileFailed(state, action) {
      state.isLoading = false;
      state.error = action.payload?.response?.data?.message;
    },

    // Reducer to reset the Converted state to initial state
    resetConvertedState(state) {
      state.error = "";
      state.isLoading = false;
    },
  },
});

// Actions created
export const convertedFileActions = convertedFileSlice.actions;

// Export the reducer
const convertedFileReducer = convertedFileSlice.reducer;
export default convertedFileReducer;
