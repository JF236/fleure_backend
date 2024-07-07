import { CreateBundleTag } from "../src/endpoints/createBundleTag";


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

describe("CreateBundleTag", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });


  it("should return 200 if the bookmark was added successfully", async () => {
    const request = new MockRequest("http://localhost", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ bundle_id: 1, tag_id: 1 }),
    });

    const data = {
      params: {
        bundle_id: 1,
        tag_id: 1,
      },
    };

    env.DB.prepare().run.mockResolvedValueOnce({});

    const createBundleTag = new CreateBundleTag();
    const response = await createBundleTag.handle(request as any, env, context, data);
    const result = await response.json();

    expect(response.status).toBe(200);
    expect(result).toEqual({
      success: true,
      result: "Bundle-Tag Inserted",
    });
  });


  it("should return 500 if there is an internal server error", async () => {
    const request = new MockRequest("http://localhost", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ bundle_id: 1, tag_id: 1 }),
    });

    const data = {
      params: {
        bundle_id: 1,
        tag_id: 1,
      },
    };

    env.DB.prepare().run.mockRejectedValueOnce(new Error("Database error"));

    const createBundleTag = new CreateBundleTag();
    const response = await createBundleTag.handle(request as any, env, context, data);
    const result = await response.json();

    expect(response.status).toBe(500);
    expect(result).toEqual({
      success: false,
      error: "Error: Error: Database error",
    });
  });
});
