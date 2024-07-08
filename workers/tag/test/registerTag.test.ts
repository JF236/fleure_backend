import { RegisterTag } from '../src/endpoints/registerTag';

describe('RegisterTag route', () => {
    let route: RegisterTag;
    let mockEnv: any;

    beforeEach(() => {
        route = new RegisterTag();
        mockEnv = {
            DB: {
                prepare: jest.fn().mockReturnThis(),
                bind: jest.fn().mockReturnThis(),
                first: jest.fn(),
                run: jest.fn(),
            },
        };
    });

    it('should register a new tag successfully', async () => {
        const insertedTagId = 123;
        mockEnv.DB.first.mockResolvedValueOnce(undefined).mockResolvedValueOnce({id: insertedTagId});

        const request = new Request('https://example.com', {
            method: 'POST',
            body: JSON.stringify({ params: { tag_name: 'new_tag' } }),
        });

        const response = await route.handle(request, mockEnv, {}, { params: { tag_name: 'new_tag' } });

        expect(response.status).toBe(200);
        expect(response.headers.get('Content-Type')).toBe('application/json');
        const responseBody: { success: boolean, result: number } = await response.json();
        expect(responseBody.success).toBe(true);
        expect(responseBody.result).toBe(insertedTagId);
    });

    it('should return 409 if the tag already exists', async () => {
        // Mock the result of the SELECT query when the tag already exists
        mockEnv.DB.first.mockResolvedValueOnce({ id: 1 });

        // Simulate a request with necessary parameters
        const request = new Request('https://example.com', {
            method: 'POST',
            body: JSON.stringify({ params: { tag_name: 'existing_tag' } }),
        });

        const response = await route.handle(request, mockEnv, {}, { params: { tag_name: 'existing_tag' } });

        expect(response.status).toBe(409);
        expect(response.headers.get('Content-Type')).toBe('application/json');
        const responseBody: { success: boolean, error: number } = await response.json();
        expect(responseBody.success).toBe(false);
        expect(responseBody.error).toBe(1); // Assuming error is populated correctly
    });
});
