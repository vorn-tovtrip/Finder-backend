import bcrypt from "bcrypt";

export class BcryptHelper {
  static async hashPassword(myPlaintextPassword: string, saltRounds: number) {
    try {
      const hash = await bcrypt.hash(myPlaintextPassword, saltRounds);
      return hash;
    } catch (error) {
      console.error(error);
      throw new Error("Error hashing password");
    }
  }

  static async comparePassword(
    password: string,
    passwordHash: string | null | undefined
  ): Promise<boolean> {
    if (!passwordHash) return false;

    try {
      return await bcrypt.compare(password, passwordHash);
    } catch (error) {
      console.error(error);
      throw new Error("Error comparing passwords");
    }
  }
}
