import UserService from '../services/UserService.mjs';

class UserController {
  static async index(req, res) {
    try {
      const users = await UserService.getUsers();
      res.render('users', { users, user: req.user });
    } catch (error) {
      res.status(500).send('Error fetching users');
    }
  }

  static async new(req, res) {
    res.render('new_user', { title: 'New User', user: req.user });
  }

  static async create(req, res) {
    try {
      const { name, email, workExperience, age } = req.body;
      await UserService.createUser({ name, email, workExperience, age });
      res.redirect('/users');
    } catch (error) {
      res.render('new_user', { title: 'New User', error: error.message, user: req.user });
    }
  }

  static async delete(req, res) {
    try {
      await UserService.deleteUser(req.params.id);
      res.redirect('/users');
    } catch (error) {
      res.status(500).send('Error deleting user');
    }
  }
}

export default UserController;