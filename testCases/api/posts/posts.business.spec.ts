import { test, expect } from "@playwright/test";
import { onPostsService } from "@support/services/postsService";
import { onCommonFunctions } from "@support/services/common";
import { onFileExtensionUtil } from "@support/utils/fileExtensionUtil";
import { POSTS_PATH, COMMENTS_PATH } from "globalVariables";

test.describe("Posts API - Business", () => {
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
        "GET: [/posts] response [success] when fetching all posts",
        { tag: ["@high", "@regression"] },
        async () => {
            await test.step("Call GET /posts", async () => {
                response = await onPostsService.callGetAllPosts(POSTS_PATH, headers);
            });

            await test.step("Verify status 200 and total 100 posts with required fields", async () => {
                onPostsService.verifyGetAllPostsResponse(response, expectedResults.getAll.count);
            });
        }
    );

    test(
        "GET: [/posts/{id}] response [success] when id is valid",
        { tag: ["@high", "@regression"] },
        async () => {
            await test.step(`Call GET /posts/${dataTest.targetPostId}`, async () => {
                response = await onPostsService.callGetPostById(`${POSTS_PATH}/${dataTest.targetPostId}`, headers);
            });

            await test.step("Verify response body matches expected post", async () => {
                await onCommonFunctions.compareRespMsgWithExpectedFile(
                    response.statusCode,
                    expectedCommon.httpStatus.successCode.ok,
                    response,
                    expectedResults.getPostById
                );
            });
        }
    );

    test(
        "GET: [/posts/{id}/comments] response [success] when post has comments",
        { tag: ["@high", "@regression"] },
        async () => {
            await test.step(`Call GET /posts/${dataTest.targetPostId}/comments`, async () => {
                response = await onPostsService.callGetPostComments(
                    `${POSTS_PATH}/${dataTest.targetPostId}/comments`,
                    headers
                );
            });

            await test.step("Verify status 200 and returns 5 comments for target post", async () => {
                onPostsService.verifyPostCommentsResponse(
                    response,
                    dataTest.targetPostId,
                    expectedResults.getComments.count
                );
            });
        }
    );

    test(
        "GET: [/comments?postId={id}] response [success] when filtering by postId",
        { tag: ["@high", "@regression"] },
        async () => {
            await test.step("Call GET /comments?postId=1", async () => {
                response = await onPostsService.callGetCommentsByPostId(COMMENTS_PATH, headers, {
                    postId: dataTest.targetPostId,
                });
            });

            await test.step("Verify status 200 and all comments match the given postId", async () => {
                onPostsService.verifyCommentsByPostIdResponse(response, dataTest.targetPostId);
            });
        }
    );

    test(
        "GET: [/comments?postId={id}] response [success] returns same result as /posts/{id}/comments",
        { tag: ["@high", "@regression"] },
        async () => {
            let responseNested: Record<string, any> = {};
            let responseQuery: Record<string, any> = {};

            await test.step("Call both endpoints in parallel", async () => {
                [responseNested, responseQuery] = await Promise.all([
                    onPostsService.callGetPostComments(`${POSTS_PATH}/${dataTest.targetPostId}/comments`, headers),
                    onPostsService.callGetCommentsByPostId(COMMENTS_PATH, headers, { postId: dataTest.targetPostId }),
                ]);
            });

            await test.step("Verify both responses are identical", async () => {
                onPostsService.verifyIdenticalCommentsResponses(responseNested, responseQuery);
            });
        }
    );

    test(
        "GET: [/posts?userId={id}] response [success] when filtering by userId",
        { tag: ["@high", "@regression"] },
        async () => {
            await test.step(`Call GET /posts?userId=${dataTest.userIdFilter}`, async () => {
                response = await onPostsService.callGetAllPosts(POSTS_PATH, headers, {
                    userId: dataTest.userIdFilter,
                });
            });

            await test.step("Verify status 200 and all returned posts belong to the given userId", async () => {
                onPostsService.verifyFilterByUserIdResponse(response, dataTest.userIdFilter);
            });
        }
    );

    test(
        "POST: [/posts] response [success] when created with valid data",
        { tag: ["@high", "@regression"] },
        async () => {
            await test.step("Call POST /posts with valid body", async () => {
                response = await onPostsService.callCreatePost(
                    POSTS_PATH,
                    headers,
                    {},
                    dataTest.requestBody.valid.createPost
                );
            });

            await test.step("Verify status 201 and response contains posted data with id 101", async () => {
                await onCommonFunctions.compareRespMsgWithExpectedFile(
                    response.statusCode,
                    expectedCommon.httpStatus.successCode.created,
                    response,
                    expectedResults.apiRespMsg.createPost
                );
            });
        }
    );

    test(
        "PUT: [/posts/{id}] response [success] when updating all fields",
        { tag: ["@high", "@regression"] },
        async () => {
            await test.step(`Call PUT /posts/${dataTest.targetPostId} with full body`, async () => {
                response = await onPostsService.callUpdatePost(
                    `${POSTS_PATH}/${dataTest.targetPostId}`,
                    headers,
                    {},
                    dataTest.requestBody.valid.updatePost
                );
            });

            await test.step("Verify status 200 and response reflects updated fields", async () => {
                await onCommonFunctions.compareRespMsgWithExpectedFile(
                    response.statusCode,
                    expectedCommon.httpStatus.successCode.ok,
                    response,
                    expectedResults.apiRespMsg.updatePost
                );
            });
        }
    );

    test(
        "PATCH: [/posts/{id}] response [success] when partially updating",
        { tag: ["@high", "@regression"] },
        async () => {
            await test.step(`Call PATCH /posts/${dataTest.targetPostId} with only title`, async () => {
                response = await onPostsService.callPatchPost(
                    `${POSTS_PATH}/${dataTest.targetPostId}`,
                    headers,
                    {},
                    dataTest.requestBody.valid.patchPost
                );
            });

            await test.step("Verify status 200 and updated field is changed while others remain", async () => {
                onPostsService.verifyPatchPostResponse(
                    response,
                    dataTest.targetPostId,
                    dataTest.requestBody.valid.patchPost.title
                );
            });
        }
    );

    test(
        "DELETE: [/posts/{id}] response [success] when deleting existing post",
        { tag: ["@high", "@regression"] },
        async () => {
            await test.step(`Call DELETE /posts/${dataTest.targetPostId}`, async () => {
                response = await onPostsService.callDeletePost(`${POSTS_PATH}/${dataTest.targetPostId}`, headers);
            });

            await test.step("Verify status 200 and response body is empty object", async () => {
                await onCommonFunctions.compareRespMsgWithExpectedFile(
                    response.statusCode,
                    expectedCommon.httpStatus.successCode.ok,
                    response,
                    expectedResults.apiRespMsg.deletePost
                );
            });
        }
    );
});
