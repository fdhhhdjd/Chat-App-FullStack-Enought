import axios from "axios";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
export const RegisterInitial = createAsyncThunk(
  "Auth/RegisterAuth",
  async ({ RegisterRoute, name, email, password, picture }) => {
    const response = await axios.post(RegisterRoute, {
      name,
      email,
      password,
      picture,
    });
    return response.data;
  }
);
export const LoginInitial = createAsyncThunk(
  "Auth/LoginAuth",
  async ({ LoginRoute, email, password }) => {
    const response = await axios.post(LoginRoute, { email, password });
    return response.data;
  }
);
// export const LogoutInitial = createAsyncThunk(
//   "Auth/Logout",
//   async ({ LogoutRoute, id }) => {
//     const response = await axios.get(`${LogoutRoute}/${id}`);
//     return response.data;
//   }
// );
export const LogoutInitial = createAsyncThunk(
  "Auth/Logout",
  async ({ LogoutRoute, user }) => {
    const response = await axios.post(`${LogoutRoute}`, {
      user,
    });
    return response.data;
  }
);
const initialState = {
  loadings: false,
  error: null,
  Auth: [],
};
const AuthSlice = createSlice({
  name: "Auth",
  initialState,
  reducers: {
    resetNotifications: (state, { payload }) => {
      console.log(state.message[payload], "aloooooooooooooooo");
      if (state.newMessage[payload]) {
        state.newMessage[payload] = state.newMessage[payload] + 1;
      } else {
        state.newMessage[payload] = 1;
      }
    },
    AddNotifications: (state, { payload }) => {
      delete state.newMessage[payload];
    },
  },
  extraReducers: {
    //Register
    [RegisterInitial.pending]: (state, action) => {
      state.loadings = true;
    },
    [RegisterInitial.fulfilled]: (state, action) => {
      state.loadings = false;
      state.Auth = action.payload;
    },
    [RegisterInitial.rejected]: (state, action) => {
      state.loadings = false;
      state.error = action.payload;
    },
    //Login
    [LoginInitial.pending]: (state, action) => {
      state.loadings = true;
    },
    [LoginInitial.fulfilled]: (state, action) => {
      state.loadings = false;
      state.Auth = action.payload;
    },
    [LoginInitial.rejected]: (state, action) => {
      state.loadings = false;
      state.error = action.payload;
    },
    //?Logout
    [LogoutInitial.pending]: (state, action) => {
      state.loading = true;
    },
    [LogoutInitial.fulfilled]: (state, action) => {
      state.loading = false;
      state.auth = action.payload;
    },
    [LogoutInitial.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});
const Auth = AuthSlice.reducer;
export const { resetNotifications, AddNotifications } = AuthSlice.actions;
export default Auth;
