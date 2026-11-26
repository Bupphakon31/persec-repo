import { expect } from "@playwright/test";
import { onHTTPRequest } from "@plugins/httpRequest";
import { JSONPLACEHOLDER_BASE_URL } from "globalVariables";

class PostsService {
    // GET /posts
    public async callGetAllPosts(
        path: string,
        headers: Record<string, any> = {},
        params: Record<string, any> = {},
        isCheckMethod = false
    ) {
        const options: Record<string, any> = { params, headers };
        const contextHTTP = await onHTTPRequest.createContextHTTPRequest({ baseURL: JSONPLACEHOLDER_BASE_URL });
        try {
            let response: Record<string, any> = isCheckMethod
                ? await contextHTTP.post(path, options)
                : await contextHTTP.get(path, options);
            response = { statusCode: response.status(), statusText: response.statusText(), body: await response.json() };
            return response;
        } finally {
            await contextHTTP.dispose();
        }
    }

    public verifyGetAllPostsResponse(response: Record<string, any>, expectedCount: number) {
        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveLength(expectedCount);
        for (const post of response.body) {
            expect(post.id).toEqual(expect.any(Number));
            expect(post.userId).toEqual(expect.any(Number));
            expect(post.title).toEqual(expect.any(String));
            expect(post.body).toEqual(expect.any(String));
        }
    }

    // GET /posts/:id
    public async callGetPostById(
        path: string,
        headers: Record<string, any> = {},
        params: Record<string, any> = {},
        isCheckMethod = false
    ) {
        const options: Record<string, any> = { params, headers };
        const contextHTTP = await onHTTPRequest.createContextHTTPRequest({ baseURL: JSONPLACEHOLDER_BASE_URL });
        try {
            let response: Record<string, any> = isCheckMethod
                ? await contextHTTP.post(path, options)
                : await contextHTTP.get(path, options);
            response = { statusCode: response.status(), statusText: response.statusText(), body: await response.json() };
            return response;
        } finally {
            await contextHTTP.dispose();
        }
    }

    // GET /posts/:id/comments
    public async callGetPostComments(
        path: string,
        headers: Record<string, any> = {},
        params: Record<string, any> = {},
        isCheckMethod = false
    ) {
        const options: Record<string, any> = { params, headers };
        const contextHTTP = await onHTTPRequest.createContextHTTPRequest({ baseURL: JSONPLACEHOLDER_BASE_URL });
        try {
            let response: Record<string, any> = isCheckMethod
                ? await contextHTTP.post(path, options)
                : await contextHTTP.get(path, options);
            response = { statusCode: response.status(), statusText: response.statusText(), body: await response.json() };
            return response;
        } finally {
            await contextHTTP.dispose();
        }
    }

    public verifyPostCommentsResponse(response: Record<string, any>, expectedPostId: number, expectedCount: number) {
        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveLength(expectedCount);
        for (const comment of response.body) {
            expect(comment.id).toEqual(expect.any(Number));
            expect(comment.postId).toBe(expectedPostId);
            expect(comment.name).toEqual(expect.any(String));
            expect(comment.email).toEqual(expect.any(String));
            expect(comment.body).toEqual(expect.any(String));
        }
    }

    // GET /comments?postId=
    public async callGetCommentsByPostId(
        path: string,
        headers: Record<string, any> = {},
        params: Record<string, any> = {},
        isCheckMethod = false
    ) {
        const options: Record<string, any> = { params, headers };
        const contextHTTP = await onHTTPRequest.createContextHTTPRequest({ baseURL: JSONPLACEHOLDER_BASE_URL });
        try {
            let response: Record<string, any> = isCheckMethod
                ? await contextHTTP.post(path, options)
                : await contextHTTP.get(path, options);
            response = { statusCode: response.status(), statusText: response.statusText(), body: await response.json() };
            return response;
        } finally {
            await contextHTTP.dispose();
        }
    }

    public verifyCommentsByPostIdResponse(response: Record<string, any>, expectedPostId: number) {
        expect(response.statusCode).toBe(200);
        expect(response.body).toBeInstanceOf(Array);
        expect(response.body.length).toBeGreaterThan(0);
        for (const comment of response.body) {
            expect(comment.postId).toBe(expectedPostId);
        }
    }

    public verifyFilterByUserIdResponse(response: Record<string, any>, expectedUserId: number) {
        expect(response.statusCode).toBe(200);
        expect(response.body).toBeInstanceOf(Array);
        expect(response.body.length).toBeGreaterThan(0);
        for (const post of response.body) {
            expect(post.userId).toBe(expectedUserId);
        }
    }

    public verifyIdenticalCommentsResponses(res1: Record<string, any>, res2: Record<string, any>) {
        expect(res1.statusCode).toBe(res2.statusCode);
        expect(res1.body).toEqual(res2.body);
    }

    // POST /posts
    public async callCreatePost(
        path: string,
        headers: Record<string, any> = {},
        params: Record<string, any> = {},
        body: Record<string, any> = {},
        isCheckMethod = false
    ) {
        const options: Record<string, any> = { params, headers, data: body };
        const contextHTTP = await onHTTPRequest.createContextHTTPRequest({ baseURL: JSONPLACEHOLDER_BASE_URL });
        try {
            let response: Record<string, any> = isCheckMethod
                ? await contextHTTP.get(path, { params, headers })
                : await contextHTTP.post(path, options);
            response = { statusCode: response.status(), statusText: response.statusText(), body: await response.json() };
            return response;
        } finally {
            await contextHTTP.dispose();
        }
    }

    // PUT /posts/:id
    public async callUpdatePost(
        path: string,
        headers: Record<string, any> = {},
        params: Record<string, any> = {},
        body: Record<string, any> = {},
        isCheckMethod = false
    ) {
        const options: Record<string, any> = { params, headers, data: body };
        const contextHTTP = await onHTTPRequest.createContextHTTPRequest({ baseURL: JSONPLACEHOLDER_BASE_URL });
        try {
            let response: Record<string, any> = isCheckMethod
                ? await contextHTTP.get(path, { params, headers })
                : await contextHTTP.put(path, options);
            response = { statusCode: response.status(), statusText: response.statusText(), body: await response.json() };
            return response;
        } finally {
            await contextHTTP.dispose();
        }
    }

    // PATCH /posts/:id
    public async callPatchPost(
        path: string,
        headers: Record<string, any> = {},
        params: Record<string, any> = {},
        body: Record<string, any> = {},
        isCheckMethod = false
    ) {
        const options: Record<string, any> = { params, headers, data: body };
        const contextHTTP = await onHTTPRequest.createContextHTTPRequest({ baseURL: JSONPLACEHOLDER_BASE_URL });
        try {
            let response: Record<string, any> = isCheckMethod
                ? await contextHTTP.get(path, { params, headers })
                : await contextHTTP.patch(path, options);
            response = { statusCode: response.status(), statusText: response.statusText(), body: await response.json() };
            return response;
        } finally {
            await contextHTTP.dispose();
        }
    }

    public verifyPatchPostResponse(response: Record<string, any>, expectedId: number, expectedTitle: string) {
        expect(response.statusCode).toBe(200);
        expect(response.body.id).toBe(expectedId);
        expect(response.body.title).toBe(expectedTitle);
        expect(response.body.userId).toEqual(expect.any(Number));
        expect(response.body.body).toEqual(expect.any(String));
    }

    // DELETE /posts/:id
    public async callDeletePost(
        path: string,
        headers: Record<string, any> = {},
        params: Record<string, any> = {},
        isCheckMethod = false
    ) {
        const options: Record<string, any> = { params, headers };
        const contextHTTP = await onHTTPRequest.createContextHTTPRequest({ baseURL: JSONPLACEHOLDER_BASE_URL });
        try {
            let response: Record<string, any> = isCheckMethod
                ? await contextHTTP.post(path, options)
                : await contextHTTP.delete(path, options);
            response = { statusCode: response.status(), statusText: response.statusText(), body: await response.json() };
            return response;
        } finally {
            await contextHTTP.dispose();
        }
    }
}

export const onPostsService: PostsService = new PostsService();
