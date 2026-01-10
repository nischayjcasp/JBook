import * as yup from "yup";

//User Account info. form
const maxUserPhotoSize = 2 * 1024 * 1024;
export const userPhotoSupportedFormats = [
  "image/jpg",
  "image/jpeg",
  "image/webp",
  "image/png",
];

export const userProfileSchema = yup.object({
  profile_photo: yup
    .mixed()
    .optional()
    .test(
      "fileSize",
      "Photo file size must be less then 2 MB!",
      (value: any) => {
        if (value) {
          return value.size <= maxUserPhotoSize;
        } else return true;
      }
    )
    .test(
      "fileFormat",
      "Photo must be in form of .jpg/jpeg/.png/.webp",
      (value: any) => {
        if (value) {
          return userPhotoSupportedFormats.includes(value.type);
        } else return true;
      }
    ),
  username: yup.string().required("Username is required"),
  display_name: yup
    .string()
    .min(3, "Display name must be 3 characters long!")
    .max(20, "Display name must be 20 characters long!")
    .required("User display name is required!"),
  dob: yup
    .date()
    .required("Birthdate is required")
    .max(
      new Date(Date.now() - 14 * 365 * 24 * 60 * 60 * 1000),
      "User must be 14 year old."
    )
    .min(
      new Date("1900-01-01"),
      "Birth date cannot be in the before 1900-01-01"
    ),
  gender: yup
    .string()
    .required("Gender is required")
    .oneOf(["male", "female"], "Gender must be either Male or Female"),
  email: yup
    .string()
    .email("Invalid email")
    .required("Username email is required"),
  password: yup.string().required(),
});

export type UserProfileSchemaType = yup.InferType<typeof userProfileSchema>;

//Password change form

export const passChangeSchema = yup.object({
  currrent_password: yup.string().required("Current password is required!"),
  password: yup
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
  cpassword: yup
    .string()
    .required("Confirm password is required!")
    .oneOf([yup.ref("password")], "Password do not match"),
});

export type PassChangeSchemaType = yup.InferType<typeof passChangeSchema>;

// Delete account schema

export const deleteAccSchema = yup.object({
  reason_for_delete: yup
    .string()
    .max(200, "Message max length is 200 characters.")
    .optional(),
  email: yup
    .string()
    .email("Invalid email")
    .required("Username email is required"),
  password: yup.string().required("Password is required!"),
  user_consent: yup.boolean().oneOf([true], "User consent is required!"),
});

export type DeleteAccSchemaType = yup.InferType<typeof deleteAccSchema>;

// Add post schema

export const addPostSchema = yup.object({
  post_title: yup.string().required("Post title is required."),
  post_text: yup.string().required("Post description is required."),
  post_photo: yup
    .mixed()
    .optional()
    .nullable()
    .test(
      "fileSize",
      "Photo file size must be less then 2 MB!",
      (value: any) => {
        if (value) {
          return value.size <= maxUserPhotoSize;
        } else return true;
      }
    )
    .test(
      "fileFormat",
      "Photo must be in form of .jpg/jpeg/.png/.webp",
      (value: any) => {
        if (value) {
          return userPhotoSupportedFormats.includes(value.type);
        } else return true;
      }
    ),
});

export type AddPostSchemaType = yup.InferType<typeof addPostSchema>;
