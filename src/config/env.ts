import dotenv from "dotenv";
dotenv.config({ path: `.env.${process.env.NODE_ENV}` });
export const AppEnv = {
  PORT: process.env.PORT || 3000,
};
