import { Either, left, right } from "fp-ts/lib/Either";
import {
  GitHubOAuthRequest,
  githubAccessTokenResponse,
  githubUser,
  githubUserResponse,
} from "../../../types/github/Github";
import { handleError } from "../handler/error_handling";
import { ApiResponse } from "../../../types/ApiResponse/ApiResponse";
import "dotenv/config";
import axios from "axios";

async function GithubOAuthService(
  req: GitHubOAuthRequest
): Promise<Either<ApiResponse, githubUser>> {
  const code = await GetgithubOAuthCode(req);
  if (code._tag === "Left") {
    return left(handleError(404, code.left));
  }
  const accessToken = await GetAccessToken(code.right);
  if (accessToken._tag === "Left") {
    return left(handleError(500, accessToken.left));
  }
  const user = await GetUser(accessToken.right);
  if (user._tag === "Left") {
    return left(handleError(500, user.left));
  };
  return right(user.right);
}

async function GetgithubOAuthCode(
  req: GitHubOAuthRequest
): Promise<Either<string, string>> {
  const code = req.url.split("?")[1].split("&")[0].split("=")[1]; 
  if (!code) {
    return left("Code not found");
  }

  return right(code);
}

async function GetAccessToken(code: string): Promise<Either<string, string>> {
  const response = (await axios.post(
    `${process.env.GITHUB_ACCESS_TOKEN_URL}`,
    {
      client_id: process.env.GITHUB_CLIENT_ID,
      client_secret: process.env.GITHUB_CLIENT_SECRET,
      code: code,
      redirect_uri: `${process.env.BACKEND_URL}/login/oauth2/code/github`,
    }
  )) as githubAccessTokenResponse;
  const accessToken = response.data.split("=")[1].split("&")[0];
  if (!accessToken || response.status !== 200) {
    return left("Error getting access token from GitHub");
  }
  return right(accessToken);
}

async function GetUser(access_token: string): Promise<Either<string, githubUser>> {
  const response = await axios.get(`${process.env.GITHUB_USER_INFO_URL}`, {
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
  }) as githubUserResponse;
  const user = response.data;
  if (!user || response.status !== 200) {
    return left("Error getting user from GitHub");
  }
  return right(response.data);
}
export { GithubOAuthService };
