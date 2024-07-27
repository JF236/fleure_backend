import { ListBundlesByCategory } from "../src/endpoints/listBundlesByCategory";

// Mock environment variables
const mockEnv = {
  DB: {
    prepare: jest.fn().mockReturnThis(),
    bind: jest.fn().mockReturnThis(),
    all: jest.fn(),
  },
};

describe("ListBundlesByCategory", () => {
  let listBundlesByCategory: ListBundlesByCategory;

  beforeEach(() => {
    listBundlesByCategory = new ListBundlesByCategory();
    jest.clearAllMocks();
  });

  it("should return a list of bundles for the specified category", async () => {
    // Mock the database interaction
    const mockBundles = [
      {
        id: 1,
        user_id: 2,
        bundle_name: "Bundle 1",
        bundle_desc: "Description 1",
        category_id: 123,
        state_id: 1,
        bundle_size: 10,
        creation_date: 1622548800,
        updated_date: 1622548800,
        image_id: 456,
      },
      // Add more mock bundles if needed
    ];

    mockEnv.DB.all.mockResolvedValueOnce({ results: mockBundles });

    // Mock the request data
    const requestData = {
      params: {
        category_id: 123,
      },
    };

    // Call the handle method
    const response = await listBundlesByCategory.handle(
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
      result: mockBundles,
    });

    // Verify the database interactions
    expect(mockEnv.DB.prepare).toHaveBeenCalledWith("SELECT * FROM bundles WHERE category_id = ?");
    expect(mockEnv.DB.bind).toHaveBeenCalledWith(123);
    expect(mockEnv.DB.all).toHaveBeenCalled();
  });

  it("should return an error response when database query fails", async () => {
    // Mock the database interaction to throw an error
    mockEnv.DB.all.mockRejectedValueOnce(new Error("Database Error"));

    // Mock the request data
    const requestData = {
      params: {
        category_id: 123,
      },
    };

    // Call the handle method
    const response = await listBundlesByCategory.handle(
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
    expect(mockEnv.DB.prepare).toHaveBeenCalledWith("SELECT * FROM bundles WHERE category_id = ?");
    expect(mockEnv.DB.bind).toHaveBeenCalledWith(123);
    expect(mockEnv.DB.all).toHaveBeenCalled();
  });
});
