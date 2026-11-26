import dotenv from "dotenv";
dotenv.config({ path: "./configs/.env", quiet: true });

export const ENV = process.env;
export const JSONPLACEHOLDER_BASE_URL = String(ENV.JSONPLACEHOLDER_BASE_URL);
export const POSTS_PATH = String(ENV.POSTS_PATH);
export const COMMENTS_PATH = String(ENV.COMMENTS_PATH);
