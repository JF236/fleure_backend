import { GetIdByBundleBuyer } from '../src/endpoints/getIdByBundleBuyer';

describe('GetIdByBundleBuyer', () => {
  // Mock environment and database
  const mockEnv = {
    DB: {
      prepare: jest.fn().mockReturnThis(),
      bind: jest.fn().mockReturnThis(),
      first: jest.fn(),
    },
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return message id when found', async () => {
    const expectedId = 1;
    mockEnv.DB.first.mockResolvedValueOnce({ id: expectedId });

    const requestMock = {} as Request;
    const contextMock = {};
    const dataMock = {
      params: {
        bundle_id: 1,
        buyer_id: 2,
      },
    };

    const getIdByBundleBuyer = new GetIdByBundleBuyer();
    const response = await getIdByBundleBuyer.handle(requestMock, mockEnv, contextMock, dataMock);

    expect(response.status).toBe(200);
    expect(response.headers.get('Content-Type')).toBe('application/json');
    const responseBody: { result: number } = await response.json(); // Explicitly type responseBody

    expect(responseBody.result).toBe(expectedId);

    // Verify database interactions
    expect(mockEnv.DB.prepare).toHaveBeenCalledTimes(1); // Only one query should be executed
  });

  it('should return error message when not found', async () => {
    mockEnv.DB.first.mockResolvedValueOnce(null); // Simulate message not found

    const requestMock = {} as Request;
    const contextMock = {};
    const dataMock = {
      params: {
        bundle_id: 1,
        buyer_id: 2,
      },
    };

    const getIdByBundleBuyer = new GetIdByBundleBuyer();
    const response = await getIdByBundleBuyer.handle(requestMock, mockEnv, contextMock, dataMock);

    expect(response.status).toBe(404);
    expect(response.headers.get('Content-Type')).toBe('application/json');
    const responseBody: { error: string } = await response.json(); // Explicitly type responseBody

    expect(responseBody.error).toBe('Message not found');

    // Verify database interactions
    expect(mockEnv.DB.prepare).toHaveBeenCalledTimes(1); // Only one query should be executed
  });
});
