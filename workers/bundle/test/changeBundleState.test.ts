import { ChangeBundleState } from "../src/endpoints/changeBundleState";

// Mock environment variables
const mockEnv = {
  DB: {
    prepare: jest.fn().mockReturnThis(),
    bind: jest.fn().mockReturnThis(),
    run: jest.fn(),
  },
};

describe("ChangeBundleState", () => {
  let changeBundleState: ChangeBundleState;

  beforeEach(() => {
    changeBundleState = new ChangeBundleState();
    jest.clearAllMocks();
  });

  it("should update the bundle state and return success", async () => {
    // Mock the database interaction
    mockEnv.DB.run.mockResolvedValueOnce(undefined);

    // Mock the request data
    const requestData = {
      params: {
        id: 123,
        state_id: 5,
      },
    };

    // Call the handle method
    const response = await changeBundleState.handle(
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
      result: "Bundle state changed (if ID exists)",
    });

    // Verify the database interactions
    expect(mockEnv.DB.prepare).toHaveBeenCalledWith("UPDATE bundles SET state_id = ? WHERE id = ?");
    expect(mockEnv.DB.bind).toHaveBeenCalledWith(5, 123);
    expect(mockEnv.DB.run).toHaveBeenCalled();
  });

  it("should return an error response when update fails", async () => {
    // Mock the database interaction to throw an error
    mockEnv.DB.run.mockRejectedValueOnce(new Error("Database Error"));

    // Mock the request data
    const requestData = {
      params: {
        id: 123,
        state_id: 5,
      },
    };

    // Call the handle method
    const response = await changeBundleState.handle(
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
    expect(mockEnv.DB.prepare).toHaveBeenCalledWith("UPDATE bundles SET state_id = ? WHERE id = ?");
    expect(mockEnv.DB.bind).toHaveBeenCalledWith(5, 123);
    expect(mockEnv.DB.run).toHaveBeenCalled();
  });
});
