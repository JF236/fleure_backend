import { DeleteBookmark } from "../src/endpoints/deleteBookmark";


const env = {
  DB: {
    prepare: jest.fn().mockReturnValue({
      bind: jest.fn().mockReturnThis(),
      run: jest.fn(),
    }),
  },
};

const context = {};

class MockRequest {
  url: string;
  method: string;
  headers: Headers;
  body: any;

  constructor(url: string, init: RequestInit) {
    this.url = url;
    this.method = init.method || 'GET';
    this.headers = new Headers(init.headers);
    this.body = init.body;
  }

  async json() {
    return JSON.parse(this.body);
  }
}

describe("DeleteBookmark", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return 200 if the bookmark was deleted successfully", async () => {
    const request = new MockRequest("http://localhost", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_id: 1, bundle_id: 1 }),
    });

    const data = {
      params: {
        user_id: 1,
        bundle_id: 1,
      },
    };

    env.DB.prepare().run.mockResolvedValueOnce({});

    const deleteBookmark = new DeleteBookmark();
    const response = await deleteBookmark.handle(request as any, env, context, data);
    const result = await response.json();

    expect(response.status).toBe(200);
    expect(result).toEqual({
      success: true,
      result: "Bookmark does not exist",
    });
  });
});
