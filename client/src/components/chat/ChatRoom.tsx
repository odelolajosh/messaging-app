import { Component, Fragment, KeyboardEventHandler } from "react";
import { RouteComponentProps, withRouter } from "react-router";
import { SpinnerFullPage } from "../spinner";
import noUserSelected from '../../assets/select_a_user.svg';
import FeatherIcon from "feather-icons-react";
import startConversation from '../../assets/startConversation.svg';
import styled from "styled-components";
import { connect } from "react-redux";
import HttpRequestProvider from "../../helpers/request/HttpRequestProvider"
import { ChatSocketProvider } from "../../helpers/socket";
import { ChatMessageType } from "../../helpers/socket/ChatSockerProvider";
import ChatMessage from "./ChatMessage";
import { datesAreOnSameDay } from "../../helpers/dateHelper";
import { ChatContext, UserType } from "../../contexts/ChatContext";
import { State } from "../../store/type";
import ChatScroll from "./ChatScroll";

const limit = 15

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

type Props = {
    toggleSidebar?: () => void
} & RouteComponentProps & ReturnType<typeof mapStateToProps>

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

    scrollRef: HTMLDivElement | null = null
    static contextType = ChatContext

    componentDidUpdate(prevProps: Props) {
        const { recipientId: prevRecipientId } = prevProps.match.params as { recipientId: string }
        const { recipientId } = this.props.match.params as { recipientId: string }

        if (prevRecipientId === null || prevRecipientId !== recipientId) {
            this.getMessages();
        }
    }

    componentDidMount() {
        this.getMessages();
        ChatSocketProvider.receiveMessage();
        ChatSocketProvider.eventEmitter.on('add-message-response', this.receiveSocketMessages);
    }

    receiveSocketMessages = (message: ChatMessageType) => {
        const { recipientId } = this.props.match.params as { recipientId: string }
        if (recipientId === message.fromUserId) {
            this.setState({ messages: [...this.state.messages, message] })
            this.scrollToBottomOfPage()
            // this.notifySound.play()
        }
    }

    handleScrollTop = (height: number) => {
        const { page } = this.state.pagination
        if (!page || page === 1) return
        let newPage = Math.max(page ? page - 1: page, 1)
        this.setState({
            pagination: {
                ...this.state.pagination,
                page: newPage
            }
        })
        this.addCurrentPageMessages(height)
    }

    scrollToY = (y: number) => {
        try {
            setTimeout(() => {
                this.scrollRef?.scrollTo(0, y);
            }, 100);
          } catch (error) {
            console.warn(error);
          }
    }

    scrollToBottomOfPage = () => {
        try {
            setTimeout(() => {
                this.scrollRef?.scrollTo(0, this.scrollRef?.scrollHeight);
            }, 100);
          } catch (error) {
            console.warn(error);
          }
    }

    getMessages = async () => {
        const { id, token } = this.props;
        const { recipientId } = this.props.match.params as { recipientId: string }
        const { pagination } = this.state;
        if (id && token) {
            try {
                this.setState({ loadingChat: true })
                const response: any = await HttpRequestProvider.getMessages(id, recipientId, { page: null, limit }, token);
                const result = await response.json()
                if (!result.error) {
                    this.setState({
                        messages: result.messages,
                        pagination: {
                            page: result.currentPage,
                            totalPages: result.totalPages
                        }
                    })
                    this.scrollToBottomOfPage()
                } else {
                    alert("Unable to fetch messages")
                }
            } catch (err) {
                console.warn("an error occurred!!! \n", err)
            } finally {
                this.setState({ loadingChat: false })
            }
        }
    }

    addCurrentPageMessages = async (height: number) => {
        const { id, token } = this.props;
        const { recipientId } = this.props.match.params as { recipientId: string }
        const { pagination } = this.state;
        if (id && token) {
            try {
                const response: any = await HttpRequestProvider.getMessages(id, recipientId, { page: pagination.page, limit }, token);
                const result = await response.json()
                if (!result.error) {
                    this.setState({
                        messages: [...result.messages, ...this.state.messages],
                        pagination: {
                            page: result.currentPage,
                            totalPages: result.totalPages
                        }
                    })
                    this.scrollToY(this.scrollRef ? this.scrollRef.scrollHeight - height : 0)
                } else {
                    alert("Unable to fetch messages")
                }
            } catch (err) {
                console.warn("an error occurred!!! \n", err)
            }
        }
    }



    sendAndUpdateMessages = (message: ChatMessageType) => {
        try {
            ChatSocketProvider.sendMessage(message);
            this.setState({ messages: [...this.state.messages, message] })
            this.scrollToBottomOfPage()
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
        const { pagination, input } = this.state
        const { recipientId } = this.props.match.params as { recipientId: string }
        return (
        <ChatRoomWrapper>
            <ChatContext.Consumer>
                {({ chatList }) => {
                    let recipient = chatList.find((u) => u._id === recipientId)
                    return (
                        <ChatTop>
                            <span onClick={this.props.toggleSidebar}>
                                <Icon icon="chevron-left" />
                            </span>
                            <span>{recipient?.username}</span>
                        </ChatTop>
                    )
                }}
            </ChatContext.Consumer>
            <ChatScroll
                style={{ flex: 1 }} 
                page={this.state.pagination.page} 
                onScrollTop={this.handleScrollTop}
                onMount={ref => this.scrollRef = ref}>
                {(pagination.page !== null && pagination.page <= 1) && this.renderStartConversation()}
                {this.renderMessages()}
            </ChatScroll>
            <ChatBottom>
                <Action>
                    <Icon icon="smile" />
                </Action>
                <ChatInput
                    value={input}
                    onChange={(e) => this.setState({ input: e.target.value })}
                    onKeyPress={this.handleKeyPress} />
                <Action onClick={this.sendMessage}>
                    <Icon icon="send" />
                </Action>
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

const Action = styled.span`
    cursor: pointer;
`

export default connect(mapStateToProps)(withRouter(ChatRoom));