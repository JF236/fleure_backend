import { CreateBundle } from '../src/endpoints/createBundle';
import { Bool } from 'chanfana';
import { Item } from '../src/item';
import { routeOptions, responseSchema } from './routeOptions';

interface ResponseData {
  success: boolean;
  result: {
    bundleId: number;
    items: typeof Item[];
  };
}

describe('CreateBundle', () => {
  let createBundle: CreateBundle;
  let mockDb;

  beforeEach(() => {
    // Create a mock of D1Database
    mockDb = {
      prepare: jest.fn(),
    } as unknown;

    createBundle = new CreateBundle(routeOptions); // Use imported routeOptions
    jest.spyOn(createBundle, 'getValidatedData').mockResolvedValue({
      body: {
        user_id: 1,
        bundle_name: 'Test Bundle',
        bundle_desc: 'Test Description',
        category_id: 2,
        bundle_size: 1,
        image_id: 123,
        items: [{ item_name: 'item1', image_id: 456 }],
      },
    });
  });

  it('should successfully create a bundle and items', async () => {
    // Create mock implementations for D1PreparedStatement
    const mockStatement = {
      bind: jest.fn().mockReturnThis(),
      first: jest.fn().mockResolvedValue({ id: 1 }), // Ensure this returns the correct bundle ID
      run: jest.fn().mockResolvedValue(undefined),
      all: jest.fn(),
      raw: jest.fn(),
    };
  
    mockDb.prepare
      .mockReturnValueOnce(mockStatement) // Insert bundle
      .mockReturnValueOnce(mockStatement) // Retrieve bundle ID
      .mockReturnValueOnce(mockStatement) // Insert item
      .mockReturnValueOnce(mockStatement); // Retrieve item ID
  
    const mockContext = {
      env: { DB: mockDb },
    };
  
    const response = await createBundle.handle(mockContext as any);
    const responseBody = (await response.json()) as ResponseData;
  
    expect(response.status).toBe(200);
    expect(responseBody.success).toBe(true);
    expect(responseBody.result.bundleId).toBe(1);
    expect(responseBody.result.items).toEqual([{ item_name: 'item1', image_id: 456, id: 1, bundle_id: 1 }]);
  });
  

  it('should return 400 if the items array length does not match bundle size', async () => {
    jest.spyOn(createBundle, 'getValidatedData').mockResolvedValue({
      body: {
        user_id: 1,
        bundle_name: 'Test Bundle',
        bundle_desc: 'Test Description',
        category_id: 2,
        bundle_size: 2, // Bundle size doesn't match items length
        image_id: 123,
        items: [{ item_name: 'item1', image_id: 456 }],
      },
    });

    const mockContext = {
      env: { DB: mockDb },
    };

    const response = await createBundle.handle(mockContext as any);

    expect(response.status).toBe(400);
    const responseBody = await response.json() as { success: boolean; result: string };
    expect(responseBody.success).toBe(false);
    expect(responseBody.result).toBe("Items array length does not match bundle size.");
  });

  it('should return 500 on a database error', async () => {
    const mockContext = {
      env: { DB: mockDb },
    };

    // Mock database to throw an error
    mockDb.prepare.mockImplementation(() => {
      throw new Error('Database error');
    });

    const response = await createBundle.handle(mockContext as any);

    expect(response.status).toBe(500);
    const responseBody = await response.json() as { success: boolean; result: string };
    expect(responseBody.success).toBe(false);
    expect(responseBody.result).toContain("Database error: Error: Database error");
  });
});
