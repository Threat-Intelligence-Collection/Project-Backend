import { GitHubUserToFrontEnd } from "@src/dto/githubUser";
import { GoogleUserToFrontEnd } from "@src/dto/googleUser";
import jwt from "jsonwebtoken";
import { Either, left, right } from "fp-ts/lib/Either";
import { Cookie } from "elysia";
import { Context } from "elysia";

async function createJwtToken(userData: GitHubUserToFrontEnd | GoogleUserToFrontEnd): Promise<Either<string, string>> {
    const token = jwt.sign(userData, process.env.JWT_SECRET as string, {
        expiresIn: "1h",
    });
    if (!token) {
        return left("Error creating JWT token");
    }
    return right(token);
}

function setCookie(cookie: Context["cookie"], token: string, maxAge: number = 86400000): void {
    cookie.auth_token = new Cookie(token, {
        options: {
            httpOnly: true,
            sameSite: "strict",
            maxAge,
            path: "/"
        },
    });
}


export { createJwtToken, setCookie };