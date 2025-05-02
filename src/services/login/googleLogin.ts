import { Either, left, right } from "fp-ts/lib/Either";
import { GoogleOAuthRequest, GoogleUser, GoogleUserResponse } from "../../../types/google/Google";
import { handleError } from "../handler/error_handling";
import { ApiResponse } from "../../../types/ApiResponse/ApiResponse";
import "dotenv/config";
import axios from "axios";

async function GoogleOAuthService(req: GoogleOAuthRequest): Promise<Either<ApiResponse, GoogleUser>>{
    const code = await GetgoogleOAuthCode(req);
    if(code._tag === "Left") {
        return left(handleError(404, code.left));
    }
    const accessToken = await GetgoogleAccessToken(code.right);
    if(accessToken._tag === "Left"){
        return left(handleError(500, accessToken.left));
    }
    const user = await GetgoogleUser(accessToken.right);
    if(user._tag === "Left"){
        return left(handleError(500, user.left));
    }
    return right(user.right);
}

async function GetgoogleOAuthCode(req: GoogleOAuthRequest): Promise<Either<string, string>> {
    const code = req.query.code;
    if(!code) {
        return left("Code not found");
    }
    return right(code);
}

async function GetgoogleAccessToken(code: string): Promise<Either<string, string>> {
    const response = await axios.post("https://oauth2.googleapis.com/token", {
        client_id: process.env.GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        code: code,
        redirect_uri: `${process.env.BACKEND_URL}/login/oauth2/code/google`,
        grant_type: "authorization_code",
    });
    const accessToken = response.data.access_token;
    if(!accessToken || response.status !== 200) {
        return left("Error getting access token from Google");
    }
    return right(accessToken);
}

async function GetgoogleUser(access_token:string): Promise<Either<string, GoogleUser>> {
    const response = await axios.get("https://www.googleapis.com/oauth2/v1/userinfo", {
        headers: {
            Authorization: `Bearer ${access_token}`,
        },
    }) as GoogleUserResponse;
    const user = response.data;
    if(!user || response.status !== 200) {
        return left("Error getting user from Google");
    }
    return right(user);
}
export { GoogleOAuthService };