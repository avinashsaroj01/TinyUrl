import { configureStore } from "@reduxjs/toolkit";
import linksReducer from "../features/links/linksSlice";

export const store = configureStore({
  reducer: {
    links: linksReducer,
  },
});
