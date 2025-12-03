import * as yup from "yup";

//User Account info.
const maxUserPhotoSize = 2 * 1024 * 1024;
const userPhotoSupportedFormats = [
  "image/jpg",
  "image/jpeg",
  "image/webp",
  "image/png",
];

export const userProfileSchema = yup.object({
  user_photo: yup
    .mixed()
    .optional()
    .test(
      "fileSize",
      "Photo file size must be less then 2 MB!",
      (value: any) => {
        if (value) {
          return value[0].size <= maxUserPhotoSize;
        } else return true;
      }
    )
    .test(
      "fileFormat",
      "Photo must be in form of .jpg/jpeg/.png/.webp",
      (value: any) => {
        if (value) {
          return userPhotoSupportedFormats.includes(value[0].type);
        } else return true;
      }
    ),
  user_username: yup.string().required("Username is required"),
  user_display_name: yup
    .string()
    .min(3, "Display name must be 3 characters long!")
    .max(20, "Display name must be 20 characters long!")
    .required("User display name is required!"),
  user_dob: yup
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
  user_gender: yup
    .string()
    .required("Gender is required")
    .oneOf(["male", "female"], "Gender must be either Male or Female"),
  user_email: yup
    .string()
    .email("Invalid email")
    .required("Username email is required"),
  user_password: yup.string().required(),
});

export type UserProfileSchemaType = yup.InferType<typeof userProfileSchema>;
