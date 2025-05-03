import { createJwtToken } from "@src/services/login/jwt";
import { handleError } from "@src/services/handler/error_handling";
import { GoogleOAuthRequest } from "../../../types/google/Google";
import "dotenv/config";
import { GoogleOAuthService } from "@src/services/login/googleLogin";
import { GoogleUserToFrontEnd } from "@src/dto/googleUser";

async function GoogleAuthController(req: GoogleOAuthRequest) {
  const user = await GoogleOAuthService(req);

  if (user._tag === "Right") {
    const userData: GoogleUserToFrontEnd = {
      id: user.right.id,
      email: user.right.email,
      name: user.right.name,
      loginType: "google",
    };

    const token = await createJwtToken(userData);
    if (token._tag === "Left") {
      return handleError(500, token.left);
    }

    const redirect_uri = `${process.env.FRONTEND_URL}/home2`;

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

export { GoogleAuthController };
