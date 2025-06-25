interface GitHubOAuthRequest {
    url: string;
    query: {
        code: string;
        state: string;
    }
}

interface githubAccessTokenResponse {
    status: number;
    data: string;
}

interface githubUserResponse {
    status: number;
    data: {
        login: string;
        id: number;
        email: string;
    }
} 

interface githubUser {
    login: string;
    id: number;
    email: string;
}

export {GitHubOAuthRequest, githubAccessTokenResponse, githubUserResponse, githubUser}