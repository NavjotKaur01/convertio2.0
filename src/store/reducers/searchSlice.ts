import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { AllConversion } from "../../models/searchModel";

// Define the initial state for the Search  slice
const initialState: any = {
  isLoading: false,
  isSuccess: false,
  allConversion: [],
  selectedPage: {} as AllConversion,
};

// Create a Redux slice for Search File
const searchSlice = createSlice({
  name: "search",
  initialState,
  reducers: {
    //Reducer for search
    allConversion(state) {
      state.isLoading = true;
    },
    //Reducer for search success
    allConversionSuccess(state, action: PayloadAction<AllConversion[]>) {
      state.isLoading = false;
      state.allConversion = action.payload;
    },
    //Reducer for search failure
    allConversionFailed(state, _action) {
      state.isLoading = false;
    },
    handleSelectedPage(state, action) {
      state.selectedPage = action.payload;
    },
    // Reducer to reset the Search state
    resetSearchState(state) {
      state.isLoading = false;
      state.isSuccess = false;
    },
  },
});

// Actions created
export const searchActions = searchSlice.actions;
export const selectAllConversion = (state: RootState) => {
  return state.search.allConversion;
};
export const selectCurrentPage = (state: RootState) => {
  return state.search.selectedPage;
};
// Export the reducer
const searchReducer = searchSlice.reducer;
export default searchReducer;
