
/**
 * AuthProvider
 * An utility class for providing authentication.
 */
class AuthProvider {

    private _token: string | null;
    private _id: string | null;

    private USER_TOKEN_KEY: string = "user_token_key";
    private USER_ID_KEY: string = "user_id_key";
    private EMPTY_AUTH_ERROR_MSG = "empty 'id' or 'token' cannot be authenticated";

    constructor() {
        this._token = window.localStorage.getItem(this.USER_TOKEN_KEY);
        this._id = window.localStorage.getItem(this.USER_ID_KEY);
    }

    isAuthenticated() {
        return Boolean(this._token);
    }

    authenticate(id: string | null = null, token: string | null = null) {
        return new Promise((resolve, reject) => {
            if (id && token) {
                if (id.length === 0 || token.length === 0)
                    return reject(this.EMPTY_AUTH_ERROR_MSG);
                window.localStorage.setItem(this.USER_TOKEN_KEY, token)
                window.localStorage.setItem(this.USER_ID_KEY, id)
                this._token = token;
                this._id = id;
                return resolve(true);
            }
            return reject(this.EMPTY_AUTH_ERROR_MSG);
        })
    }

    unauthenticate() {
        return new Promise((resolve, reject) => {
            try {
                window.localStorage.clear();
                this._token = null;
                this._id = null;
                resolve(true);
            } catch(err) {
                reject(err);
            }
        });
    }

    get token() {
        return this._token;
    }

    get id() {
        return this._id;
    }

}

export default new AuthProvider();