import React, { useCallback, useContext, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import styled from "styled-components";
import FeatherIcon from "feather-icons-react";
import { ChatContext, UserType } from "../../contexts/ChatContext";
import withTheme, { ThemeComponentType } from "../../helpers/session/withTheme";
import { ChatSocketProvider } from "../../helpers/socket";
import { selectAuthValue } from "../../store/auth";
import { Header, Input, Text } from "../../style/element";
import { useHistory, useLocation, useParams } from "react-router";
import { ThemeContext } from "../../contexts/Theme";
import { NavContext, NavContextValueType } from "../../contexts/NavControl";

const ChatListWrapper = styled.section`
    height: 100%;
    overflow-y: auto;
    position: relative;
    background: ${props => props.theme.body};
    border-right: 2px solid ${props => props.theme.input};
    padding-bottom: 3rem;

    ::-webkit-scrollbar {
        width: 4px;
        background: transparent;
    }
      
    ::-webkit-scrollbar-thumb {
        background: ${props => props.theme.icon}33;
        border-radius: 50px;
    }
`

const SearchInput = styled.div`
    position: relative;
    height: 30px;
    flex: 1;
`

const TopSection = styled.div`
    margin: .5rem;
    padding: .3rem .5rem;
`

const InputIcon = styled.div`
    height: 100%;
    width: 30px;
    position: absolute;
    display: grid;
    place-items: center;
    left: 0;
    top: 0;

    & > svg {
        width: 20px;
    }
`

const Action = styled.span`
    cursor: pointer;
`

const Icon = styled(FeatherIcon)`
    stroke: ${props => props.theme.icon};
`

const ChatListView = styled.div`
    margin-top: 1rem;
`

const ChatList: React.FC = () => {
    const { chatList = [], addChatsToList, addAChatToList, disconnectChat } = useContext(ChatContext);
    const { toggleTheme } = useContext(ThemeContext)
    const { id, imageUrl, username } = useSelector(selectAuthValue);
    const [search, setSearch] = useState('')

    useEffect(() => {
        if (id) {
            ChatSocketProvider.getChatList(id);
            ChatSocketProvider.eventEmitter.on('chat-list-response', handleToChatListChange);
        }
        return () => ChatSocketProvider.eventEmitter.removeListener('chat-list-response', handleToChatListChange);
    }, [id]);

    const handleToChatListChange = useCallback((chatListResponse: any) => {
        if (chatList === null || chatList === [])
            return;
        if (chatListResponse.error) {
            console.warn("Could not get chatlist")
        } else {
            if (chatListResponse.singleUser) {
                if (chatListResponse.chatList._id === id) return;
                addAChatToList(chatListResponse.chatList);
            } else if (chatListResponse.userDisconnected)
                disconnectChat(chatListResponse.chatList)
            else
                addChatsToList(chatListResponse.chatList)
        }
    }, [])

    return (
        <ChatListWrapper>
            <TopSection>
                <Header size="md">Chats</Header>
                <br />
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <SearchInput>
                        <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Find a chat here" width="100%" height="100%" />
                        <InputIcon>
                            <FeatherIcon icon="search" />
                        </InputIcon>
                    </SearchInput>
                    <Action onClick={toggleTheme}>
                        <Icon icon="sun" />
                    </Action>
                </div>
            </TopSection>
            <ChatListView>
                {
                    (chatList.filter((chat) => chat.username.toLowerCase().includes(search.trim().toLowerCase())))
                    .map((chat, index) => (
                        <ChatItem key={index} { ...{ chat } } ></ChatItem>
                    ))
                }
            </ChatListView>
        </ChatListWrapper>
    )
}

const ChatItemImageBox = styled.div`
    background-color: ${props => props.theme.input};
    width: 40px;
    height: 40px;
    border-radius: 50%;
    margin-right: 1rem;
    position: relative;
    display: grid;
    place-items: center;
    transition: ease-out 300ms background;
`

const ChatItemImage = styled.img`
    width: 40px;
    height: 40px;
`

const OnlineUser = styled.span`
    width: 10px;
    height: 10px;
    position: absolute;
    bottom: 0;
    right: 0;
    background: lightgreen;
    border-radius: 50%;
`

export type ChatImageProps = {
    src?: string | null
    name: string
    online?: 'Y' | 'N'
}
export const ChatImage: React.FC<ChatImageProps> = ({ src, name, online }) => {
    return (
        <ChatItemImageBox className="img">
            { src && <ChatItemImage src={src} alt={name} /> }
            { !src && <FeatherIcon icon="user" size={16} /> }
            { (online && online === 'Y') && <OnlineUser /> }
        </ChatItemImageBox>
    )
}

const ChatItemWrapper = styled.div<{ activeChat: boolean }>`
    margin: .5rem;
    padding: .3rem .5rem;
    cursor: pointer;
    display: flex;
    align-items: center;
    border-radius: 8px;
    transition: ease-out 300ms background;
    ${props => props.activeChat && `background: ${props.theme.primary};`}
   
    & .img {
        ${props => props.activeChat && `background: ${props.theme.primary};`}
    }

    &:hover {
        ${props => !props.activeChat && `background: ${props.theme.input};`}
    }
`

const ChatItemOverview = styled.div`
    flex: 1;
    margin-left: .25rem;
`

type ChatListPropType = {
    chat: UserType,
}

export const ChatItem: React.FC<ChatListPropType> = ({ chat }) => {
    const { setNavToggle, isMobileViewPort } = useContext<NavContextValueType>(NavContext);
    const history = useHistory()
    const { pathname } = useLocation()
    const params = useParams<{ recipientId: string }>()
    const onSelect = (id: string) => {
        const url = `/in/${id}`
        if (pathname !== url) {
            history.push(url)
        } else {
            if (isMobileViewPort) {
                setNavToggle(false)
            }
        }
    }
    return (
        <ChatItemWrapper activeChat={params.recipientId === chat._id} onClick={() => onSelect(chat._id)}>
            <ChatImage src={chat.imageUrl} name={chat.username} online={chat.online} />
            <ChatItemOverview>
                <Text size="xs">{ chat.username }</Text>
                {/* <div className="chat-last">{ chat. }</div> */}
            </ChatItemOverview>
        </ChatItemWrapper>
    )
}

export default ChatList;