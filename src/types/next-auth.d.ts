/* eslint-disable @typescript-eslint/no-explicit-any */
import { DefaultSession, DefaultUser } from "next-auth";
import { JWT } from "next-auth/jwt";

declare module "next-auth" {
  // Custom session interface
  interface Session extends DefaultSession {
    _id: string;
    token: string;
    user: {
      name: string;
      email_id: string;
      role: string;
      admin_photo?: string;  
    };
  }

  // Custom user interface
  interface User extends DefaultUser {
    _id: string;
    token: string;
    email_id: string;
    role: string;
    admin_photo?: string;  // Optional: Include if needed for user
  }
}

interface User {
  _id: string;
  name: string;
  admin_photo?: string;
  phone_number: string;
  email_id: string;
  admin_id: string;
  role: string;
  password: string;
  pages: any[];
  access: any[];
  meta_tag: any[];
  createdAt: string;
  updatedAt: string;
  otpforgotPassword: string;
}

interface LoginResponse {
  message: string;
  data: {
    user: User;
    token: string;  // Single token field
  };
}

interface Token extends JWT {
  _id: string;
  email_id: string;
  name: string;
  role: string;
  admin_photo:string;
  token: string; 
  expiresAt?: number;
}

interface Session {
  id: string;
  token: string;
  user: {
    name: string;
    email_id: string;
    role: string;
    admin_photo?: string;  
  };
}
