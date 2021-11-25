import io from 'socket.io-client';

class SocketProvider {
    socket: SocketIOClient.Socket | null = null;

    createSocketConnection(id: string) {
        const url = 'http://localhost:4001'
        // const url = 'https://my-chat-app-server-0707.herokuapp.com'
        try {
            this.socket = io.connect(url, { query: `userId=${id}` });
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