import io from 'socket.io-client';

class SocketProvider {
    socket: SocketIOClient.Socket | null = null;

    SOCKET_URL = process.env.NODE_ENV === 'development' 
        ? "http://localhost:4001"
        : "https://arcane-cove-69122.herokuapp.com";

    createSocketConnection(id: string) {
        try {
            this.socket = io.connect(this.SOCKET_URL, { query: `userId=${id}` });
        } catch(error) {
            throw new Error('Something went wrong. We can\'t connect to server')
        }
        return true;
    }

    destroySocketConnection() {
        this.socket?.disconnect();
        this.socket = null;
    }
}

export default new SocketProvider();