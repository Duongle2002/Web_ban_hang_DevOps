import UserService from '../services/UserService.mjs';

class ApiUserController {
  static async index(req, res) {
    try {
      const users = await UserService.getUsers();
      res.status(200).json({ message: 'Lấy danh sách người dùng thành công!', data: users });
    } catch (error) {
      res.status(500).json({ message: 'Lỗi khi lấy danh sách người dùng', error: error.message });
    }
  }

  static async show(req, res) {
    try {
      const user = await UserService.getUserById(req.params.id);
      if (!user) return res.status(404).json({ message: 'Không tìm thấy người dùng.' });
      res.status(200).json({ message: 'Lấy dữ liệu người dùng thành công!', data: user });
    } catch (error) {
      res.status(500).json({ message: 'Lỗi khi lấy dữ liệu người dùng', error: error.message });
    }
  }

  static async destroy(req, res) {
    try {
      const result = await UserService.deleteUser(req.params.id);
      if (result.deletedCount === 0) return res.status(404).json({ message: 'Không tìm thấy người dùng để xóa.' });
      res.status(200).json({ message: 'Xóa người dùng thành công!', data: result });
    } catch (error) {
      res.status(500).json({ message: 'Lỗi khi xóa người dùng', error: error.message });
    }
  }

  static async create(req, res) {
    try {
      const { name, email, workExperience, age } = req.body;
      if (!name || !email) return res.status(400).json({ message: 'Tên và email là bắt buộc.' });
      const user = await UserService.createUser({ name, email, workExperience, age });
      res.status(200).json({ message: 'Tạo người dùng thành công!', user });
    } catch (error) {
      res.status(500).json({ message: 'Lỗi khi tạo người dùng', error: error.message });
    }
  }
}

export default ApiUserController;