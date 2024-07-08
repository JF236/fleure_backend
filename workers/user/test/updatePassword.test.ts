import { UpdatePassword } from '../src/endpoints/updatePassword';

describe('UpdatePassword', () => {
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

    it('should update password successfully', async () => {
        // Mock database response for existing user
        mockEnv.DB.first.mockResolvedValueOnce({ id: 1 });

        const updatePassword = new UpdatePassword();
        const request = {} as Request; // Mock request object

        // Simulate response
        const mockResponse = new Response(
            JSON.stringify({
                success: true,
                result: 'Password updated successfully',
            }),
            { status: 200, headers: { 'Content-Type': 'application/json' } }
        );

        // Mock response.json() to return the mocked response
        jest.spyOn(mockResponse, 'json').mockResolvedValueOnce({
            success: true,
            result: 'Password updated successfully',
        });

        const response = await updatePassword.handle(request, mockEnv, {}, {
            params: {
                id: 1,
                password: 'newpassword',
            },
        });

        expect(response.status).toBe(200);
        const responseBody = await response.json() as { success: boolean, result: string }; // Explicitly type responseBody

        expect(responseBody.success).toBe(true);
        expect(responseBody.result).toBe('Password updated successfully');
    });

    it('should handle non-existing user', async () => {
        // Mock database response for non-existing user
        mockEnv.DB.first.mockResolvedValueOnce(null);

        const updatePassword = new UpdatePassword();
        const request = {} as Request; // Mock request object

        // Simulate response
        const mockResponse = new Response(
            JSON.stringify({
                success: false,
                error: 'User does not exist',
            }),
            { status: 409, headers: { 'Content-Type': 'application/json' } }
        );

        // Mock response.json() to return the mocked response
        jest.spyOn(mockResponse, 'json').mockResolvedValueOnce({
            success: false,
            error: 'User does not exist',
        });

        const response = await updatePassword.handle(request, mockEnv, {}, {
            params: {
                id: 1,
                password: 'newpassword',
            },
        });

        expect(response.status).toBe(409);
        const responseBody = await response.json() as { success: boolean, error: string }; // Explicitly type responseBody

        expect(responseBody.success).toBe(false);
        expect(responseBody.error).toBe('User does not exist');
    });

    // Add more tests as needed for edge cases and error handling
});
