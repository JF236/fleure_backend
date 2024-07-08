import { GetIdsByBuyer } from '../src/endpoints/getIdsByBuyer';

describe('GetIdsByBuyer', () => {
  // Mock environment and database
  const mockEnv = {
    DB: {
      prepare: jest.fn().mockReturnThis(),
      bind: jest.fn().mockReturnThis(),
      all: jest.fn(),
    },
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return list of message ids when found', async () => {
    const expectedIds = [1, 2, 3];
    mockEnv.DB.all.mockResolvedValueOnce(expectedIds.map(id => ({ id })));

    const requestMock = {} as Request;
    const contextMock = {};
    const dataMock = {
      params: {
        buyer_id: 1,
      },
    };

    const getIdsByBuyer = new GetIdsByBuyer();
    const response = await getIdsByBuyer.handle(requestMock, mockEnv, contextMock, dataMock);

    expect(response.status).toBe(200);
    expect(response.headers.get('Content-Type')).toBe('application/json');
    const responseBody: { result: number[] } = await response.json(); // Explicitly type responseBody

    expect(responseBody.result).toEqual([{ id: 1 }, { id: 2 }, { id: 3 }]);

    // Verify database interactions
    expect(mockEnv.DB.prepare).toHaveBeenCalledTimes(1); // Only one query should be executed
    expect(mockEnv.DB.bind).toHaveBeenCalledWith(dataMock.params.buyer_id); // Ensure correct binding of buyer_id
    expect(mockEnv.DB.all).toHaveBeenCalledTimes(1); // Ensure all results are fetched
  });

  it('should return empty list when no messages found', async () => {
    mockEnv.DB.all.mockResolvedValueOnce([]); // Simulate no messages found

    const requestMock = {} as Request;
    const contextMock = {};
    const dataMock = {
      params: {
        buyer_id: 1,
      },
    };

    const getIdsByBuyer = new GetIdsByBuyer();
    const response = await getIdsByBuyer.handle(requestMock, mockEnv, contextMock, dataMock);

    expect(response.status).toBe(200);
    expect(response.headers.get('Content-Type')).toBe('application/json');
    const responseBody: { result: number[] } = await response.json(); // Explicitly type responseBody

    expect(responseBody.result).toEqual([]);

    // Verify database interactions
    expect(mockEnv.DB.prepare).toHaveBeenCalledTimes(1); // Only one query should be executed
    expect(mockEnv.DB.bind).toHaveBeenCalledWith(dataMock.params.buyer_id); // Ensure correct binding of buyer_id
    expect(mockEnv.DB.all).toHaveBeenCalledTimes(1); // Ensure all results are fetched
  });
});
