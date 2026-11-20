export interface User {
  id: string;
  name: string;
  email: string;
  role: "admin" | "manager" | "staff";
  status: "active" | "inactive";
  createdAt: string;
}

export interface UsersState {
  users: User[];
  status: "idle" | "loading";
}
