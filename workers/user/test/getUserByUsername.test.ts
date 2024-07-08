import { GetUserByUsername } from '../src/endpoints/getUserByUsername';

describe('handleRequest', () => {


  it('returns user when found', async () => {
    const testId = 0
    const testUsername = 'testuser'
    const testEmail = 'testuser@example.com'

    const mockEnv = {
      DB: {
        prepare: jest.fn().mockReturnThis(),
        bind: jest.fn().mockReturnThis(),
        first: jest.fn().mockResolvedValueOnce({
          id: 0,
          username: 'testuser',
          email: 'testuser@example.com',
        }),
      },
    };

    const getUserById = new GetUserByUsername();
    const mockRequest = new Request('https://example.com/api/getUser/id=${testId}/', {
      method: 'GET',
    });

    const response = await getUserById.handle(mockRequest, mockEnv, {}, { params: { username: 'testuser' } });

    expect(response.status).toBe(200);
    const responseBody = await response.json();
    expect(responseBody).toEqual({
      success: true,
      result: {
        id: testId,
        username: testUsername,
        email: testEmail,
      },
    });
  });


  it('returns 404 when user not found', async () => {
    const testId = 0
    const testUsername = 'testuser'
    const testEmail = 'testuser@example.com'

    const mockEnv = {
      DB: {
        prepare: jest.fn().mockReturnThis(),
        bind: jest.fn().mockReturnThis(),
        first: jest.fn().mockReturnValue(null),
      },
    };

    const getUserById = new GetUserByUsername();
    const mockRequest = new Request('https://example.com/api/getUser/id=${testId}/', {
      method: 'GET',
    });

    const response = await getUserById.handle(mockRequest, mockEnv, {}, { params: { username: 'usernameTest' } });

    expect(response.status).toBe(404);
    const responseBody = await response.json();
    expect(responseBody).toEqual({
      success: false,
      error: 'User not found',
    });
  });


  it('returns 500 when server error', async () => {
    const testId = 0
    const testUsername = 'testuser'
    const testEmail = 'testuser@example.com'

    const mockEnv = {
      DB: {
        prepare: jest.fn().mockReturnThis(),
        bind: jest.fn().mockReturnThis(),
        first: jest.fn().mockRejectedValue(new Error('Database connection error')),
      },
    };

    const getUserById = new GetUserByUsername();
    const mockRequest = new Request('https://example.com/api/getUser/id=${testId}/', {
      method: 'GET',
    });

    const response = await getUserById.handle(mockRequest, mockEnv, {}, { params: { id: testId } });
    expect(response.status).toBe(500);
  });


});
