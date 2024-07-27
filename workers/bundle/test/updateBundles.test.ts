import { UpdateBundle } from "../src/endpoints/updateBundle";

// Mock environment variables
const mockEnv = {
  DB: {
    prepare: jest.fn().mockReturnThis(),
    bind: jest.fn().mockReturnThis(),
    first: jest.fn(),
    run: jest.fn(),
  },
};

describe("UpdateBundle", () => {
  let updateBundle: UpdateBundle;

  beforeEach(() => {
    updateBundle = new UpdateBundle();
    jest.clearAllMocks();
  });

  it("should update the bundle if it exists", async () => {
    // Mock the database interactions
    mockEnv.DB.first.mockResolvedValueOnce({ id: 1 }); // Simulate that the bundle exists
    mockEnv.DB.run.mockResolvedValueOnce(undefined); // Simulate a successful update

    // Mock the request data
    const requestData = {
      params: {
        id: 1,
        bundle_name: "Updated Bundle Name",
        bundle_desc: "Updated Bundle Description",
        category_id: "2",
        image_id: "3",
      },
    };

    // Call the handle method
    const response = await updateBundle.handle(
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
      result: "Bundle updated successfully",
    });

    // Verify the database interactions
    expect(mockEnv.DB.prepare).toHaveBeenCalledWith("SELECT * FROM bundles WHERE id = ? ");
    expect(mockEnv.DB.bind).toHaveBeenCalledWith(1);
    expect(mockEnv.DB.first).toHaveBeenCalled();
    expect(mockEnv.DB.prepare).toHaveBeenCalledWith("UPDATE bundles SET bundle_name = ?, bundle_desc = ?, category_id = ?, image_id = ? WHERE id = ?");
    expect(mockEnv.DB.bind).toHaveBeenCalledWith("Updated Bundle Name", "Updated Bundle Description", "2", "3", 1);
    expect(mockEnv.DB.run).toHaveBeenCalled();
  });

  it("should return an error response if the bundle does not exist", async () => {
    // Mock the database interactions
    mockEnv.DB.first.mockResolvedValueOnce(null); // Simulate that the bundle does not exist

    // Mock the request data
    const requestData = {
      params: {
        id: 1,
        bundle_name: "Updated Bundle Name",
        bundle_desc: "Updated Bundle Description",
        category_id: "2",
        image_id: "3",
      },
    };

    // Call the handle method
    const response = await updateBundle.handle(
      {} as Request,
      mockEnv,
      {} as any,
      requestData
    );

    // Verify the response
    expect(response.status).toBe(409);
    const responseBody = await response.json();
    expect(responseBody).toEqual({
      success: false,
      error: "Bundle does not exist",
    });

    // Verify the database interactions
    expect(mockEnv.DB.prepare).toHaveBeenCalledWith("SELECT * FROM bundles WHERE id = ? ");
    expect(mockEnv.DB.bind).toHaveBeenCalledWith(1);
    expect(mockEnv.DB.first).toHaveBeenCalled();
    expect(mockEnv.DB.prepare).not.toHaveBeenCalledWith("UPDATE bundles SET bundle_name = ?, bundle_desc = ?, category_id = ?, image_id = ? WHERE id = ?");
    expect(mockEnv.DB.bind).not.toHaveBeenCalledWith("Updated Bundle Name", "Updated Bundle Description", "2", "3", 1);
    expect(mockEnv.DB.run).not.toHaveBeenCalled();
  });
});
