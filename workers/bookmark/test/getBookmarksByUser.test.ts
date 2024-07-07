import { GetBookmarksByUser } from "../src/endpoints/getBookmarksByUser";

describe("GetBookmarksByUser", () => {
  it("should return bookmarks for a valid user ID", async () => {
    const mockEnv = {
      DB: {
        prepare: jest.fn().mockReturnThis(),
        bind: jest.fn().mockReturnThis(),
        all: jest.fn().mockResolvedValue([{ bundle_id: 1 }, { bundle_id: 2 }]),
      },
    };

    const mockData = {
      params: {
        user_id: 123,
      },
    };

    const route = new GetBookmarksByUser();
    const response = await route.handle(
      {} as Request, 
      mockEnv,
      {},
      mockData
    );

    expect(response.status).toBe(200);
    const responseData: { result: { bundle_id: number }[] } = await response.json();
    expect(responseData.result).toHaveLength(2);
    expect(responseData.result).toEqual([{ bundle_id: 1 }, { bundle_id: 2 }]);
  });

});
