import { UpdateItem } from "../src/endpoints/updateItem";

const mockEnv = {
  DB: {
    prepare: jest.fn().mockReturnThis(),
    bind: jest.fn().mockReturnThis(),
    first: jest.fn(),
    run: jest.fn(),
  },
};

describe("UpdateItem", () => {
  let updateItem: UpdateItem;

  beforeEach(() => {
    updateItem = new UpdateItem();
    jest.clearAllMocks();
  });

  it("should update an item and return a success message", async () => {
    const mockCheckResult = { id: 1, item_name: "Old Item", image_id: 123 };
    mockEnv.DB.first.mockResolvedValueOnce(mockCheckResult);
    mockEnv.DB.run.mockResolvedValueOnce(undefined);

    const requestData = {
      params: {
        id: 1,
        item_name: "New Item",
        image_id: 456,
      },
    };

    const response = await updateItem.handle(
      {} as Request,
      mockEnv,
      {} as any,
      requestData
    );

    expect(response.status).toBe(200);
    const responseBody = await response.json();
    expect(responseBody).toEqual({
      success: true,
      result: "Item updated successfully",
    });

    expect(mockEnv.DB.prepare).toHaveBeenCalledTimes(2);
    expect(mockEnv.DB.bind).toHaveBeenCalledWith(1);
    expect(mockEnv.DB.bind).toHaveBeenCalledWith("New Item", 456, 1);
    expect(mockEnv.DB.run).toHaveBeenCalled();
  });

  it("should return an error if the item does not exist", async () => {
    mockEnv.DB.first.mockResolvedValueOnce(null);

    const requestData = {
      params: {
        id: 1,
        item_name: "New Item",
        image_id: 456,
      },
    };

    const response = await updateItem.handle(
      {} as Request,
      mockEnv,
      {} as any,
      requestData
    );

    expect(response.status).toBe(409);
    const responseBody = await response.json();
    expect(responseBody).toEqual({
      success: false,
      error: "Item does not exist",
    });

    expect(mockEnv.DB.prepare).toHaveBeenCalledTimes(1);
    expect(mockEnv.DB.bind).toHaveBeenCalledWith(1);
    expect(mockEnv.DB.run).not.toHaveBeenCalled();
  });
});
