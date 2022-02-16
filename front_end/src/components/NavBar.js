import React from 'react'
import { HStack, Heading } from '@chakra-ui/react';
import { FaRocketchat } from "react-icons/fa";
import ColorModeSwitcher from './ColorModeSwitcher';
import '../App.css';
function NavBar({ setScreenMode }) {
    return (
        <HStack justify="space-between" style={{marginBottom: "-10px"}} align="center" colorScheme="blue" h="10vh" >
            <FaRocketchat className="iconPuls" style={{width: "45px", height: "40px", margin: "20px", color: "green"}}/>
            <Heading>YK Chat App</Heading>
            <ColorModeSwitcher changeMode={setScreenMode} justifySelf="flex-end" />
        </HStack>
    )
}

export default NavBar;
