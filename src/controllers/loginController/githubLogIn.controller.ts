import { GithubOAuthService } from "@src/services/login/githubLogin";
import { GitHubOAuthRequest } from "../../../types/github/Github";
import { GitHubUserToFrontEnd } from "@src/dto/githubUser";
import { createJwtToken } from "@src/services/login/jwt";
import { handleError } from "@src/services/handler/error_handling";
import "dotenv/config";

async function GithubOAuthController(req: GitHubOAuthRequest) {
  const user = await GithubOAuthService(req);

  if (user._tag === "Right") {
    const userData: GitHubUserToFrontEnd = {
      login: user.right.login,
      id: user.right.id,
      email: user.right.email,
      loginType: "github",
    };

    const token = await createJwtToken(userData);
    if (token._tag === "Left") {
      return handleError(500, token.left);
    }

    const redirect_uri = `${process.env.FRONTEND_URL}/home`;

    return new Response(null, {
      status: 302,
      headers: {
        Location: redirect_uri,
        "Set-Cookie": `auth_token=${
          token.right
        }; Secure; SameSite=Strict; HttpOnly=false; Max-Age=${
          60 * 30
        }; Path=/; Domain=localhost`,
      },
    });
  } else {
    return {
      status: 500,
      body: {
        message: user.left,
      },
    };
  }
}

export { GithubOAuthController };
