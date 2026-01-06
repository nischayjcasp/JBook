import { createSlice } from "@reduxjs/toolkit";

interface UserSliceType {
  sessionId: string;
  userData: {
    userId: string;
    userName: string;
    userDisplayName: string;
    userDob: Date | string;
    userGender: string;
    userEmail: string;
    userPhoto: string;
    conncetedAcc: {
      email: string;
      isPrimary: boolean;
      isVerified: boolean;
    }[];
  };
}

const initialState: UserSliceType = {
  sessionId: "",
  userData: {
    userId: "",
    userName: "",
    userDisplayName: "",
    userDob: "",
    userGender: "",
    userEmail: "",
    userPhoto: "",
    conncetedAcc: [],
  },
};

// conncetedAcc: [
//       {
//         email: "ram@gmail.com",
//         isPrimary: true,
//         isVerified: true,
//       },
//       { email: "sita@gmail.com", isPrimary: false, isVerified: true },
//     ],

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setSession: (state, action) => {
      state.sessionId = action.payload;
    },
    setUserdata: (state, action) => {
      const tempUserData = Object.assign({}, action.payload);

      // Clearing all null|undefined keys
      Object.keys(tempUserData).forEach((key) => {
        if (!tempUserData[key]) {
          delete tempUserData[key];
        }
      });

      state.userData = {
        ...state.userData,
        ...tempUserData,
      };
    },
    logout: (state) => {
      state.sessionId = "";
    },
  },
});

export const { setSession, setUserdata, logout } = userSlice.actions;

export default userSlice.reducer;
