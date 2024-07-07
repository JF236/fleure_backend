import { DeleteBundleTag } from "../src/endpoints/deleteBundleTag";


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

describe("DeleteBundleTag", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return 200 if the bundle-tag was deleted successfully", async () => {
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

    const deleteBundleTag = new DeleteBundleTag();
    const response = await deleteBundleTag.handle(request as any, env, context, data);
    const result = await response.json();

    expect(response.status).toBe(200);
    expect(result).toEqual({
      success: true,
      result: "Bundle-tag does not exist",
    });
  });
});
