import { AddItem } from "../src/endpoints/addItem";

// Mock environment variables
const mockEnv = {
  DB: {
    prepare: jest.fn().mockReturnThis(),
    bind: jest.fn().mockReturnThis(),
    run: jest.fn(),
    first: jest.fn(),
  },
};

describe("AddItem", () => {
  let addItem: AddItem;

  beforeEach(() => {
    addItem = new AddItem();
    jest.clearAllMocks();
  });

  it("should add an item and return the item id", async () => {
    // Mock the database interaction
    mockEnv.DB.run.mockResolvedValueOnce(undefined);
    mockEnv.DB.first.mockResolvedValueOnce({ id: 123 });

    // Mock the request data
    const requestData = {
      params: {
        bundle_id: 1,
        item_name: "Test Item",
        image_id: 456,
      },
    };

    // Call the handle method
    const response = await addItem.handle(
      {} as Request,
      mockEnv,
      {} as any,
      requestData
    );

    // Verify the response
    expect(response.status).toBe(200);
    const responseBody = await response.json();
    expect(responseBody).toEqual({
      success: true,
      result: 123,
    });

    // Verify the database interactions
    expect(mockEnv.DB.prepare).toHaveBeenCalledTimes(2);
    expect(mockEnv.DB.bind).toHaveBeenCalledWith(1, "Test Item", 456);
    expect(mockEnv.DB.run).toHaveBeenCalled();
    expect(mockEnv.DB.first).toHaveBeenCalledWith();
  });
});
