import { GetAllTags } from '../src/endpoints/getAllTags';

describe('GetAllTags route', () => {
    let route: GetAllTags;
    let mockEnv: any;

    beforeEach(() => {
        route = new GetAllTags();
        mockEnv = {
            DB: {
                prepare: jest.fn().mockReturnThis(),
                all: jest.fn(),
            },
        };
    });

    it('should return all tags', async () => {
        // Mock the result of the SELECT query for all tags
        const mockTags = [
            { id: 1, tag_name: 'tag1' },
            { id: 2, tag_name: 'tag2' },
        ];
        mockEnv.DB.all.mockResolvedValueOnce(mockTags);

        // Simulate a request (doesn't require parameters for GetAllTags)
        const request = new Request('https://example.com');

        const response = await route.handle(request, mockEnv, {}, {});

        expect(response.json).toEqual({ success: true, result: mockTags });
    });
});
