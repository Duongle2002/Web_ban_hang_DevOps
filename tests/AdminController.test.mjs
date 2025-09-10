// __tests__/AdminController.test.mjs
import AdminController from '../src/controllers/AdminController.mjs';

// Mock các model
jest.mock('../src/models/user.mjs', () => ({
    find: jest.fn(),
    findById: jest.fn(),
    create: jest.fn(),
    updateOne: jest.fn(),
    deleteOne: jest.fn(),
}));
jest.mock('../src/models/product.mjs', () => ({
    find: jest.fn(),
    findById: jest.fn(),
    create: jest.fn(),
    updateOne: jest.fn(),
    deleteOne: jest.fn(),
}));

import User from '../src/models/user.mjs';
import Product from '../src/models/product.mjs';

describe('AdminController', () => {
    let req, res;

    beforeEach(() => {
        // Reset mock trước mỗi test
        jest.clearAllMocks();
        // Mock req và res
        req = { query: {}, params: {}, body: {} };
        res = {
            render: jest.fn(),
            redirect: jest.fn(),
            status: jest.fn().mockReturnThis(),
            send: jest.fn(),
        };
    });

    // Test manageUsers
    describe('manageUsers', () => {
        it('should render admin_users with all users when no query', async () => {
            User.find.mockResolvedValue([{ name: 'John', email: 'john@example.com' }]);
            await AdminController.manageUsers(req, res);
            expect(User.find).toHaveBeenCalledWith({});
            expect(res.render).toHaveBeenCalledWith('admin_users', {
                title: 'User Management',
                users: [{ name: 'John', email: 'john@example.com' }],
                q: undefined,
            });
        });

        it('should filter users by query', async () => {
            req.query.q = 'john';
            User.find.mockResolvedValue([{ name: 'John', email: 'john@example.com' }]);
            await AdminController.manageUsers(req, res);
            expect(User.find).toHaveBeenCalledWith({
                $or: [{ name: expect.any(RegExp) }, { email: expect.any(RegExp) }],
            });
            expect(res.render).toHaveBeenCalledWith('admin_users', {
                title: 'User Management',
                users: [{ name: 'John', email: 'john@example.com' }],
                q: 'john',
            });
        });
    });

    // Test createUser
    describe('createUser', () => {
        it('should create user and redirect on success', async () => {
            req.body = { email: 'test@example.com', name: 'Test', age: 25, password: '123' };
            User.create.mockResolvedValue({ _id: '1', ...req.body });
            await AdminController.createUser(req, res);
            expect(User.create).toHaveBeenCalledWith(req.body);
            expect(res.redirect).toHaveBeenCalledWith('/admin/users');
        });

        it('should render form with error on failure', async () => {
            req.body = { email: 'test@example.com', name: 'Test', age: 25, password: '123' };
            User.create.mockRejectedValue(new Error('DB Error'));
            await AdminController.createUser(req, res);
            expect(res.render).toHaveBeenCalledWith('formnew_user', {
                title: 'Add New User',
                error: expect.any(Error),
            });
        });
    });

    // Test updateUser
    describe('updateUser', () => {
        it('should update user and redirect on success', async () => {
            req.params.id = '1';
            req.body = { email: 'new@example.com', name: 'New', age: 30, password: 'newpass' };
            User.updateOne.mockResolvedValue({ matchedCount: 1 });
            await AdminController.updateUser(req, res);
            expect(User.updateOne).toHaveBeenCalledWith(
                { _id: '1' },
                { email: 'new@example.com', name: 'New', age: 30, password: 'newpass' }
            );
            expect(res.redirect).toHaveBeenCalledWith('/admin/users');
        });

        it('should render form with error on failure', async () => {
            req.params.id = '1';
            req.body = { email: 'new@example.com', name: 'New', age: 30 };
            User.updateOne.mockRejectedValue(new Error('DB Error'));
            User.findById.mockResolvedValue({ _id: '1', email: 'old@example.com' });
            await AdminController.updateUser(req, res);
            expect(res.render).toHaveBeenCalledWith('formedit_user', {
                title: 'Edit User',
                user: { _id: '1', email: 'old@example.com' },
                error: expect.any(Error),
            });
        });
    });

    // Test deleteUser
    describe('deleteUser', () => {
        it('should delete user and redirect', async () => {
            req.params.id = '1';
            User.deleteOne.mockResolvedValue({ deletedCount: 1 });
            await AdminController.deleteUser(req, res);
            expect(User.deleteOne).toHaveBeenCalledWith({ _id: '1' });
            expect(res.redirect).toHaveBeenCalledWith('/admin/users');
        });
    });

    // Test manageProducts (tương tự manageUsers)
    describe('manageProducts', () => {
        it('should render admin_products with all products when no query', async () => {
            Product.find.mockResolvedValue([{ name: 'Shirt', price: 20 }]);
            await AdminController.manageProducts(req, res);
            expect(Product.find).toHaveBeenCalledWith({});
            expect(res.render).toHaveBeenCalledWith('admin_products', {
                title: 'Product Management',
                products: [{ name: 'Shirt', price: 20 }],
                q: undefined,
            });
        });
    });

    // Test createProduct
    describe('createProduct', () => {
        it('should create product and redirect on success', async () => {
            req.body = {
                name: 'Shirt',
                category: 'Clothing',
                price: '20',
                originalPrice: '25',
                image: 'shirt.jpg',
                sale: 'on',
                newArrival: '',
                bestSeller: 'on',
            };
            Product.create.mockResolvedValue({ _id: '1', ...req.body });
            await AdminController.createProduct(req, res);
            expect(Product.create).toHaveBeenCalledWith({
                name: 'Shirt',
                category: 'Clothing',
                price: '20',
                originalPrice: '25',
                image: 'shirt.jpg',
                sale: true,
                newArrival: false,
                bestSeller: true,
            });
            expect(res.redirect).toHaveBeenCalledWith('/admin/products');
        });
    });
});
