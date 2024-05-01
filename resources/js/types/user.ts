import { Method } from "./method";

export type User = {
  id: string;
  name: string;
  email: string;
  email_verified_at: string;
  avatar: string;
  active_status: boolean;
  is_online: boolean;
  last_seen: string;
  created_at?: string;
  updated_at?: string;
} & Contact;

export type Contact = {
  is_contact_blocked: boolean;
  is_contact_saved: boolean;
};

export type UpdateProfileSchema = {
  _method: Method;
  name: string;
  email: string;
  avatar: File | null;
};

export type UpdatePasswordSchema = {
  current_password: string;
  password: string;
  password_confirmation: string;
};

export type ResetPasswordSchema = {
  token: string;
  email: string;
  password: string;
  password_confirmation: string;
};

export type LoginSchema = {
  email: string;
  password: string;
  remember: boolean;
};

export type RegisterUserSchema = {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
};
