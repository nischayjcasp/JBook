import { createSlice } from "@reduxjs/toolkit";

interface UserSliceType {
  sessionId: string | null;
  userData: {
    userId: string | null;
    userName: string | null;
    userDisplayName: string | undefined;
    userDob: number | string;
    userGender: string | undefined;
    userEmail: string | undefined;
    userPhoto: string | undefined;
    conncetedAcc: {
      email: string | null;
      isPrimary: boolean;
      isVerified: boolean;
    }[];
  };
}

const initialState: UserSliceType = {
  sessionId: null,
  userData: {
    userId: "123456",
    userName: "ram19122025",
    userDisplayName: "Ram",
    userDob: new Date().toLocaleDateString(),
    userGender: "male",
    userEmail: "ram@gmail.com",
    userPhoto: "https://xsgames.co/randomusers/assets/avatars/male/74.jpg",
    conncetedAcc: [
      {
        email: "ram@gmail.com",
        isPrimary: true,
        isVerified: true,
      },
      { email: "sita@gmail.com", isPrimary: false, isVerified: true },
    ],
  },
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setSession: (state, action) => {
      state.sessionId = action.payload;
    },
    logout: (state) => {
      state.sessionId = null;
    },
  },
});

export const { setSession, logout } = userSlice.actions;

export default userSlice.reducer;
