import { useEffect} from 'react'
import { 
  Input,
  Button, 
  Stack,
  Select, Box,
  HStack
} from '@chakra-ui/react'


function Login({setUserInfo, screenMode}) {
  useEffect(() => {
  }, [])
  return (
    <Box  w="100vw" height="80vh" textAlign='center' display='flex' justifyContent='center' alignItems='center'>
      <Box w='60%' height="80%" border='1px solid blue' display='flex' flexDir='column' justifyContent='center' alignItems='center'>
        <Stack>
          <HStack w="90%">
            <h1>Enter Your Preferred Name</h1>
            <Input id="userName" size="lg" background={screenMode !== 'light' ? "#ededed" : 'transparent'}/>
          </HStack>
          <HStack w="90%">
            <h1>Choose a Chat Room</h1>
            <Select placeholder='Select option'>
              <option value='option1'>Room 1</option>
              <option value='option2'>Room 2</option>
              <option value='option3'>Room 3</option>
            </Select>
          </HStack>
        </Stack>
        <Button size="lg" onClick={() => {
        setUserInfo({
          userName: document.getElementById("userName").value,
          isLoggedIn: true})
        }}>Login</Button> 
      </Box>
    </Box>
  );
}

export default Login;
