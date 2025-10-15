// ESM-friendly Jest usage and tests for adminController
import { jest } from '@jest/globals';
import { adminController } from '../controllers/adminController.mjs';
import UserService from '../services/UserService.mjs';
import ProductService from '../services/ProductService.mjs';

describe('adminController', () => {
    let req, res;

    beforeEach(() => {
        jest.restoreAllMocks();
        req = { query: {}, params: {}, body: {}, user: undefined };
        res = {
            render: jest.fn(),
            redirect: jest.fn(),
            status: jest.fn().mockReturnThis(),
            send: jest.fn(),
        };
    });

    describe('manageUsers', () => {
        it('renders admin with all users when no query', async () => {
            jest.spyOn(UserService, 'searchUsers').mockResolvedValueOnce([{ name: 'John', email: 'john@example.com' }]);
            await adminController.manageUsers(req, res);
            expect(UserService.searchUsers).toHaveBeenCalledWith('');
            expect(res.render).toHaveBeenCalledWith('admin', expect.objectContaining({
                title: 'User Management',
                users: [{ name: 'John', email: 'john@example.com' }],
                q: '',
                error: null
            }));
        });

        it('filters users by query', async () => {
            req.query.q = 'john';
            jest.spyOn(UserService, 'searchUsers').mockResolvedValueOnce([{ name: 'John', email: 'john@example.com' }]);
            await adminController.manageUsers(req, res);
            expect(UserService.searchUsers).toHaveBeenCalledWith('john');
            expect(res.render).toHaveBeenCalledWith('admin', expect.objectContaining({
                title: 'User Management',
                users: [{ name: 'John', email: 'john@example.com' }],
                q: 'john',
                error: null
            }));
        });
    });

    describe('updateUser', () => {
        it('updates user and redirects on success (no password change)', async () => {
            req.params.id = '1';
            req.body = { email: 'new@example.com', name: 'New', age: 30, password: '' };
            jest.spyOn(UserService, 'updateUser').mockResolvedValueOnce({ matchedCount: 1 });
            await adminController.updateUser(req, res);
            expect(UserService.updateUser).toHaveBeenCalledWith('1', {
                email: 'new@example.com',
                name: 'New',
                age: 30,
                role: undefined
            });
            expect(res.redirect).toHaveBeenCalledWith('/admin/users');
        });
    });

    describe('manageProducts', () => {
        it('renders admin with all products when no query', async () => {
            jest.spyOn(ProductService, 'searchProducts').mockResolvedValueOnce([{ name: 'Shirt', price: 20 }]);
            await adminController.manageProducts(req, res);
            expect(ProductService.searchProducts).toHaveBeenCalledWith('');
            expect(res.render).toHaveBeenCalledWith('admin', expect.objectContaining({
                title: 'Product Management',
                products: [{ name: 'Shirt', price: 20 }],
                q: '',
                error: null
            }));
        });
    });
});
