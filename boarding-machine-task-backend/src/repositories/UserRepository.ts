import User from "../models/user"
import { IUser } from "../interfaces/IUser"

export class UserRepository {
    public async createUser(userData: IUser): Promise<IUser> {
        const user = new User(userData)
        return await user.save()
    }

    async findUserByEmail(email: string): Promise<IUser | null> {
        return await User.findOne({ email })
    }

    async findUserById(id: string): Promise<IUser | null> {
        return await User.findById(id);
    }

    async saveUser(user: IUser): Promise<IUser> {
        return await user.save();
    };
}