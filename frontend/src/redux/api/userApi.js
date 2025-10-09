import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "@/api/axios";

const userLogout = createAsyncThunk("logout", async (_, thunkAPI) => {
  try {
    const response = await axiosInstance.post("/user/logout");
    return response.data;
  } catch (err) {
    console.log(`An error in authenticating user: ${err}`);
    return { data: null, auth: true };
  }
});

const getUserProfile = createAsyncThunk("userProfile", async (_, thunkAPI) => {
  try {
    const response = await axiosInstance.get("/user/profile");
    return response.data;
  } catch (err) {
    console.log(`An error in authenticating user: ${err}`);
    return { data: {}, auth: false };
  }
});

export { userLogout, getUserProfile };
