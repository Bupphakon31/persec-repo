import { test, expect } from "@playwright/test";
import { onPostsService } from "@support/services/postsService";
import { onFileExtensionUtil } from "@support/utils/fileExtensionUtil";
import { POSTS_PATH, COMMENTS_PATH } from "globalVariables";

test.describe("Posts API - Validation", () => {
    let response: Record<string, any> = {};
    let dataTest: Record<string, any> = {};
    let headers: Record<string, any> = {};
    let expectedCommon: Record<string, any> = {};
    let expectedResults: Record<string, any> = {};

    test.beforeAll(async () => {
        dataTest = onFileExtensionUtil.readDataFromJson("./resources/dataTest/posts.json");
        headers = onFileExtensionUtil.readDataFromJson("./resources/dataTest/common.json").headers.contentType.valid;
        expectedCommon = onFileExtensionUtil.readDataFromJson("./resources/expectedResults/common.json");
        expectedResults = onFileExtensionUtil.readDataFromJson("./resources/expectedResults/posts.json");
    });

    test(
        "GET: [/posts/{id}] response [failed] when id does not exist",
        { tag: ["@high", "@functional"] },
        async () => {
            await test.step(`Call GET /posts/${dataTest.nonExistentId}`, async () => {
                response = await onPostsService.callGetPostById(
                    `${POSTS_PATH}/${dataTest.nonExistentId}`,
                    headers
                );
            });

            await test.step("Verify status 404 and body is empty object", async () => {
                expect(response.statusCode).toBe(expectedCommon.httpStatus.failedCode.notFound);
                expect(response.body).toEqual({});
            });
        }
    );

    test(
        "GET: [/posts/{id}] response [failed] when id is boundary zero",
        { tag: ["@high", "@functional"] },
        async () => {
            await test.step(`Call GET /posts/${dataTest.boundaryIdZero}`, async () => {
                response = await onPostsService.callGetPostById(
                    `${POSTS_PATH}/${dataTest.boundaryIdZero}`,
                    headers
                );
            });

            await test.step("Verify status 404 and body is empty object", async () => {
                expect(response.statusCode).toBe(expectedCommon.httpStatus.failedCode.notFound);
                expect(response.body).toEqual({});
            });
        }
    );

    test(
        "GET: [/posts/{id}] response [failed] when id is negative",
        { tag: ["@high", "@functional"] },
        async () => {
            await test.step(`Call GET /posts/${dataTest.negativeId}`, async () => {
                response = await onPostsService.callGetPostById(
                    `${POSTS_PATH}/${dataTest.negativeId}`,
                    headers
                );
            });

            await test.step("Verify status 404 and body is empty object", async () => {
                expect(response.statusCode).toBe(expectedCommon.httpStatus.failedCode.notFound);
                expect(response.body).toEqual({});
            });
        }
    );

    test(
        "GET: [/posts/{id}/comments] response [success] when post does not exist returns empty array",
        { tag: ["@high", "@functional"] },
        async () => {
            await test.step(`Call GET /posts/${dataTest.nonExistentId}/comments`, async () => {
                response = await onPostsService.callGetPostComments(
                    `${POSTS_PATH}/${dataTest.nonExistentId}/comments`,
                    headers
                );
            });

            await test.step("Verify status 200 and response is empty array", async () => {
                expect(response.statusCode).toBe(expectedCommon.httpStatus.successCode.ok);
                expect(response.body).toEqual([]);
            });
        }
    );

    test(
        "GET: [/posts/{id}/comments] response [success] when all comments belong to that post",
        { tag: ["@high", "@functional"] },
        async () => {
            await test.step(`Call GET /posts/${dataTest.targetPostId}/comments`, async () => {
                response = await onPostsService.callGetPostComments(
                    `${POSTS_PATH}/${dataTest.targetPostId}/comments`,
                    headers
                );
            });

            await test.step("Verify all returned comments have postId matching the requested post", async () => {
                expect(response.statusCode).toBe(expectedCommon.httpStatus.successCode.ok);
                expect(response.body.length).toBeGreaterThan(0);
                for (const comment of response.body) {
                    expect(comment.postId).toBe(dataTest.targetPostId);
                }
            });
        }
    );

    test(
        "GET: [/comments?postId={id}] response [success] when postId has no results returns empty array",
        { tag: ["@high", "@functional"] },
        async () => {
            await test.step(`Call GET /comments?postId=${dataTest.nonExistentId}`, async () => {
                response = await onPostsService.callGetCommentsByPostId(COMMENTS_PATH, headers, {
                    postId: dataTest.nonExistentId,
                });
            });

            await test.step("Verify status 200 and response is empty array", async () => {
                expect(response.statusCode).toBe(expectedCommon.httpStatus.successCode.ok);
                expect(response.body).toEqual([]);
            });
        }
    );

    test(
        "PUT: [/posts/{id}] response [failed] when id does not exist",
        { tag: ["@high", "@functional"] },
        async () => {
            await test.step(`Call PUT /posts/${dataTest.nonExistentId}`, async () => {
                response = await onPostsService.callUpdatePost(
                    `${POSTS_PATH}/${dataTest.nonExistentId}`,
                    headers,
                    {},
                    dataTest.requestBody.valid.updatePost
                );
            });

            await test.step("Verify status 404 and body is empty object", async () => {
                expect(response.statusCode).toBe(expectedCommon.httpStatus.failedCode.notFound);
                expect(response.body).toEqual({});
            });
        }
    );

    test(
        "PATCH: [/posts/{id}] response [success] when id does not exist — fake API accepts",
        { tag: ["@high", "@functional"] },
        async () => {
            await test.step(`Call PATCH /posts/${dataTest.nonExistentId}`, async () => {
                response = await onPostsService.callPatchPost(
                    `${POSTS_PATH}/${dataTest.nonExistentId}`,
                    headers,
                    {},
                    dataTest.requestBody.valid.patchPost
                );
            });

            await test.step("Verify status 200 and body reflects patched fields", async () => {
                expect(response.statusCode).toBe(expectedCommon.httpStatus.successCode.ok);
                expect(response.body).toEqual(dataTest.requestBody.valid.patchPost);
            });
        }
    );

    test(
        "DELETE: [/posts/{id}] response [success] when id does not exist — fake API accepts",
        { tag: ["@high", "@functional"] },
        async () => {
            await test.step(`Call DELETE /posts/${dataTest.nonExistentId}`, async () => {
                response = await onPostsService.callDeletePost(
                    `${POSTS_PATH}/${dataTest.nonExistentId}`,
                    headers
                );
            });

            await test.step("Verify status 200 and body is empty object", async () => {
                expect(response.statusCode).toBe(expectedCommon.httpStatus.successCode.ok);
                expect(response.body).toEqual({});
            });
        }
    );

    test(
        "POST: [/posts] response [success] when body is empty — fake API assigns id only",
        { tag: ["@high", "@functional"] },
        async () => {
            await test.step("Call POST /posts with empty body", async () => {
                response = await onPostsService.callCreatePost(
                    POSTS_PATH,
                    headers,
                    {},
                    dataTest.requestBody.invalid.emptyBody
                );
            });

            await test.step("Verify status 201 and response contains only id", async () => {
                expect(response.statusCode).toBe(expectedCommon.httpStatus.successCode.created);
                expect(response.body.id).toBe(expectedResults.apiRespMsg.createEmptyPost.id);
            });
        }
    );

});
