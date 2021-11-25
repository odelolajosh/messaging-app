import { LoginRequest, SignupRequest } from "../../store/auth";
import { RequestProvider } from "./RequestProvider";


export type AuthRequestType = {
    id: string,
    token: string
}

class HttpRequestProvider extends RequestProvider {
    getUserRequest = ({ id, token }: AuthRequestType)  => (
        fetch(`${this.BASE_URL}/user/${id}`, { ...this.REQUEST_OPTIONS, headers: { 'Content-Type': 'application/json', 'authorization': `Bearer ${token}` }})
    );
    loginRequest = (data: LoginRequest) => (
        fetch(`${this.BASE_URL}/user/login`, { ...this.REQUEST_OPTIONS, method: 'POST', body: JSON.stringify(data)})
    );
    signupRequest = (data: SignupRequest) => (
        fetch(`${this.BASE_URL}/user/signup`, { ...this.REQUEST_OPTIONS, method: 'POST', body: JSON.stringify(data)})
    );
    checkTokenRequest = ({ id, token }: AuthRequestType) => (
        fetch(`${this.BASE_URL}/user/refresh/${id}`, { ...this.REQUEST_OPTIONS, headers: { 'Content-Type': 'application/json', 'authorization': `Bearer ${token}` } })
    );
    getMessages = (id: string, toId: string, { page, limit }: { page: number | null, limit: number }, token: string) => (
        fetch(`${this.BASE_URL}/message?page=${page}&limit=${limit}`, { ...this.REQUEST_OPTIONS, method: 'POST', body: JSON.stringify({ userId: id, toUserId: toId }), headers: { 'Content-Type': 'application/json', 'authorization': `Bearer ${token}` } })
    );
}

export default new HttpRequestProvider();