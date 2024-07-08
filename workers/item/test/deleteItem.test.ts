import { DeleteItem } from "../src/endpoints/deleteItem";

const mockEnv = {
  DB: {
    prepare: jest.fn().mockReturnThis(),
    bind: jest.fn().mockReturnThis(),
    run: jest.fn(),
  },
};

describe("DeleteItem", () => {
  let deleteItem: DeleteItem;

  beforeEach(() => {
    deleteItem = new DeleteItem();
    jest.clearAllMocks();
  });

  it("should delete an item and return a success message", async () => {
    mockEnv.DB.run.mockResolvedValueOnce(undefined);

    const requestData = {
      params: {
        id: 1,
      },
    };

    const response = await deleteItem.handle(
      {} as Request,
      mockEnv,
      {} as any,
      requestData
    );

    expect(response.status).toBe(200);
    const responseBody = await response.json();
    expect(responseBody).toEqual({
      success: true,
      result: "Item is no longer in the table",
    });

    expect(mockEnv.DB.prepare).toHaveBeenCalledTimes(1);
    expect(mockEnv.DB.bind).toHaveBeenCalledWith(1);
    expect(mockEnv.DB.run).toHaveBeenCalled();
  });
});
