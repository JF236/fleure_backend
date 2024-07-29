import { AddItems } from '../src/endpoints/addItems';
import { Bool } from 'chanfana';
import { Item } from '../src/item';
import { routeOptions } from './routeOptions';

interface ResponseData {
  success: boolean;
  result: {
    bundle_id: number;
    items: typeof Item[];
  };
}

describe('AddItems', () => {
  let addItems: AddItems;
  let mockDb;

  beforeEach(() => {
    // Create a mock of D1Database
    mockDb = {
      prepare: jest.fn(),
    } as unknown;

    addItems = new AddItems(routeOptions); // Use imported routeOptions
    jest.spyOn(addItems, 'getValidatedData').mockResolvedValue({
      body: {
        bundle_id: 1,
        items: [{ item_name: 'item1', image_id: 123 }],
      },
    });
  });

  it('should successfully add items to a bundle', async () => {
    // Create mock implementations for D1PreparedStatement
    const mockStatement = {
      bind: jest.fn().mockReturnThis(),
      first: jest.fn().mockResolvedValue({ bundle_size: 5 }),
      run: jest.fn().mockResolvedValue(undefined),
      all: jest.fn(),
      raw: jest.fn(),
    };

    mockDb.prepare
      .mockReturnValueOnce(mockStatement)
      .mockReturnValueOnce(mockStatement)
      .mockReturnValueOnce(mockStatement)
      .mockReturnValueOnce(mockStatement);

    const mockContext = {
      env: { DB: mockDb },
    };

    const response = await addItems.handle(mockContext as any);

    expect(response.status).toBe(200);
    const responseBody = await response.json() as ResponseData;
    expect(responseBody.success).toBe(true);
    expect(responseBody.result.bundle_id).toBe(1);
    expect(responseBody.result.items).toEqual([{ item_name: 'item1', image_id: 123 }]);
  });

  it('should return 400 if the bundle does not exist', async () => {
    const mockStatement = {
      bind: jest.fn().mockReturnThis(),
      first: jest.fn().mockResolvedValue(null),
      run: jest.fn().mockResolvedValue(undefined),
      all: jest.fn(),
      raw: jest.fn(),
    };

    mockDb.prepare.mockReturnValueOnce(mockStatement);

    const mockContext = {
      env: { DB: mockDb },
    };

    const response = await addItems.handle(mockContext as any);

    expect(response.status).toBe(400);
    const responseBody = await response.json() as { success: boolean; result: string };
    expect(responseBody.success).toBe(false);
    expect(responseBody.result).toBe("Bundle does not exist");
  });

  it('should return 500 on a database error', async () => {
    const mockContext = {
      env: { DB: mockDb },
    };

    // Mock database to throw an error
    mockDb.prepare.mockImplementation(() => {
      throw new Error('Database error');
    });

    const response = await addItems.handle(mockContext as any);

    expect(response.status).toBe(500);
    const responseBody = await response.json() as { success: boolean; result: string };
    expect(responseBody.success).toBe(false);
    expect(responseBody.result).toContain("Database error: Error: Database error");
  });
});
