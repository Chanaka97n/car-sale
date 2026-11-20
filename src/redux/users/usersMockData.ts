import type { User } from "./usersTypes";

export const mockUsers: User[] = [
  {
    id: "1",
    name: "Admin User",
    email: "admin@apexselect.co.uk",
    role: "admin",
    status: "active",
    createdAt: "2024-01-15",
  },
  {
    id: "2",
    name: "James Mitchell",
    email: "james@apexselect.co.uk",
    role: "manager",
    status: "active",
    createdAt: "2024-03-22",
  },
  {
    id: "3",
    name: "Sarah Thompson",
    email: "sarah@apexselect.co.uk",
    role: "staff",
    status: "active",
    createdAt: "2024-06-10",
  },
  {
    id: "4",
    name: "Michael Brown",
    email: "michael@apexselect.co.uk",
    role: "staff",
    status: "inactive",
    createdAt: "2024-02-05",
  },
  {
    id: "5",
    name: "Emily Davis",
    email: "emily@apexselect.co.uk",
    role: "manager",
    status: "active",
    createdAt: "2024-08-18",
  },
];
