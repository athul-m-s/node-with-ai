import { User, IUser } from "../models/user.model.js";

export class UserService {
  async createUser(userData: Partial<IUser>) {
    const user = new User(userData);
    return await user.save();
  }

  async getUsers() {
    return await User.find();
  }

  async getUserById(id: string) {
    return await User.findById(id);
  }

  async updateUser(id: string, userData: Partial<IUser>) {
    return await User.findByIdAndUpdate(id, userData, { new: true });
  }

  async deleteUser(id: string) {
    return await User.findByIdAndDelete(id);
  }
}
