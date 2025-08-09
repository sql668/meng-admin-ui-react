import {
  Bubble,
  Conversation,
  Prompts,
  Sender,
  Suggestion,
  useXAgent,
  useXChat,
  Welcome,
} from '@ant-design/x'
import { Button, Space, Spin } from 'antd'
import { createStyles } from 'antd-style'
import { memo, useEffect, useRef, useState, type FC } from 'react'
import { ChatProps } from './type'
import {
  CloseOutlined,
  CopyOutlined,
  DislikeOutlined,
  LikeOutlined,
  OpenAIFilled,
  PaperClipOutlined,
  ReloadOutlined,
} from '@ant-design/icons'
import { BubbleDataType } from '@ant-design/x/es/bubble/BubbleList'

const MOCK_QUESTIONS = [
  // 'What has Ant Design X upgraded?',
  // 'What components are in Ant Design X?',
  // 'How to quickly install and import components?',
  '关于本系统的使用问题',
]

const AGENT_PLACEHOLDER = 'Generating content, please wait...'
const MOCK_SUGGESTIONS = [
  { label: 'Write a report', value: 'report' },
  { label: 'Draw a picture', value: 'draw' },
  {
    label: 'Check some knowledge',
    value: 'knowledge',
    icon: <OpenAIFilled />,
    children: [
      { label: 'About React', value: 'react' },
      { label: 'About Ant Design', value: 'antd' },
    ],
  },
]

const MOCK_SESSION_LIST = [
  {
    key: '5',
    label: 'New session',
    group: 'Today',
  },
  {
    key: '4',
    label: 'What has Ant Design X upgraded?',
    group: 'Today',
  },
  {
    key: '3',
    label: 'New AGI Hybrid Interface',
    group: 'Today',
  },
  {
    key: '2',
    label: 'How to quickly install and import components?',
    group: 'Yesterday',
  },
  {
    key: '1',
    label: 'What is Ant Design X?',
    group: 'Yesterday',
  },
]

export const Avatar = (props: { backgroundColor?: string; avatar: string }) => {
  const { backgroundColor, avatar } = props
  return (
    <div
      className='ant-avatar ant-avatar-circle ant-avatar-image w-[40px] h-[40px] rounded-full overflow-hidden flex-shrink-0'
      style={{
        backgroundColor: `${backgroundColor}`,
        backgroundImage: `url(${avatar})`,
        backgroundSize: 'contain',
        backgroundRepeat: 'no-repeat',
      }}
    />
  )
}

const useChatStyle = createStyles(({ token, css }) => {
  return {
    copilotChat: css`
      display: flex;
      flex-direction: column;
      background: ${token.colorBgContainer};
      color: ${token.colorText};
    `,
    // chatHeader 样式
    chatHeader: css`
      height: 52px;
      box-sizing: border-box;
      border-bottom: 1px solid ${token.colorBorder};
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 10px 0 16px;
    `,
    headerTitle: css`
      font-weight: 600;
      font-size: 15px;
    `,
    headerButton: css`
      font-size: 18px;
    `,
    conversations: css`
      width: 300px;
      .ant-conversations-list {
        padding-inline-start: 0;
      }
    `,
    // chatList 样式
    chatList: css`
      overflow: auto;
      padding-block: 16px;
      flex: 1;
    `,
    chatWelcome: css`
      margin-inline: 16px;
      padding: 12px 16px;
      border-radius: 2px 12px 12px 12px;
      background: ${token.colorBgTextHover};
      margin-bottom: 16px;
    `,
    loadingMessage: css`
      background-image: linear-gradient(90deg, #ff6b23 0%, #af3cb8 31%, #53b6ff 89%);
      background-size: 100% 2px;
      background-repeat: no-repeat;
      background-position: bottom;
    `,
    // chatSend 样式
    chatSend: css`
      padding: 12px;
    `,
    sendAction: css`
      display: flex;
      align-items: center;
      margin-bottom: 12px;
      gap: 8px;
    `,
    speechButton: css`
      font-size: 18px;
      color: ${token.colorText} !important;
    `,
  }
})

export const Chat: FC<ChatProps> = memo(({ drawerWidth = 500, style, onClose }) => {
  const { styles } = useChatStyle()
  //const tokenRef = useRef<string | undefined>(token)
  const abortController = useRef<AbortController | null>(null)

  const [_, setMessageHistory] = useState<Record<string, any>>({})

  const [sessionList, setSessionList] = useState<Conversation[]>(MOCK_SESSION_LIST)
  const [curSession] = useState(sessionList[0].key)

  const [attachmentsOpen, setAttachmentsOpen] = useState(false)
  //const [files, setFiles] = useState<GetProp<AttachmentsProps, 'items'>>([])

  const [inputValue, setInputValue] = useState('')

  const [agent] = useXAgent<BubbleDataType>({
    baseURL: 'https://api.x.ant.design/api/llm_siliconflow_deepSeek-r1-distill-1wen-7b',
    model: 'DeepSeek-R1-Distill-Qwen-7B',
    dangerouslyApiKey: 'Bearer sk-xxxxxxxxxxxxxxxxxxxx',
  })
  const loading = agent.isRequesting()
  const { messages, onRequest } = useXChat({
    // { messages, onRequest, setMessages }
    agent,
    requestFallback: (_, { error }) => {
      console.error(error)
      if (error.name === 'AbortError') {
        return {
          content: 'Request is aborted',
          role: 'assistant',
        }
      }
      return {
        content: 'Request failed, please try again!',
        role: 'assistant',
      }
    },
    transformMessage: (info) => {
      const { originMessage, chunk } = info || {}
      let currentContent = ''
      let currentThink = ''
      try {
        if (chunk?.data && !chunk?.data.includes('DONE')) {
          const message = JSON.parse(chunk?.data)
          currentThink = message?.choices?.[0]?.delta?.reasoning_content || ''
          currentContent = message?.choices?.[0]?.delta?.content || ''
        }
      } catch (error) {
        console.error(error)
      }

      let content = ''

      if (!originMessage?.content && currentThink) {
        content = `<think>${currentThink}`
      } else if (
        originMessage?.content?.includes('<think>') &&
        !originMessage?.content.includes('</think>') &&
        currentContent
      ) {
        content = `${originMessage?.content}</think>${currentContent}`
      } else {
        content = `${originMessage?.content || ''}${currentThink}${currentContent}`
      }

      return {
        content: content,
        role: 'assistant',
      }
    },
    resolveAbortController: (controller) => {
      abortController.current = controller
    },
  })

  // ==================== Event ====================

  const handleUserSubmit = (val: string) => {
    onRequest({
      stream: true,
      message: { content: val, role: 'user' },
    })

    // session title mock
    if (sessionList.find((i) => i.key === curSession)?.label === 'New session') {
      setSessionList(
        sessionList.map((i) => (i.key !== curSession ? i : { ...i, label: val?.slice(0, 20) })),
      )
    }
  }

  useEffect(() => {
    console.log('messages: ', messages)
    // history mock
    if (messages?.length) {
      setMessageHistory((prev) => ({
        ...prev,
        [curSession]: messages,
      }))
    }
  }, [messages])

  const charHeader = (
    <div className={styles.chatHeader}>
      <div className={styles.headerTitle}>✨ AI 助手</div>
      <Space size={0}>
        <Button
          type='text'
          icon={<CloseOutlined />}
          onClick={onClose}
          className={styles.headerButton}
        />
      </Space>
    </div>
  )
  const chatList = (
    <div className={styles.chatList}>
      {messages?.length ? (
        /** 消息列表 */
        <Bubble.List
          style={{ height: '100%', paddingInline: 16 }}
          items={messages?.map((i) => ({
            ...i.message,
            classNames: {
              content: i.status === 'loading' ? styles.loadingMessage : '',
            },
            typing: i.status === 'loading' ? { step: 5, interval: 20, suffix: <>💗</> } : false,
          }))}
          roles={{
            assistant: {
              placement: 'start',
              footer: (
                <div style={{ display: 'flex' }}>
                  <Button type='text' size='small' icon={<ReloadOutlined />} />
                  <Button type='text' size='small' icon={<CopyOutlined />} />
                  <Button type='text' size='small' icon={<LikeOutlined />} />
                  <Button type='text' size='small' icon={<DislikeOutlined />} />
                </div>
              ),
              loadingRender: () => (
                <Space>
                  <Spin size='small' />
                  {AGENT_PLACEHOLDER}
                </Space>
              ),
            },
            user: { placement: 'end' },
          }}
        />
      ) : (
        /** 没有消息时的 welcome */
        <>
          <Welcome
            variant='borderless'
            title='👋 Hello, 我是您的个人小助手，您可以问我任何问题'
            description=''
            className={styles.chatWelcome}
          />

          <Prompts
            vertical
            title='I can help：'
            items={MOCK_QUESTIONS.map((i) => ({ key: i, description: i }))}
            onItemClick={(info) => handleUserSubmit(info?.data?.description as string)}
            style={{
              marginInline: 16,
            }}
            styles={{
              title: { fontSize: 14 },
            }}
          />
        </>
      )}
    </div>
  )

  const chatSender = (
    <div className={styles.chatSend}>
      {/** 输入框 */}
      <Suggestion items={MOCK_SUGGESTIONS} onSelect={(itemVal) => setInputValue(`[${itemVal}]:`)}>
        {({ onTrigger, onKeyDown }) => (
          <Sender
            loading={loading}
            value={inputValue}
            onChange={(v) => {
              onTrigger(v === '/')
              setInputValue(v)
            }}
            onSubmit={() => {
              handleUserSubmit(inputValue)
              setInputValue('')
            }}
            onCancel={() => {
              abortController.current?.abort()
            }}
            allowSpeech
            placeholder='Ask or input / use skills'
            onKeyDown={onKeyDown}
            prefix={
              <Button
                type='text'
                icon={<PaperClipOutlined style={{ fontSize: 18 }} />}
                onClick={() => setAttachmentsOpen(!attachmentsOpen)}
              />
            }
            actions={(_, info) => {
              const { SendButton, LoadingButton, SpeechButton } = info.components
              return (
                <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <SpeechButton className={styles.speechButton} />
                  {loading ? <LoadingButton type='default' /> : <SendButton type='primary' />}
                </div>
              )
            }}
          />
        )}
      </Suggestion>
    </div>
  )
  // ============================ Render ============================
  return (
    <div
      className={styles.copilotChat}
      style={{
        ...style,
        minWidth: drawerWidth,
        height: '100%',
      }}>
      {charHeader}
      {chatList}
      {chatSender}
    </div>
  )
})
