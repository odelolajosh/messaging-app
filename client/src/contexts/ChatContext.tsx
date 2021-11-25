import React, { Component, useState } from "react";

export type TypingType = { [Key: string]: number | undefined };
export type UserType = {
    _id: string,
    online: 'Y' | 'N',
    imageUrl: string | null,
    username: string
}
export type ChatListType = UserType[];
export type ChatContextValueType = {
    typing: TypingType,
    addTyping?: (id: string) => void,
    // Chat List
    chatList: UserType[],
    addAChatToList: (user: UserType) => void,
    addChatsToList: (users: UserType[]) => void, 
    disconnectChat: (userId: string) => void,
}

export const defaultValue: ChatContextValueType = {
    typing: {},
    chatList: [],
    addAChatToList: () => {},
    addChatsToList: () => {},
    disconnectChat: () => {}
}
export const ChatContext: React.Context<ChatContextValueType> = React.createContext(defaultValue);
type StateTypes = {
    typing: TypingType,
    chatList: UserType[]
}
export class ChatContextProvider extends Component<{}, StateTypes> {

    constructor(props: {}) {
        super(props);
        this.state = {
            typing: {},
            chatList: []
        }
    }

    addTyping = (id: string) => {
        if (!id) return;
        const newTyping: TypingType = {...this.state.typing};
        newTyping[id] = window.setTimeout(() => this.typingTimeout(id), 3000);
        this.setState({ typing: newTyping });
    }

    typingTimeout = (id: string) => {
        const { typing } = this.state
        if (typing[id]) {
            window.clearTimeout(typing[id])
            const newTyping: TypingType = {...typing};
            delete newTyping[id];
            this.setState({ typing: newTyping });
        }
    }

    addAChatToList = (user: UserType) => {
        let newChatList = [...this.state.chatList];
        if (user) {
            if (newChatList.length > 0) {
                newChatList = newChatList.filter((u) => u._id !== user._id);
            }
            /* Adding new online user into chat list array */
            newChatList = [...[ user ], ...newChatList];
            this.setState({ chatList: newChatList }) 
        }
    }

    disconnectChat = (userId: string) => {
        let newChatList = [...this.state.chatList];
        const loggedOutUser = newChatList.findIndex((obj) => obj._id === userId);
        if (loggedOutUser >= 0) {
            newChatList[loggedOutUser].online = 'N';
        }
        this.setState({ chatList: newChatList }) 
    }

    addChatsToList = (users: UserType[]) => {
        this.setState({ chatList: users }) 
    }

    render() {
        const { typing, chatList } = this.state
        const value = { 
            ...defaultValue, 
            typing,
            addTyping: this.addTyping,
            chatList, 
            addChatsToList: this.addChatsToList, 
            addAChatToList: this.addAChatToList, 
            disconnectChat: this.disconnectChat
        }
        return (
            <ChatContext.Provider value={value}>
                {this.props.children}
            </ChatContext.Provider>
        )
    }
}
