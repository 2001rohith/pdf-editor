import mongoose, { Schema } from "mongoose";
import { IUser } from "../interfaces/IUser";

const UserSchema: Schema = new Schema<IUser>({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    savedPdfs: { type: [String], default: [] },
    newPdfs: { type: [String], default: [] }

})

export default mongoose.model<IUser>("User", UserSchema)