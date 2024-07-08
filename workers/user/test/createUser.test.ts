import { CreateUser } from '../src/endpoints/createUser';

describe('CreateUser', () => {
    // Mock environment with a mock database
    const mockEnv = {
        DB: {
            prepare: jest.fn().mockReturnThis(),
            bind: jest.fn().mockReturnThis(),
            first: jest.fn(),
            run: jest.fn(),
        },
    };

    afterEach(() => {
        jest.clearAllMocks(); // Clear mocks after each test
    });

    it('should handle new user creation successfully', async () => {
        // Mock database responses
        mockEnv.DB.first.mockResolvedValueOnce(null); // Username does not exist
        mockEnv.DB.first.mockResolvedValueOnce(null); // Email does not exist
        mockEnv.DB.first.mockResolvedValueOnce({ id: 1 }); // Mock the ID returned

        const createUser = new CreateUser();
        const request = {} as Request; // Mock request object

        const response = await createUser.handle(request, mockEnv, {}, {
            params: {
                username: 'newuser',
                email: 'newuser@example.com',
                password: 'password123',
            },
        });

        expect(response.status).toBe(200);
        const responseBody = await response.json() as { success: boolean, result: number };
        expect(responseBody.success).toBe(true);
        expect(responseBody.result).toBe(1);
    });

    it('should handle existing username', async () => {
        // Mock database response for existing username
        mockEnv.DB.first.mockResolvedValueOnce({ username: 'existinguser' });

        const createUser = new CreateUser();
        const request = {} as Request; // Mock request object

        const response = await createUser.handle(request, mockEnv, {}, {
            params: {
                username: 'existinguser',
                email: 'newuser@example.com',
                password: 'password123',
            },
        });

        expect(response.status).toBe(409);
        const responseBody = await response.json() as { success: boolean, error: String };
        expect(responseBody.success).toBe(false);
        expect(responseBody.error).toBe('Username exists');
    });

    it('should handle existing email', async () => {
        // Mock database response for existing email
        mockEnv.DB.first.mockResolvedValueOnce(null); // Username does not exist
        mockEnv.DB.first.mockResolvedValueOnce({ email: 'existing@example.com' });

        const createUser = new CreateUser();
        const request = {} as Request; // Mock request object

        const response = await createUser.handle(request, mockEnv, {}, {
            params: {
                username: 'newuser',
                email: 'existing@example.com',
                password: 'password123',
            },
        });

        expect(response.status).toBe(409);
        const responseBody = await response.json() as { success: boolean, error: String };
        expect(responseBody.success).toBe(false);
        expect(responseBody.error).toBe('Email exists');
    });

    // Add more tests as needed for edge cases and error handling
});
