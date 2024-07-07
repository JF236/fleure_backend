import { GetBundlesByTag } from '../src/endpoints/getBundlesByTag'; // Adjust the path as per your project structure

describe('GetBundlesByTag', () => {
  // Mock environment and context objects
  const mockEnv = {
    DB: {
      prepare: jest.fn().mockReturnThis(),
      bind: jest.fn().mockReturnThis(),
      all: jest.fn().mockResolvedValue([{ bundle_id: 1 }, { bundle_id: 2 }]), // Adjust mock data as needed
    },
  };

  const mockContext = {};

  it('should return bundle IDs for a given tag ID', async () => {
    const tagId = 123; // Replace with a valid tag ID for testing

    // Mock request and data objects
    const mockRequest = {} as Request;
    const mockData = { params: { tag_id: tagId } };

    // Create an instance of GetBundlesByTag
    const getBundlesByTag = new GetBundlesByTag();

    // Invoke the handle method with mocked parameters
    const response = await getBundlesByTag.handle(mockRequest, mockEnv, mockContext, mockData);

    // Assert that the database query methods were called correctly
    expect(mockEnv.DB.prepare).toHaveBeenCalledWith('SELECT bundle_id FROM bundle_tags WHERE tag_id = ?');
    expect(mockEnv.DB.bind).toHaveBeenCalledWith(tagId);
    expect(mockEnv.DB.all).toHaveBeenCalled();

    // Assert the response structure and content
    expect(response).toBeInstanceOf(Response);
    expect(response.status).toBe(200);

    const responseBody: { result: { bundle_id: number }[] } = await response.json();
    expect(responseBody).toEqual({ result: [{ bundle_id: 1 }, { bundle_id: 2 }] }); // Adjust expected data based on your mock data
  });
});
