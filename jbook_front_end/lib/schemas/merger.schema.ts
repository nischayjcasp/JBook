import * as yup from "yup";

//Merger account selcetion schema
export const selecteAccountSchema = yup.object({
  secondaryAcc: yup.string().required("Please select the account!"),
});

//Sign up form schema
export type SelecteAccSchemaType = yup.InferType<typeof selecteAccountSchema>;
