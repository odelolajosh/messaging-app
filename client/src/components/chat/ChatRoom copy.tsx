import { Fragment, KeyboardEventHandler, useContext, useEffect, useState } from "react";
import { useParams } from "react-router";
import { SpinnerFullPage } from "../spinner";
import noUserSelected from '../../assets/select_a_user.svg';
import FeatherIcon from "feather-icons-react";
import startConversation from '../../assets/startConversation.svg';
import styled from "styled-components";
import { useSelector } from "react-redux";
import { selectAuthValue } from "../../store/auth";
import HttpRequestProvider from "../../helpers/request/HttpRequestProvider"
import { ChatSocketProvider } from "../../helpers/socket";
import { ChatMessageType } from "../../helpers/socket/ChatSockerProvider";
import ChatMessage from "./ChatMessage";
import { datesAreOnSameDay } from "../../helpers/dateHelper";
import { ChatContext, ChatContextValueType, UserType } from "../../contexts/ChatContext";

const limit = 10
const ChatRoom: React.FC = () => {
    const [loadingChat, setLoadingChat] = useState<boolean>();
    const [messages, setMessages] = useState<ChatMessageType[]>([]);
    const [recipient, setRecipient] = useState<UserType>();
    const [input, setInput] = useState("");
    const [pagination, setPagination] = useState<{
        page: number | null
        totalPages: number | null
    }>({
        page: null,
        totalPages: null
    });

    const { token, id } = useSelector(selectAuthValue)
    const { recipientId } = useParams<{ recipientId: string }>()
    const { chatList } = useContext<ChatContextValueType>(ChatContext)

    useEffect(() => {
        if (recipientId) {
            const user = chatList.find((u) => u._id === recipientId)
            setRecipient(user)
        }
    }, [recipientId, chatList])

    useEffect(() => {
        if (recipientId) {
            getMessages(true)
        }
    }, [recipientId])

    useEffect(() => {
        ChatSocketProvider.receiveMessage();
        ChatSocketProvider.eventEmitter.on('add-message-response', receiveSocketMessages);
    }, [])

    const receiveSocketMessages = (message: ChatMessageType) => {
        if (recipientId === message.fromUserId) {
            console.log('messages', messages)
            setMessages([...messages, message])
            // this.scrollMessageContainer();
            // this.notifySound.play()
        }
    }

    const getMessages = async (freshPull = false) => {
        if (id && token) {
            try {
                setLoadingChat(true)
                const response: any = await HttpRequestProvider.getMessages(id, recipientId, { page: freshPull ? null: pagination.page, limit }, token);
                const result = await response.json()
                if (!result.error) {
                    setMessages(freshPull ? result.messages : [...result.messages, ...messages])
                    setPagination({
                        page: result.currentPage,
                        totalPages: result.totalPages
                    });
                    // this.scrollMessageContainer();
                } else {
                    alert("Unable to fetch messages")
                }
            } catch (err) {
                console.log("an error occurred!!! \n", err)
            } finally {
                setLoadingChat(false)
            }
        }
    }

    const sendAndUpdateMessages = (message: ChatMessageType) => {
        try {
            ChatSocketProvider.sendMessage(message);
            setMessages([...messages, message])
            // scrollMessageContainer();
        } catch (error) {
            console.error("error")
            alert(`Can't send your message`);
        }
    }

    const sendMessage = () => {
        if (input === '') {
            alert("message can't be empty")
        } else if (id === '') {
            
        } else if (!recipientId || recipientId === undefined) {

        } else {
            sendAndUpdateMessages({
                fromUserId: id,
                text: (input).trim(),
                toUserId: recipientId,
            });
            setInput("")
        }
    }

    const renderMessages = () => {
        if (messages.length === 0) return [];
        let dayInConcern = new Date(messages[0].date as string);
        const messageUI = messages.map((message, index) => {
            const day = new Date(message.date as string);
            const isNewDay = !datesAreOnSameDay(day, dayInConcern) && (day.getTime() > dayInConcern.getTime());
            if (isNewDay) dayInConcern = day;
            return (
                <Fragment key={`chat-msg-${index}`}>
                    { 
                        isNewDay && (
                            <DateDistribution>
                                <span>{ dayInConcern.toDateString() }</span>
                            </DateDistribution>
                        )
                    }
                    <div style={{ marginInline: '1rem' }}>
                        <ChatMessage key={`chat-bx-${index}`} message={message} />
                    </div>
                </Fragment>
            )
        })
        return messageUI;
    }

    const handleKeyPress: KeyboardEventHandler<HTMLInputElement> = (event) => {
        if (event.key === 'Enter') {
            sendMessage()
        }
    }

    const renderStartConversation = () => (
        <StartConversation>
            <img src={startConversation} alt="Start Conversation" />
        </StartConversation>
    )
    
    const renderChatUI = () => {
        return (
        <ChatRoomWrapper>
            <ChatTop>
                <span>
                    <Icon icon="chevron-left" />
                </span>
                <span>{recipient?.username}</span>
            </ChatTop>
            <ChatSection>
                {pagination.page === 1 && renderStartConversation()}
                {renderMessages()}
            </ChatSection>
            <ChatBottom>
                <span>
                    <Icon icon="smile" />
                </span>
                <ChatInput
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={handleKeyPress} />
                <span>
                    <Icon icon="send" />
                </span>
            </ChatBottom>
        </ChatRoomWrapper>
        )
    }
    
    if (recipientId) {
        return loadingChat ? <SpinnerFullPage /> : renderChatUI();
    }

    return (
        <NoUserSelected>
            <img src={ noUserSelected } alt="No Selected User" />
            <h4>Select A Chat</h4>
        </NoUserSelected>
    )
}

const ChatRoomWrapper = styled.section`
    width: 100%;
    height: 100%;
    display: flex;
    flex-flow: column nowrap;
`

const ChatSection = styled.div`
    flex: 1;
    padding-block: 1rem;
    overflow-y: scroll;
`

const ChatTop = styled.div`
    height: 60px;
    background: ${props => props.theme.card};
    display: flex;
    flex-shrink: 0;
    border-bottom: 2px solid ${props => props.theme.input};

    & > span {
        width: 60px;
        display: grid;
        place-items: center;
    }
`

const ChatBottom = styled.div`
    height: 60px;
    background: ${props => props.theme.card};
    display: flex;
    flex-shrink: 0;
    border-top: 2px solid ${props => props.theme.input};

    & > span {
        width: 60px;
        display: grid;
        place-items: center;
    }
`

const ChatInput = styled.input.attrs({
    placeholder: 'Send a message'
})`
    flex: 1;
    background: transparent;
    outline: none;
    border: none;
    font-size: 16px;
    color: ${props => props.theme.text}
`

const Icon = styled(FeatherIcon)`
    stroke: ${props => props.theme.icon};
`

const DateDistribution = styled.div`
    background: ${props => props.theme.input}44;
    margin-top: 0.3rem;
    margin-bottom: 1.6rem;
    padding: .45rem .8rem;
    font-size: 14px;
    color: ${props => props.theme.text}44;
`

const StartConversation = styled.div`
    display: flex;
    justify-content: center;
    margin-bottom: 110px;
    margin-top: 30vh;

    & > img {
        width: 400px;
        max-width: calc(100% - 3rem);
        max-height: 400px;
    }
`

const NoUserSelected = styled.div`
    display: flex;
    flex-flow: column nowrap;
    align-items: center;
    justify-content: center;
    height: 100%;

    & > img {
        width: 300px;
        max-width: calc(100% - 1rem);
    }

    & > h4 {
        font-size: 24.12px;
    }
`

export default ChatRoom;