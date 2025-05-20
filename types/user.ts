export interface Authority {
  authority: string;
}

export interface User {
  id: number;
  username: string;
  role: "ADMIN" | "INSTRUCTOR" | "STUDENT";
  password?: string;
  email?: string;
  phoneNumber?: string | null;
  active?: boolean;
}
