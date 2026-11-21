import * as yup from "yup";
import { email, msg } from "./common";

/** Admin login (/admin/login) — backend: LoginDto */
export const loginSchema = yup.object({
  email: email(),
  password: yup.string().required(msg.required("Password")),
});

export type LoginFormValues = yup.InferType<typeof loginSchema>;

export const loginDefaults: LoginFormValues = { email: "", password: "" };
