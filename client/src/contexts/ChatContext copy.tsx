import React, { useState } from "react";

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
export const ChatContextProvider: React.FC = (props) => {
    const [typing, setTyping] = useState<TypingType>({});
    const [chatList, setChatList] = useState<UserType[]>([]);

    const addTyping = (id: string) => {
        if (!id) return;
        const newTyping = {...typing};
        newTyping[id] = window.setTimeout(() => typingTimeout(id), 3000);
        setTyping(newTyping);
    }

    const typingTimeout = (id: string) => {
        if (typing[id]) {
            window.clearTimeout(typing[id])
            const newTyping = {...typing};
            delete newTyping[id];
            setTyping(newTyping);
        }
    }

    const addAChatToList = (user: UserType) => {
        let newChatList = [...chatList];
        if (user) {
            if (newChatList.length > 0) {
                newChatList = newChatList.filter((u) => u._id !== user._id);
            }
            /* Adding new online user into chat list array */
            newChatList = [...[ user ], ...newChatList];
            setChatList(newChatList);   
        }
    }

    const disconnectChat = (userId: string) => {
        let newChatList = [...chatList];
        const loggedOutUser = newChatList.findIndex((obj) => obj._id === userId);
        if (loggedOutUser >= 0) {
            newChatList[loggedOutUser].online = 'N';
        }
        setChatList(newChatList)
    }

    const addChatsToList = (users: UserType[]) => {
        setChatList(users);
    }

    return (
        <ChatContext.Provider value={{ ...defaultValue, typing, addTyping, chatList, addChatsToList, addAChatToList, disconnectChat }}>
            { props.children }
        </ChatContext.Provider>
    )
}
