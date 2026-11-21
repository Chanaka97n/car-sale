import * as yup from "yup";
import { email, requiredText } from "./common";

export const USER_ROLES = ["admin", "manager", "staff"] as const;
export const USER_STATUSES = ["active", "inactive"] as const;

/** Admin › Users add/edit modal — backend: CreateUserDto / UpdateUserDto */
export const userSchema = yup.object({
  name: requiredText("Name", 120),
  email: email(),
  role: yup
    .mixed<(typeof USER_ROLES)[number]>()
    .oneOf(USER_ROLES, "Choose a role")
    .required("Choose a role"),
  status: yup
    .mixed<(typeof USER_STATUSES)[number]>()
    .oneOf(USER_STATUSES, "Choose a status")
    .required("Choose a status"),
});

export type UserFormValues = yup.InferType<typeof userSchema>;

export const userDefaults: UserFormValues = {
  name: "",
  email: "",
  role: "staff",
  status: "active",
};
