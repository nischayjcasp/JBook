import * as yup from "yup";
//Login form schema
export const loginSchema = yup.object({
  login_email: yup
    .string()
    .email("Invalid email")
    .required("Email is required"),
  login_password: yup
    .string()
    .min(6, "Minimum 6 characters")
    .required("Password is required")
    .matches(/\d/, "Password must have one digit")
    .matches(/[A-Z]/, "Password must have one capital letter")
    .matches(/[a-z]/, "Password must have one lowercase letter")
    .matches(
      /[~`!@#$%\^&*\(\)_\-+=\[\]{};:'"\\|,\.<>\/?]/,
      "Password must have one special character"
    ),
});

//Sign up form schema
export type LoginSchemaType = yup.InferType<typeof loginSchema>;

let MaxDob = new Date();
MaxDob.setFullYear(MaxDob.getFullYear() - 14);

export const signupSchema = yup.object({
  signup_username: yup
    .string()
    .min(3, "Username must be 3 characters long.")
    .max(20, "Username can not bigger then 20 characters")
    .required("Username is required")
    .matches(/^[a-zA-Z]+$/, "Username must have alphabates only."),
  signup_dob: yup
    .date()
    .required("Birthdate is required")
    .max(MaxDob, "User must be 14 year old.")
    .min(
      new Date("1900-01-01"),
      "Birth date cannot be in the before 1900-01-01"
    ),
  signup_gender: yup
    .string()
    .required("Gender is required")
    .oneOf(["male", "female"], "Gender must be either Male or Female"),

  signup_mobile: yup
    .string()
    .required("Mobile number is required")
    .matches(/^\d+$/, "Mobile number must have digits only")
    .matches(/^.{10}$/, "Mobile number must have 10 digits exactly."),
  signup_email: yup
    .string()
    .email("Invalid email")
    .required("Email is required"),
  signup_password: yup
    .string()
    .min(6, "Minimum 6 characters")
    .required("Password is required")
    .matches(/\d/, "Password must have one digit")
    .matches(/[A-Z]/, "Password must have one capital letter")
    .matches(/[a-z]/, "Password must have one lowercase letter")
    .matches(
      /^(?=.*[~`!@#$%^&*()_\-+=\[\]{};:'"\\|,.<>/?]).+$/,
      "Password must have one special character"
    ),
  signup_cpassword: yup
    .string()
    .required("Confirm Password is required")
    .oneOf([yup.ref("signup_password")], "Passwords do not match"),
});

export type SignupSchemaType = yup.InferType<typeof signupSchema>;

// Forgot pass schema
export const forgotPassSchema = yup.object({
  forgot_pass_email: yup
    .string()
    .email("Invalid email")
    .required("Email is required"),
});

export type ForgotPassSchemaType = yup.InferType<typeof forgotPassSchema>;

// Reset password schema
export const resetPassSchema = yup.object({
  reset_password: yup
    .string()
    .required("Password is required")
    .min(8, "Password must have minimum 8 characters")
    .matches(/\d/, "Password must have one digit")
    .matches(/[A-Z]/, "Password must have one capital letter")
    .matches(/[a-z]/, "Password must have one lowercase letter")
    .matches(
      /[~`!@#$%^&*()_\-+=\[\]{};:'"\\|,\.<>\/?]/,
      "Password must have one special character"
    ),
  reset_cpassword: yup
    .string()
    .required("Confirm Password is required")
    .oneOf([yup.ref("reset_password")], "Passwords do not match"),
});

export type ResetPassSchemaType = yup.InferType<typeof resetPassSchema>;

// otp verification schema
export const OtpVerificationSchema = yup.object({
  otp: yup
    .string()
    .required("OTP is required")
    .matches(/^\d{6,}$/, "Invalid otp!"),
});

export type OtpVerificationType = yup.InferType<typeof OtpVerificationSchema>;
