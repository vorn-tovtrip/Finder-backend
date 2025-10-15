export enum LoginMethod {
  google = "google",
  facebook = "facebook",
  email = "email",
}

export type RegisterPayload = {
  email?: string;
  username?: string;
  phone?: string;
  method: LoginMethod;
};

export type RegisterUserEmail = {
  email: string;
  password: string;
  username: string;
  method: LoginMethod;
  avatar?: string;
};

export type LoginUserParams = {
  email?: string;
  username?: string;
};

export type OTPVerify = {
  otpCode: string;
  phoneNunber: string;
};

export interface UpdateUser {
  name: string | null;
  email: string | null;
  phone?: string | null;
  avatar?: string | null;
  address?: string | null;
}
export type UpdateUserPayload = Partial<UpdateUser>;
