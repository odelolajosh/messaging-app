import { useCallback, useContext, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router";
import styled from "styled-components";
import { ChatContext } from "../../contexts/ChatContext";
import { NavContext, NavContextValueType } from "../../contexts/NavControl";
import AuthProvider from "../../helpers/AuthProvider";
import { SocketProvider } from "../../helpers/socket";
import ChatSockerProvider from "../../helpers/socket/ChatSockerProvider";
import { selectAuthValue } from "../../store/auth";
import { SpinnerFullPage } from "../spinner";
import "./chat.css";
import ChatList from "./ChatList";
import ChatRoom from "./ChatRoom";

const ChatWrapper = styled.div`
    display: flex;
    flex-flow: row;
    justify-content: center;
    overflow-x: hidden;
    position: relative;
    height: 100%;
`

type ChatOverviewType = {
    isMobileViewPort: boolean;
    toggle: boolean
}
const ChatOverview = styled.div<ChatOverviewType>`
    width: 350px;
    height: 100%;
    overflow-y: hidden;
    min-width: 330px;
    position: relative;
    transition: all ease-in-out 300ms;

    ${(props) => props.isMobileViewPort && `
        position: fixed;
        left: 0;
        top: 0;
        width: 400px;
        max-width: 100vw;
        min-width: unset;
        z-index: 100;
    `}

    ${(props) => (props.isMobileViewPort && !props.toggle) && `
        width: 0px;
        overflow-x: hidden;
        transform: translateX(-100%);
    `}
`

const ChatRoomWrapper = styled.div`
    flex: 1;
    height: 100%;
    background: ${props => props.theme.body};
`

const Chat: React.FC = () => {
    const { id, pending, error } = useSelector(selectAuthValue);
    const { addTyping } = useContext(ChatContext);
    const { setSidebarElem, isMobileViewPort, toggle, setNavToggle } = useContext<NavContextValueType>(NavContext);
    const [ state, setState ] = useState<{ pending: boolean, error: string | null }>({ 
        pending: true,
        error: null
    });
    const { recipientId } = useParams<{ recipientId?: string }>()

    const setUpChatSocket = useCallback(() => {
        ChatSockerProvider.receiveTypingMessage();
        ChatSockerProvider.eventEmitter.on('typing-message-response', addTyping);
    }, [addTyping]);

    const createSocketConnection = useCallback(() => {
        try {
            if (!id) 
                throw new Error('Something went wrong. We can\'t connect to server');
            const done = SocketProvider.createSocketConnection(id);
            if (!done)
                throw new Error('Cannot create realtime connection!');
            setState({ pending: false, error: null })
            setUpChatSocket();
        } catch (err: any) {
            setState({ pending: false, error: err.message })
        }
    }, []);

    useEffect(() => {
        if (AuthProvider.isAuthenticated()) {
            createSocketConnection();
        }
    }, []);

    useEffect(() => {
        if (!recipientId) {
            setNavToggle(true)
        } else {
            setNavToggle(false)
        }
    }, [recipientId])

    if (state.pending || pending) {
        return <SpinnerFullPage />
    }
    if (state.error || error) {
        return <div>{ state.error }</div>
    }

    return (
        <ChatWrapper>
            <ChatOverview ref={el => setSidebarElem(el)} isMobileViewPort={isMobileViewPort} toggle={toggle}>
                <ChatList />
            </ChatOverview>
            <ChatRoomWrapper>
                <ChatRoom setNavToggle={setNavToggle} />
            </ChatRoomWrapper>
        </ChatWrapper>
    )
}

export default Chat;