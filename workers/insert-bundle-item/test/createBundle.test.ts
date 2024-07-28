import { CreateBundle } from "../src/endpoints/createBundle";
import { Item } from "../src/item";

// Define the expected response types
interface SuccessResponse {
    success: boolean;
    result: {
        bundleId: number;
        items: typeof Item[];
    };
}

interface ErrorResponse {
    success: boolean;
    result: string;
}

// Mock the database methods
const mockDb = {
    prepare: jest.fn().mockImplementation((query: string) => ({
        bind: jest.fn().mockReturnThis(),
        run: jest.fn().mockResolvedValue({}),
        first: jest.fn().mockResolvedValue({ id: 1 }),
    })),
};

// Mock the `c` object passed to the `handle` method
const mockC = {
    env: { DB: mockDb as unknown },
};

// Create an instance of CreateBundle
const createBundle = new CreateBundle();
const mockRequestBody = {
    user_id: 1,
    bundle_name: "Test Bundle",
    bundle_desc: "A test bundle",
    category_id: 2,
    bundle_size: 2,
    image_id: 3,
    items: [
        { id: 0, bundle_id: 0, item_name: "Item 1", image_id: 4 },
        { id: 0, bundle_id: 0, item_name: "Item 2", image_id: 5 },
    ],
};
jest.spyOn(createBundle, 'getValidatedData').mockResolvedValue({
    body: mockRequestBody
});

describe('CreateBundle', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should create a bundle successfully', async () => {
        const response = await createBundle.handle(mockC as any);
        const data: SuccessResponse = await response.json();
        
        expect(response.status).toBe(200);
        expect(data.success).toBe(true);
        expect(data.result.bundleId).toBe(1);
        expect(data.result.items).toHaveLength(2);
    });

    it('should return 400 if items array length does not match bundle size', async () => {
        // Override mock data to have an incorrect length for items array
        jest.spyOn(createBundle, 'getValidatedData').mockResolvedValueOnce({
            body: {
                user_id: 1,
                bundle_name: "Test Bundle",
                bundle_desc: "A test bundle",
                category_id: 2,
                bundle_size: 3, // Mismatch here
                image_id: 3,
                items: [
                    { id: 0, bundle_id: 0, item_name: "Item 1", image_id: 4 },
                ],
            },
        });

        const response = await createBundle.handle(mockC as any);
        const data: ErrorResponse = await response.json();
        
        expect(response.status).toBe(400);
        expect(data.success).toBe(false);
        expect(data.result).toBe("Items array length does not match bundle size.");
    });

    it('should handle database errors', async () => {
        // Mock database to throw an error
        (mockDb.prepare as jest.Mock).mockImplementationOnce(() => ({
            bind: jest.fn().mockReturnThis(),
            run: jest.fn().mockRejectedValue(new Error("Database error")),
            first: jest.fn(),
        }));

        const response = await createBundle.handle(mockC as any);
        const data: ErrorResponse = await response.json();
        
        expect(response.status).toBe(500);
        expect(data.success).toBe(false);
        expect(data.result).toContain("Database error");
    });
});