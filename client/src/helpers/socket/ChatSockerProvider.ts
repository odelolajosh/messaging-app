import SocketProvider from "./SocketProvider";
const events = require('events');

export type ChatMessageType = {
    fromUserId: string | null,
    text: string,
    toUserId: string,
    date?: Date | string | number,
    isRead?: boolean
}
export type ChatListResponseType = {
    error: boolean,
    singleUser: boolean,
    chatList: object[] | object
}
export type ChatErrorType = {
    error: boolean,
    message: string,
    chatList?: any[]
}
export type ChatRequestData = {
    userId: string
}


class ChatSocketProvider {
    eventEmitter = new events.EventEmitter();

    getChatList(userId: string) {
        if (!SocketProvider.socket) {
            console.warn("No connection!")
            return this.eventEmitter.emit('chat-list-response', { error: true, message: "Cannot login" });
        }
        SocketProvider.socket.emit('chat-list', { userId }, ({ error, message }: ChatErrorType) => {
            if (error) {
                this.eventEmitter.emit('chat-list-response', { error, message });
            }
        });
        SocketProvider.socket.on('chat-list-response', (data: any) => {
            this.eventEmitter.emit('chat-list-response', data);
        })
    }

    sendMessage(message: ChatMessageType) {
        SocketProvider.socket?.emit('add-message', message)
    }

    receiveMessage() {
        SocketProvider.socket?.on('add-message-response', (data: any) => {
            this.eventEmitter.emit('add-message-response', data);
        })
    }

    typingMessage(toUserId: string) {
        SocketProvider.socket?.emit('typing-message', { toUserId }, ({ error, message }: ChatErrorType) => {
            console.warn("error", message);
        });
    }

    receiveTypingMessage() {
        SocketProvider.socket?.on('typing-message-response', (data: ChatRequestData) => {
            this.eventEmitter.emit('typing-message-response', data);
        })
    }
}

export default new ChatSocketProvider();