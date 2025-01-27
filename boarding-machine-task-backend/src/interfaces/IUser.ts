import { Document } from "mongoose";

export interface IUser extends Document {
    name?: string,
    email: string,
    password: string,
    savedPdfs?: string[],
    newPdfs?: string[];
}