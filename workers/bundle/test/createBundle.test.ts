import { CreateBundle } from "../src/endpoints/createBundle";

// Mock environment variables
const mockEnv = {
  DB: {
    prepare: jest.fn().mockReturnThis(),
    bind: jest.fn().mockReturnThis(),
    run: jest.fn(),
    first: jest.fn(),
  },
};

describe("CreateBundle", () => {
  let createBundle: CreateBundle;

  beforeEach(() => {
    createBundle = new CreateBundle();
    jest.clearAllMocks();
  });

  it("should add a bundle and return the bundle id", async () => {
    // Mock the database interaction
    mockEnv.DB.run.mockResolvedValueOnce(undefined);
    mockEnv.DB.first.mockResolvedValueOnce({ id: 123 });

    // Mock the request data
    const requestData = {
      params: {
        user_id: 1,
        bundle_name: "Test Bundle",
        bundle_desc: "Test Bundle Description",
        category_id: 123,
        bundle_size: 4,
        image_id: 456,
      },
    };

    // Call the handle method
    const response = await createBundle.handle(
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
    expect(mockEnv.DB.bind).toHaveBeenCalledTimes(2);
    expect(mockEnv.DB.run).toHaveBeenCalled();
    expect(mockEnv.DB.first).toHaveBeenCalledWith();
  });
});
