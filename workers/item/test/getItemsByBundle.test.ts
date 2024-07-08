import { GetItemsByBundle } from "../src/endpoints/getItemsByBundle";

const mockEnv = {
  DB: {
    prepare: jest.fn().mockReturnThis(),
    bind: jest.fn().mockReturnThis(),
    all: jest.fn(),
  },
};

describe("GetItemsByBundle", () => {
  let getItemsByBundle: GetItemsByBundle;

  beforeEach(() => {
    getItemsByBundle = new GetItemsByBundle();
    jest.clearAllMocks();
  });

  it("should get items by bundle and return the list of items", async () => {
    const mockResult = [
      {
        id: 1,
        bundle_id: 123,
        tag_name: "Test Item",
        image_id: 456,
      },
      {
        id: 2,
        bundle_id: 123,
        tag_name: "Another Test Item",
        image_id: 789,
      },
    ];

    mockEnv.DB.all.mockResolvedValueOnce(mockResult);

    const requestData = {
      params: {
        bundle_id: 123,
      },
    };

    const response = await getItemsByBundle.handle(
      {} as Request,
      mockEnv,
      {} as any,
      requestData
    );

    expect(response.status).toBe(200);
    const responseBody = await response.json();
    expect(responseBody).toEqual({
      success: true,
      result: mockResult,
    });

    expect(mockEnv.DB.prepare).toHaveBeenCalledTimes(1);
    expect(mockEnv.DB.bind).toHaveBeenCalledWith(123);
    expect(mockEnv.DB.all).toHaveBeenCalled();
  });
});
