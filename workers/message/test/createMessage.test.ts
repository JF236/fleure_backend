import { CreateMessage } from '../src/endpoints/createMessage';

describe('CreateMessage', () => {
  // Mock environment and database
  const mockEnv = {
    DB: {
      prepare: jest.fn().mockReturnThis(),
      bind: jest.fn().mockReturnThis(),
      first: jest.fn(),
      run: jest.fn(),
    },
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should handle successful message creation', async () => {
    // Mock database query results
    mockEnv.DB.first.mockResolvedValueOnce(null); // Simulate message not existing initially
    mockEnv.DB.first.mockResolvedValueOnce({ id: 1 }); // Simulate message inserted successfully

    const requestMock = {} as Request;
    const contextMock = {};
    const dataMock = {
      params: {
        bundle_id: 1,
        buyer_id: 2,
      },
    };

    const createMessage = new CreateMessage();
    const response = await createMessage.handle(requestMock, mockEnv, contextMock, dataMock);

    expect(response.status).toBe(200);
    expect(response.headers.get('Content-Type')).toBe('application/json');
    const responseBody: { success: boolean, result: number } = await response.json();
    expect(responseBody.success).toBe(true);
    expect(responseBody.result).toBe(1);

    // Verify database interactions
    expect(mockEnv.DB.prepare).toHaveBeenCalledTimes(3); // Three queries expected: check, insert, select after insert
    expect(mockEnv.DB.run).toHaveBeenCalledTimes(1); // Insert should be called once
  });

  it('should handle message already existing', async () => {
    // Mock database query results
    mockEnv.DB.first.mockResolvedValueOnce({ id: 1 }); // Simulate message already exists

    const requestMock = {} as Request;
    const contextMock = {};
    const dataMock = {
      params: {
        bundle_id: 1,
        buyer_id: 2,
      },
    };

    const createMessage = new CreateMessage();
    const response = await createMessage.handle(requestMock, mockEnv, contextMock, dataMock);

    expect(response.status).toBe(404);
    expect(response.headers.get('Content-Type')).toBe('application/json');
    const responseBody: { success: boolean, error: String } = await response.json();
    expect(responseBody.success).toBe(false);
    expect(responseBody.error).toBe('Message between bundle-buyer exists');

    // Verify database interactions
    expect(mockEnv.DB.prepare).toHaveBeenCalledTimes(1); // Only the check query should be executed
  });
});
