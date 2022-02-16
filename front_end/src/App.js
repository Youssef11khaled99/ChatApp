import './App.css';
import {useRef, useState, useEffect} from 'react'
import { w3cwebsocket as  W3CWebSocket } from 'websocket';
import Login from './components/Login';
import NavBar from './components/NavBar';

import { 
  ChakraProvider, theme,
  Button, 
  Textarea,
  Avatar, 
  Grid, GridItem,
  Tag, Divider,
  TagLabel,
  Box, HStack,
  Badge, Tooltip,
} from '@chakra-ui/react'

const client = new W3CWebSocket('ws://0604-156-196-209-15.ngrok.io');

function App() {
  const [screenMode, setScreenMode] = useState('light');
  const [webSocketState, setWebSocketState] = useState('Disconnected');
  const [currentMessage, setCurrentMessage] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [messages, setMessages] = useState([])
  const [userInfo, setUserInfo] = useState({
    userName: '',
    isLoggedIn: false
  })
  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    client.onopen = () => {
      setWebSocketState('Connected');
      console.log('WebSocket Client Connected')
    }
    client.onmessage = (message) => {
      console.log(JSON.parse(message.data))
      window.scrollTo(0, document.getElementById("messagesDiv").offsetHeight);
      let messageFromServer = JSON.parse(message.data)
      setMessages(prevItems => [...prevItems, {
        ...messageFromServer
      }]);
    }
  }, [])
  useEffect(() => {
    scrollToBottom();
  }, [messages])

  
  const sendMessage = () => {
    if (webSocketState === 'Connected' && currentMessage !== '') {
      setCurrentMessage('')
      var today = new Date();
      var currentTime = today.toLocaleString('en-US', { 
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit', 
        hour12: true 
      });
      client.send(JSON.stringify({
        type: 'message',
        msg: currentMessage,
        user: userInfo.userName,
        createdAt: currentTime,
      }))
    }
  }
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      console.log(currentMessage)
      setIsTyping(false)
      // Send Axios request here
    }, 3000)
    setIsTyping(true)
    
    return () => clearTimeout(delayDebounceFn)
  }, [currentMessage])
  
  return (
    <ChakraProvider theme={theme}>
        <NavBar setScreenMode= {setScreenMode}/>   
        {
          !userInfo.isLoggedIn
          ? <Login screenMode= {screenMode} setUserInfo={setUserInfo}/>
          : <>
              <Grid 
                maxH="70vh" 
                templateRows='repeat(6, 1fr)' 
                overflowY='auto'
                overflowX='hidden'
              >
                <GridItem rowSpan={1}>
                  <HStack spacing={4} m="10px">
                    <Tooltip label='User Status'>
                      <Badge colorScheme={webSocketState === 'Connected'? 'green' : 'red'} >{webSocketState} </Badge>
                    </Tooltip>
                    <Tag size='lg' colorScheme='red' borderRadius='full'>
                      <Avatar
                        size='xs'
                        name={userInfo.userName}
                        ml={-1}
                        mr={2}
                      />
                      <TagLabel>Welcome {userInfo.userName}</TagLabel>
                    </Tag>
                  </HStack>
                </GridItem>
                <GridItem id="messagesDiv" rowSpan={4}>
                  {
                    messages.map((message, i) => 
                      <Box 
                        key={"box-"+i} 
                        w="100vw" 
                        paddingLeft="15px" 
                        paddingRight="25px"
                        textAlign={message.user === userInfo.userName ? 'left' : 'right'}
                      >
                        <Tag key={"tag-"+i} size='lg' colorScheme='red' borderRadius='full'>
                          <Avatar
                            key={i} 
                            src={message.user}
                            size='xs'
                            name={message.user}
                            ml={-1}
                            mr={2}
                          />
                          <TagLabel key={"tag-label-"+i}>{message.user}</TagLabel>
                        </Tag>
                        <p key={"p-"+i} style={{whiteSpace: "pre-line"}}>{message.msg}</p>
                        <Tooltip label="createdAt">
                          <Tag>{message.createdAt}</Tag>
                        </Tooltip>
                        <br/>
                      </Box>
                    )}
                    <Divider/>
                    <div ref={messagesEndRef} />
                </GridItem>
              </Grid>              
              <Grid 
              templateRows='repeat(1, 1fr)'
              templateColumns='repeat(5, 1fr)'
              gap={4}
              w="95%"
              position='fixed'
              justifyContent='center'
              alignItems='center'
              bottom='0'
              m="25px"
            >
              <GridItem colSpan={4}>
                <Textarea 
                  id="inputMessage"
                  className={isTyping ? "pulsStyle" : null}
                  style={{border: "1px solid #00bf49"}}
                  background={screenMode !== 'light' ? "#ededed" : 'transparent'}
                  isDisabled={webSocketState === 'Connected' ? false : true} 
                  resize='none'
                  value={currentMessage}
                  onChange={(e) => setCurrentMessage(e.target.value)}
                />
              </GridItem>
              <GridItem colSpan={1}>
                <Button 
                  isDisabled={webSocketState === 'Connected' ? false : true} 
                  size="lg"
                  onClick={() => sendMessage()}
                >Send Message</Button>
              </GridItem>
              </Grid>
            </>
        }         
    </ChakraProvider>
  );
}

export default App;
