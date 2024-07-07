import { GetTagsByBundle } from '../src/endpoints/getTagsByBundle'; // Adjust the import path as necessary

describe('GetTagsByBundle', () => {
    // Mock environment object
    const mockEnv = {
        DB: {
            prepare: jest.fn().mockReturnThis(),
            bind: jest.fn().mockReturnThis(),
            all: jest.fn().mockResolvedValue([{ tag_id: 1 }, { tag_id: 2 }]), // Mocking the results from the database
        },
    };

    it('should return tags for a given bundle ID', async () => {
        // Mock data for the request
        const mockData = {
            params: {
                bundle_id: 123, // Replace with your bundle ID for testing
            },
        };

        // Create an instance of GetTagsByBundle
        const route = new GetTagsByBundle();

        // Simulate handle function call with mock parameters
        const response = await route.handle(
            {} as Request,
            mockEnv,
            {} as any, // Mock context object
            mockData
        );

        // Assert response status
        expect(response.status).toBe(200);

        // Assert response body content
        const responseBody: { result: { bundle_id: number }[] } = await response.json();
        expect(responseBody.result).toEqual([{ tag_id: 1 }, { tag_id: 2 }]);

        // Optionally, you can assert the database interactions
        expect(mockEnv.DB.prepare).toHaveBeenCalledWith(
            'SELECT tag_id FROM bundle_tags WHERE bundle_id = ?'
        );
        expect(mockEnv.DB.bind).toHaveBeenCalledWith(123); // Assert the correct bundle_id was bound
        expect(mockEnv.DB.all).toHaveBeenCalled(); // Assert that the query was executed
    });
});
