// Tests for adminController aligned with current repo structure
import { adminController } from '../controllers/adminController.mjs';

// Mock Services used by the controller
const mockUserService = {
    searchUsers: jest.fn(),
    createUser: jest.fn(),
    updateUser: jest.fn(),
    deleteUser: jest.fn(),
    getUserById: jest.fn()
};
const mockProductService = {
    searchProducts: jest.fn(),
    createProduct: jest.fn(),
    updateProduct: jest.fn(),
    deleteProduct: jest.fn(),
    getProductById: jest.fn()
};

jest.mock('../services/UserService.mjs', () => ({
    __esModule: true,
    default: mockUserService
}));

jest.mock('../services/ProductService.mjs', () => ({
    __esModule: true,
    default: mockProductService
}));

describe('adminController', () => {
    let req, res;

    beforeEach(() => {
        jest.clearAllMocks();
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
            mockUserService.searchUsers.mockResolvedValueOnce([{ name: 'John', email: 'john@example.com' }]);
            await adminController.manageUsers(req, res);
            expect(mockUserService.searchUsers).toHaveBeenCalledWith('');
            expect(res.render).toHaveBeenCalledWith('admin', expect.objectContaining({
                title: 'User Management',
                users: [{ name: 'John', email: 'john@example.com' }],
                q: '',
                error: null
            }));
        });

        it('filters users by query', async () => {
            req.query.q = 'john';
            mockUserService.searchUsers.mockResolvedValueOnce([{ name: 'John', email: 'john@example.com' }]);
            await adminController.manageUsers(req, res);
            expect(mockUserService.searchUsers).toHaveBeenCalledWith('john');
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
            mockUserService.updateUser.mockResolvedValueOnce({ matchedCount: 1 });
            await adminController.updateUser(req, res);
            expect(mockUserService.updateUser).toHaveBeenCalledWith('1', {
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
            mockProductService.searchProducts.mockResolvedValueOnce([{ name: 'Shirt', price: 20 }]);
            await adminController.manageProducts(req, res);
            expect(mockProductService.searchProducts).toHaveBeenCalledWith('');
            expect(res.render).toHaveBeenCalledWith('admin', expect.objectContaining({
                title: 'Product Management',
                products: [{ name: 'Shirt', price: 20 }],
                q: '',
                error: null
            }));
        });
    });
});
