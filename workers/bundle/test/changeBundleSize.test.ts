import { ChangeBundleSize } from "../src/endpoints/changeBundleSize";

// Mock environment variables
const mockEnv = {
  DB: {
    prepare: jest.fn().mockReturnThis(),
    bind: jest.fn().mockReturnThis(),
    run: jest.fn(),
  },
};

describe("ChangeBundleSize", () => {
  let changeBundleSize: ChangeBundleSize;

  beforeEach(() => {
    changeBundleSize = new ChangeBundleSize();
    jest.clearAllMocks();
  });

  it("should update the bundle size and return success", async () => {
    // Mock the database interaction
    mockEnv.DB.run.mockResolvedValueOnce(undefined);

    // Mock the request data
    const requestData = {
      params: {
        id: 123,
        bundle_size: 10,
      },
    };

    // Call the handle method
    const response = await changeBundleSize.handle(
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
    });

    // Verify the database interactions
    expect(mockEnv.DB.prepare).toHaveBeenCalledWith("UPDATE bundles SET bundle_size = ? WHERE id = ?");
    expect(mockEnv.DB.bind).toHaveBeenCalledWith(10, 123);
    expect(mockEnv.DB.run).toHaveBeenCalled();
  });

  it("should return an error response when update fails", async () => {
    // Mock the database interaction to throw an error
    mockEnv.DB.run.mockRejectedValueOnce(new Error("Database Error"));

    // Mock the request data
    const requestData = {
      params: {
        id: 123,
        bundle_size: 10,
      },
    };

    // Call the handle method
    const response = await changeBundleSize.handle(
      {} as Request,
      mockEnv,
      {} as any,
      requestData
    );

    // Verify the response
    expect(response.status).toBe(500);
    const responseBody = await response.json();
    expect(responseBody).toEqual({
      success: false,
      error: "Error: Database Error",
    });

    // Verify the database interactions
    expect(mockEnv.DB.prepare).toHaveBeenCalledWith("UPDATE bundles SET bundle_size = ? WHERE id = ?");
    expect(mockEnv.DB.bind).toHaveBeenCalledWith(10, 123);
    expect(mockEnv.DB.run).toHaveBeenCalled();
  });
});
