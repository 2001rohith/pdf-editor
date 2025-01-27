import { UserRepository } from "../repositories/UserRepository";
import { FileRepository } from "../repositories/FileRepository";
import { IUser } from "../interfaces/IUser";
import bcrypt from "bcryptjs"
export class UserService {
    private userRepository: UserRepository

    constructor(userRepository: UserRepository) {
        this.userRepository = userRepository
    }

    public async registerUser(name: string, email: string, password: string): Promise<IUser> {
        const existingUser = await this.userRepository.findUserByEmail(email)
        if (existingUser) {
            throw new Error("User exists!")
        }
        const hashedPassword = await bcrypt.hash(password, 10)
        const user = await this.userRepository.createUser({ name, email, password: hashedPassword } as IUser)
        return user
    }

    public async loginUser(email: string, password: string): Promise<IUser> {
        const user = await this.userRepository.findUserByEmail(email);
        if (!user) {
            throw new Error("Invalid email or password");
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            throw new Error("Invalid email or password");
        }

        const { password: _, ...userWithoutPassword } = user.toObject();
        return userWithoutPassword as IUser;
    }

    
}

