import bcrypt from "bcrypt";
import AppError, { errorKinds } from "./AppError";

class Hash {
  static saltRound = 10;

  static make = (subject: string): string => {
    try {
      const salt = bcrypt.genSaltSync(this.saltRound);
      return bcrypt.hashSync(subject, salt);
    } catch (error) {
      throw AppError.new(errorKinds.internalServerError, "Failed To Hash");
    }
  };

  static compare = async (hashed : string, targetText : string) : Promise<boolean> => {
    try {
      return await bcrypt.compare(hashed, targetText);
    } catch (e) {
        throw AppError.new(errorKinds.internalServerError, "Failed To Compare");
    }
  };
}

export default Hash;
