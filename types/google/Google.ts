interface GoogleOAuthRequest {
    url: string;
    query: {
        code: string;
    }
}

interface GoogleAccessTokenResponse {
    status: number;
    data: string;
}

interface GoogleUserResponse {
    status: number;
    data: GoogleUser;
} 

interface GoogleUser {
    id: string;
    email: string;
    name : string;
}

export {GoogleOAuthRequest, GoogleAccessTokenResponse, GoogleUserResponse, GoogleUser}