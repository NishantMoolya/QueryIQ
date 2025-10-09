import { createSlice } from '@reduxjs/toolkit'
import { getUserProfile, userLogout } from '../api/userApi';
import { clearAuthToken, setAuthToken } from '@/utils/localStorageUtils';

const initialUser = {
    name:"",
    email:"",
    auth:false,
}

const userSlice = createSlice({
    name:"user",
    initialState:initialUser,
    reducers:{
        login:(state,action) => {
            setAuthToken(action.payload);
            state.auth = true;
        }
    },
    extraReducers:(builder) => {
          builder.addCase(userLogout.fulfilled, (state, action) => {
            clearAuthToken();
            state = {...initialUser,auth:action.payload.auth};
            return state;
          });

          builder.addCase(getUserProfile.fulfilled, (state,action) => {
            const { auth } = action.payload;
            if (auth) {
              const { data } = action.payload;
              // console.log(data);
              return {...state,...data,userId:_id,auth:auth}
            }else {
              clearAuthToken();
              return {...state,auth:auth}
            }
          });
      }
});

export const { login } = userSlice.actions;

export default userSlice.reducer;