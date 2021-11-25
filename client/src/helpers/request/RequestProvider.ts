

export class RequestProvider {

    BASE_URL = process.env.NODE_ENV === 'development' 
        ? "http://localhost:4001/mychatapp/v1/api"
        : "https://my-chat-app-server-0707.herokuapp.com/mychatapp/v1/api";
        
    REQUEST_OPTIONS: RequestInit = {
        method: 'GET',
        mode: 'cors',
        headers: {
            'Content-Type': 'application/json'
        }
    }
}

export default RequestProvider;