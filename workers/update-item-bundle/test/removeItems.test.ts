import { RemoveItems } from '../src/endpoints/removeItems';
import { Bool } from 'chanfana';
import { routeOptions } from './routeOptions'; // Adjust path as necessary

interface ResponseData {
  success: boolean;
  result: string;
}

describe('RemoveItems', () => {
  let removeItems: RemoveItems;
  let mockDb;

  beforeEach(() => {
    // Create a mock of D1Database
    mockDb = {
      prepare: jest.fn(),
    } as unknown;

    removeItems = new RemoveItems(routeOptions); // Use imported routeOptions
    jest.spyOn(removeItems, 'getValidatedData').mockResolvedValue({
      body: {
        bundle_id: 1,
        item_ids: [1, 2],
      },
    });
  });

  it('should successfully remove items from a bundle', async () => {
    const mockSelectStatement = {
      bind: jest.fn().mockReturnThis(),
      first: jest.fn().mockResolvedValue({ id: 1 }),
    };
    
    const mockDeleteStatement = {
      bind: jest.fn().mockReturnThis(),
      run: jest.fn().mockResolvedValue(undefined),
    };
    
    const mockCountStatement = {
      bind: jest.fn().mockReturnThis(),
      first: jest.fn().mockResolvedValue({ count: 3 }),
    };
    
    const mockUpdateStatement = {
      bind: jest.fn().mockReturnThis(),
      run: jest.fn().mockResolvedValue(undefined),
    };

    mockDb.prepare
      .mockReturnValueOnce(mockSelectStatement)
      .mockReturnValueOnce(mockDeleteStatement)
      .mockReturnValueOnce(mockDeleteStatement)
      .mockReturnValueOnce(mockCountStatement)
      .mockReturnValueOnce(mockUpdateStatement);

    const mockContext = {
      env: { DB: mockDb },
    };

    const response = await removeItems.handle(mockContext as any);

    expect(response.status).toBe(200);
    const responseBody = await response.json() as ResponseData;
    expect(responseBody.success).toBe(true);
    expect(responseBody.result).toBe("Items removed successfully.");
  });

  it('should return 400 if the bundle does not exist', async () => {
    const mockSelectStatement = {
      bind: jest.fn().mockReturnThis(),
      first: jest.fn().mockResolvedValue(null),
    };

    mockDb.prepare.mockReturnValueOnce(mockSelectStatement);

    const mockContext = {
      env: { DB: mockDb },
    };

    const response = await removeItems.handle(mockContext as any);

    expect(response.status).toBe(400);
    const responseBody = await response.json() as ResponseData;
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

    const response = await removeItems.handle(mockContext as any);

    expect(response.status).toBe(500);
    const responseBody = await response.json() as ResponseData;
    expect(responseBody.success).toBe(false);
    expect(responseBody.result).toContain("Database error: Error: Database error");
  });
});
