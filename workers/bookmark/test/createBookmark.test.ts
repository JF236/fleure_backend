import { CreateBookmark } from "../src/endpoints/createBookmark";


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

describe("CreateBookmark", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });


  it("should return 200 if the bookmark was added successfully", async () => {
    const request = new MockRequest("http://localhost", {
      method: "POST",
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

    const createBookmark = new CreateBookmark();
    const response = await createBookmark.handle(request as any, env, context, data);
    const result = await response.json();

    expect(response.status).toBe(200);
    expect(result).toEqual({
      success: true,
      result: "Bookmark Inserted",
    });
  });


  it("should return 500 if there is an internal server error", async () => {
    const request = new MockRequest("http://localhost", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_id: 1, bundle_id: 1 }),
    });

    const data = {
      params: {
        user_id: 1,
        bundle_id: 1,
      },
    };

    env.DB.prepare().run.mockRejectedValueOnce(new Error("Database error"));

    const createBookmark = new CreateBookmark();
    const response = await createBookmark.handle(request as any, env, context, data);
    const result = await response.json();

    expect(response.status).toBe(500);
    expect(result).toEqual({
      success: false,
      error: "Error: Error: Database error",
    });
  });


  it("should return 500 if there is a duplicate insert error", async () => {
    const request = new MockRequest("http://localhost", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_id: 1, bundle_id: 1 }),
    });

    const data = {
      params: {
        user_id: 1,
        bundle_id: 1,
      },
    };

    const duplicateError = new Error("SQLITE_CONSTRAINT: UNIQUE constraint failed: bookmarks.user_id, bookmarks.bundle_id");
    env.DB.prepare().run.mockRejectedValueOnce(duplicateError);

    const createBookmark = new CreateBookmark();
    const response = await createBookmark.handle(request as any, env, context, data);
    const result = await response.json();

    expect(response.status).toBe(500);
    expect(result).toEqual({
      success: false,
      error: `Error: ${duplicateError}`,
    });
  });
});
