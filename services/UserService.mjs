import User from '../models/user.mjs';
import bcrypt from 'bcrypt';

class UserService {
  static async getUsers(query = {}) {
    return User.find(query);
  }

  static async getUserById(id) {
    return User.findById(id);
  }

  static async createUser({ name, email, age, password, workExperience }) {
    const hashedPassword = password ? await bcrypt.hash(password, 10) : undefined;
    return User.create({ name, email, age, password: hashedPassword, workExperience });
  }

  static async updateUser(id, updateData) {
    if (updateData.password) {
      updateData.password = await bcrypt.hash(updateData.password, 10);
    }
    return User.updateOne({ _id: id }, updateData);
  }

  static async deleteUser(id) {
    return User.deleteOne({ _id: id });
  }

  static async searchUsers(query) {
    if (!query) return this.getUsers();
    const re = new RegExp(query, 'i');
    return User.find({ $or: [{ name: re }, { email: re }] });
  }

  static async signup({ name, email, password }) {
    const existingUser = await User.findOne({ email });
    if (existingUser) throw new Error('Email already exists');
    return this.createUser({ name, email, password });
  }

  static async login({ email, password }) {
    const user = await User.findOne({ email });
    if (!user || !await bcrypt.compare(password, user.password)) {
      throw new Error('Invalid email or password');
    }
    return user;
  }
}

export default UserService;
