import React, { useState, useEffect, useContext } from 'react'
import { useSelector } from 'react-redux'
import styled from 'styled-components'
import { ChatContext, ChatContextValueType, UserType } from '../../contexts/ChatContext'
import { ChatMessageType } from '../../helpers/socket/ChatSockerProvider'
import { selectAuthValue } from '../../store/auth'
import { ChatImage } from './ChatList'

const RecipientColor =  '#24f377'

type ChatMessageProp = {
  message: ChatMessageType
}
const ChatMessage: React.FC<ChatMessageProp> = ({ message }) => {
  const { id, username, imageUrl } = useSelector(selectAuthValue)
  const [user, setUser] = useState<UserType>();
  const { chatList } = useContext<ChatContextValueType>(ChatContext)
  const isAuth = id === message.fromUserId

  useEffect(() => {
    if (message.fromUserId) {
      if (id === message.fromUserId) {
        setUser({ username, imageUrl, _id: id, online: 'Y' })
      } else {
        const found = chatList.find((u) => u._id === message.fromUserId)
        setUser(found)
      }
    }
  }, [message, chatList])

  return (
      <ChatMessageWrapper>
        <ChatMessageImage>
          <ChatImage name="dsd" />
        </ChatMessageImage>
        <ChatMessageContent className="chat-item">
          <ChatAuthor isAuth={isAuth}>{user?.username}</ChatAuthor>
          <div>{message.text}</div>
        </ChatMessageContent>
      </ChatMessageWrapper>
  )
}

const ChatMessageWrapper = styled.div`
  margin-bottom: 1.3rem;
  display: flex;
  align-items: flex-start;
  flex-wrap: nowrap;
`

const ChatMessageImage = styled.div`

`

const ChatAuthor = styled.div<{ isAuth: boolean }>`
  color: ${props => props.isAuth ? props.theme.primary : '#24f377'};
`

const ChatMessageContent = styled.div`
  flex: 1;
  display: flex;
  flex-flow: column nowrap;
  grid-gap: 10px;
`

export default ChatMessage;