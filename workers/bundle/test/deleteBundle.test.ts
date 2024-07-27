import { DeleteBundle } from "../src/endpoints/deleteBundle";

// Mock environment variables
const mockEnv = {
  DB: {
    prepare: jest.fn().mockReturnThis(),
    bind: jest.fn().mockReturnThis(),
    run: jest.fn(),
  },
};

describe("DeleteBundle", () => {
  let deleteBundle: DeleteBundle;

  beforeEach(() => {
    deleteBundle = new DeleteBundle();
    jest.clearAllMocks();
  });

  it("should delete a bundle and return a success message", async () => {
    // Mock the database interaction
    mockEnv.DB.run.mockResolvedValueOnce(undefined);

    // Mock the request data
    const requestData = {
      params: {
        id: 123,
      },
    };

    // Call the handle method
    const response = await deleteBundle.handle(
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
      result: "Bundle Deleted",
    });

    // Verify the database interactions
    expect(mockEnv.DB.prepare).toHaveBeenCalledWith(`DELETE FROM bundles WHERE id = ?`);
    expect(mockEnv.DB.bind).toHaveBeenCalledWith(123);
    expect(mockEnv.DB.run).toHaveBeenCalled();
  });

  it("should return an error response when deletion fails", async () => {
    // Mock the database interaction to throw an error
    mockEnv.DB.run.mockRejectedValueOnce(new Error("Database Error"));

    // Mock the request data
    const requestData = {
      params: {
        id: 123,
      },
    };

    // Call the handle method
    const response = await deleteBundle.handle(
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
    expect(mockEnv.DB.prepare).toHaveBeenCalledWith(`DELETE FROM bundles WHERE id = ?`);
    expect(mockEnv.DB.bind).toHaveBeenCalledWith(123);
    expect(mockEnv.DB.run).toHaveBeenCalled();
  });
});
