import { Component, Fragment, KeyboardEventHandler, useContext, useEffect, useState } from "react";
import { RouteComponentProps, useParams, withRouter } from "react-router";
import { SpinnerFullPage } from "../spinner";
import noUserSelected from '../../assets/select_a_user.svg';
import FeatherIcon from "feather-icons-react";
import startConversation from '../../assets/startConversation.svg';
import styled from "styled-components";
import { connect, useSelector } from "react-redux";
import { selectAuthValue } from "../../store/auth";
import HttpRequestProvider from "../../helpers/request/HttpRequestProvider"
import { ChatSocketProvider } from "../../helpers/socket";
import { ChatMessageType } from "../../helpers/socket/ChatSockerProvider";
import ChatMessage from "./ChatMessage";
import { datesAreOnSameDay } from "../../helpers/dateHelper";
import { ChatContext, ChatContextValueType, UserType } from "../../contexts/ChatContext";
import { State } from "../../store/type";

const limit = 10

type StateType = {
    loadingChat: boolean
    messages: ChatMessageType[],
    recipient: UserType | null,
    input: string;
    pagination: {
        page: number | null;
        totalPages: number | null
    }
}

const mapStateToProps = (state: State) => ({
    id: state.auth.id, 
    token: state.auth.token
})

type Props = {} & RouteComponentProps & ReturnType<typeof mapStateToProps>

class ChatRoom extends Component<Props, StateType> {
    constructor(props: Props) {
        super(props)
        this.state = {
            loadingChat: false,
            messages: [],
            recipient: null,
            input: '',
            pagination: {
                page: null,
                totalPages: null
            }
        }
    }

    static contextType = ChatContext

    // useEffect(() => {
    //     if (recipientId) {
    //         const user = chatList.find((u) => u._id === recipientId)
    //         setRecipient(user)
    //     }
    // }, [recipientId, chatList])

    // useEffect(() => {
    //     if (recipientId) {
    //         getMessages(true)
    //     }
    // }, [recipientId])

    // static getDerivedStateFromProps(nextProps, prevState) {
    //     if (prevState.selectedUser === null || prevState.selectedUser._id !== nextProps.selectedUser._id) {
    //         return {
    //             selectedUser: nextProps.selectedUser,
    //             page: null,
    //             messages: []
    //         };
    //     }
    //     return null;
    // }

    componentDidUpdate(prevProps: Props) {
        const { recipientId: prevRecipientId } = prevProps.match.params as { recipientId: string }
        const { recipientId } = this.props.match.params as { recipientId: string }
        if (prevRecipientId !== recipientId) {
            this.getMessages();
        }
    }

    componentDidMount() {
        ChatSocketProvider.receiveMessage();
        ChatSocketProvider.eventEmitter.on('add-message-response', this.receiveSocketMessages);
    }

    receiveSocketMessages = (message: ChatMessageType) => {
        const { recipientId } = this.props.match.params as { recipientId: string }
        if (recipientId === message.fromUserId) {
            console.log('messages', this.state.messages)
            this.setState({ messages: [...this.state.messages, message] })
            // this.scrollMessageContainer();
            // this.notifySound.play()
        }
    }

    getMessages = async (freshPull = false) => {
        const { id, token } = this.props;
        const { recipientId } = this.props.match.params as { recipientId: string }
        const { pagination } = this.state;
        if (id && token) {
            try {
                this.setState({ loadingChat: true })
                const response: any = await HttpRequestProvider.getMessages(id, recipientId, { page: freshPull ? null: pagination.page, limit }, token);
                const result = await response.json()
                if (!result.error) {
                    this.setState({
                        messages: freshPull ? result.messages : [...result.messages, ...this.state.messages],
                        pagination: {
                            page: result.currentPage,
                            totalPages: result.totalPages
                        }
                    })
                    // this.scrollMessageContainer();
                } else {
                    alert("Unable to fetch messages")
                }
            } catch (err) {
                console.log("an error occurred!!! \n", err)
            } finally {
                this.setState({ loadingChat: false })
            }
        }
    }

    sendAndUpdateMessages = (message: ChatMessageType) => {
        try {
            ChatSocketProvider.sendMessage(message);
            this.setState({ messages: [...this.state.messages, message] })
            // scrollMessageContainer();
        } catch (error) {
            console.error("error")
            alert(`Can't send your message`);
        }
    }

    sendMessage = () => {
        const { id } = this.props;
        const { recipientId } = this.props.match.params as { recipientId: string }
        if (this.state.input === '') {
            alert("message can't be empty")
        } else if (id === '') {
            
        } else if (!recipientId || recipientId === undefined) {

        } else {
            this.sendAndUpdateMessages({
                fromUserId: id,
                text: this.state.input.trim(),
                toUserId: recipientId,
            });
            this.setState({ input: "" })
        }
    }

    renderMessages = () => {
        const { messages } = this.state
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

    handleKeyPress: KeyboardEventHandler<HTMLInputElement> = (event) => {
        if (event.key === 'Enter') {
            this.sendMessage()
        }
    }

    renderStartConversation = () => (
        <StartConversation>
            <img src={startConversation} alt="Start Conversation" />
        </StartConversation>
    )
    
    renderChatUI = () => {
        const { recipient, pagination, input } = this.state
        return (
        <ChatRoomWrapper>
            <ChatTop>
                <span>
                    <Icon icon="chevron-left" />
                </span>
                <span>{recipient?.username}</span>
            </ChatTop>
            <ChatSection>
                {pagination.page === 1 && this.renderStartConversation()}
                {this.renderMessages()}
            </ChatSection>
            <ChatBottom>
                <span>
                    <Icon icon="smile" />
                </span>
                <ChatInput
                    value={input}
                    onChange={(e) => this.setState({ input: e.target.value })}
                    onKeyPress={this.handleKeyPress} />
                <span>
                    <Icon icon="send" />
                </span>
            </ChatBottom>
        </ChatRoomWrapper>
        )
    }

    render() {
        const { recipientId } = this.props.match.params as { recipientId: string }
        if (recipientId) {
            return this.state.loadingChat ? <SpinnerFullPage /> : this.renderChatUI();
        }
    
        return (
            <NoUserSelected>
                <img src={ noUserSelected } alt="No Selected User" />
                <h4>Select A Chat</h4>
            </NoUserSelected>
        )
    }
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

export default connect(mapStateToProps)(withRouter(ChatRoom));