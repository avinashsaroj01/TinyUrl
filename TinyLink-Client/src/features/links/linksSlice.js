import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  fetchAllLinks,
  createLink,
  deleteLinkByCode,
  fetchLinkStats,
  fetchHealthStatus,
} from "./linksApi";

export const fetchLinks = createAsyncThunk("links/fetchLinks", async () => {
  return await fetchAllLinks();
});

export const createNewLink = createAsyncThunk(
  "links/createNewLink",
  async ({ targetUrl, customCode }, { rejectWithValue }) => {
    try {
      return await createLink({ targetUrl, customCode });
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteLink = createAsyncThunk(
  "links/deleteLink",
  async (code, { rejectWithValue }) => {
    try {
      await deleteLinkByCode(code);
      return code;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const getLinkStats = createAsyncThunk(
  "links/getLinkStats",
  async (code, { rejectWithValue }) => {
    try {
      return await fetchLinkStats(code);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// NEW THUNK for Health Check
export const fetchHealth = createAsyncThunk(
  "links/fetchHealth",
  async (_, { rejectWithValue }) => {
    try {
      return await fetchHealthStatus();
    } catch (error) {
      // The error is a standard Error object, we extract the message
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  links: [],
  status: "idle",
  error: null,
  notification: null,
  currentLinkStats: null,
  statsStatus: "idle",
  statsError: null,
  // NEW STATE for Health Check
  healthData: null,
  healthStatus: "idle",
  healthError: null,
};

export const linksSlice = createSlice({
  name: "links",
  initialState,
  reducers: {
    setNotification: (state, action) => {
      state.notification = action.payload;
    },
    clearNotification: (state) => {
      state.notification = null;
    },
    clearCurrentLinkStats: (state) => {
      state.currentLinkStats = null;
      state.statsStatus = "idle";
      state.statsError = null;
    },
    clearHealthData: (state) => {
      state.healthData = null;
      state.healthStatus = "idle";
      state.healthError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // FETCH LINKS (Dashboard List)
      .addCase(fetchLinks.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchLinks.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.links = action.payload;
        state.error = null;
      })
      .addCase(fetchLinks.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "Could not load links.";
      })

      // ... CREATE NEW LINK, DELETE LINK, GET LINK STATS remain the same ...

      .addCase(createNewLink.fulfilled, (state, action) => {
        state.links.unshift(action.payload);
        state.error = null;
        state.notification = {
          message: "Link created successfully!",
          type: "success",
        };
      })
      .addCase(createNewLink.rejected, (state, action) => {
        state.error = action.payload || "Failed to create link.";
        state.notification = {
          message: action.payload || "Failed to create link.",
          type: "error",
        };
      })

      .addCase(deleteLink.fulfilled, (state, action) => {
        state.links = state.links.filter(
          (link) => link.code !== action.payload
        );
        state.error = null;
        state.notification = {
          message: `Link ${action.payload} deleted successfully.`,
          type: "success",
        };
      })
      .addCase(deleteLink.rejected, (state, action) => {
        state.error = action.payload || "Failed to delete link.";
        state.notification = {
          message: action.payload || "Failed to delete link.",
          type: "error",
        };
      })

      .addCase(getLinkStats.pending, (state) => {
        state.statsStatus = "loading";
        state.statsError = null;
      })
      .addCase(getLinkStats.fulfilled, (state, action) => {
        state.statsStatus = "succeeded";
        state.currentLinkStats = action.payload;
      })
      .addCase(getLinkStats.rejected, (state, action) => {
        state.statsStatus = "failed";
        state.statsError = action.payload || "Failed to load link statistics.";
      })

      // NEW Reducers for Health Check
      .addCase(fetchHealth.pending, (state) => {
        state.healthStatus = "loading";
        state.healthError = null;
      })
      .addCase(fetchHealth.fulfilled, (state, action) => {
        state.healthStatus = "succeeded";
        state.healthData = action.payload;
        state.healthError = null;
      })
      .addCase(fetchHealth.rejected, (state, action) => {
        state.healthStatus = "failed";
        state.healthError =
          action.payload ||
          "Health check failed due to network or server error.";
      });
  },
});

export const {
  setNotification,
  clearNotification,
  clearCurrentLinkStats,
  clearHealthData,
} = linksSlice.actions;

export const selectAllLinks = (state) => state.links.links;
export const selectLinksStatus = (state) => state.links.status;
export const selectLinksError = (state) => state.links.error;
export const selectNotification = (state) => state.links.notification;
export const selectCurrentLinkStats = (state) => state.links.currentLinkStats;
export const selectStatsStatus = (state) => state.links.statsStatus;
export const selectStatsError = (state) => state.links.statsError;
// NEW SELECTORS for Health Check
export const selectHealthData = (state) => state.links.healthData;
export const selectHealthStatus = (state) => state.links.healthStatus;
export const selectHealthError = (state) => state.links.healthError;

export default linksSlice.reducer;
