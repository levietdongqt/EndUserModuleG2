import React from 'react';
import { Box, Text, IconButton, Container, Link, Image } from '@chakra-ui/react';
import { Apple, Facebook, Google, Instagram, Twitter, YouTube } from '@mui/icons-material';
import { useNavigate } from "react-router-dom";

const Footer = () => {
    const navigate = useNavigate();
    const getLink = (path) => {
        window.open(path, '_blank');
    }

    return (
        <Box mt={5} className='footer'>
            <Box
                bg='whitesmoke'
                display='flex'
                justifyContent='space-around'
                flexDirection={{ base: 'column', sm: 'row' }}
            >
                <Container display='flex' maxW='1200px' justifyContent='space-between' flexDirection={{ base: 'column', sm: 'row' }}>
                    <Box py={5}>
                        <Text mb={1} textAlign='center' color='blackAlpha.700' fontSize={20} fontWeight={600}>Follow Us</Text>
                        <Box display='flex' justifyContent='center'>
                            <IconButton mr={3} colorScheme='blackAlpha' variant='ghost' _hover={{ color: '#C13584' }} as={Instagram} onClick={() => getLink("https://www.instagram.com/")} cursor='pointer' />
                            <IconButton mr={3} colorScheme='blackAlpha' variant='ghost' _hover={{ color: 'facebook.500' }} as={Facebook} onClick={() => getLink("https://www.Facebook.com/")} cursor='pointer' />
                            <IconButton mr={3} colorScheme='blackAlpha' variant='ghost' _hover={{ color: 'red' }} as={YouTube} onClick={() => getLink("https://www.YouTube.com/")} cursor='pointer' />
                            <IconButton colorScheme='blackAlpha' variant='ghost' _hover={{ color: 'twitter.500' }} as={Twitter} onClick={() => getLink("https://www.Twitter.com/")} cursor='pointer' />
                        </Box>
                    </Box>
                    <Link py={5} cursor='pointer' onClick={() => navigate('/')}>
                        <Box maxWidth="200px" ml={{ base: "auto", sm: 10 }} mr={{ base: "auto", sm: 0 }}>
                            <Image src={`${process.env.REACT_APP_API_BASE_URL_LOCAL}/assets/Logo.png`} w='100%' h='auto' />
                        </Box>
                    </Link>
                    <Box py={5}>
                        <Text mb={1} textAlign='center' color='blackAlpha.700' fontSize={20} fontWeight={600}>Download App</Text>
                        <Box display='flex' justifyContent='center'>
                            <IconButton mr={3} colorScheme='blackAlpha' variant='ghost' _hover={{ color: '#000' }} as={Apple} onClick={() => getLink("https://www.Apple.com/")} cursor='pointer' />
                            <IconButton ml={3} colorScheme='blackAlpha' variant='ghost' _hover={{ color: 'facebook.500' }} as={Google} onClick={() => getLink("https://www.Google.com/")} cursor='pointer' />
                        </Box>
                    </Box>
                </Container>
            </Box>
            <Container maxW='1200px' display='flex' py={5} justifyContent='space-between' flexDirection={{ base: 'column', sm: 'row' }}>
                <Box textAlign={{ base: 'center', sm: 'start' }} py={5}>
                    <Text fontSize={24} fontWeight={600}>Help</Text>
                    <Text mt={2} _hover={{ textDecoration: 'underline' }}>Frequently Asked Questions</Text>
                    <Text mt={2} _hover={{ textDecoration: 'underline' }}>Return And Exchange</Text>
                    <Text mt={2} _hover={{ textDecoration: 'underline' }}>Support Team</Text>
                </Box>
                <Box textAlign={{ base: 'center', sm: 'start' }} py={5}>
                    <Text fontSize={24} fontWeight={600}>Corporate</Text>
                    <Text mt={2} _hover={{ textDecoration: 'underline' }}>Career Opportunities</Text>
                    <Text mt={2} _hover={{ textDecoration: 'underline' }}>Our Stores</Text>
                    <Text mt={2} _hover={{ textDecoration: 'underline' }}>About Us</Text>
                </Box>
                <Box textAlign={{ base: 'center', sm: 'start' }} py={5}>
                    <Text fontSize={24} fontWeight={600}>Policies</Text>
                    <Text mt={2} _hover={{ textDecoration: 'underline' }}>Privacy Policies</Text>
                    <Text mt={2} _hover={{ textDecoration: 'underline' }}>Terms & Conditions</Text>
                    <Text mt={2} _hover={{ textDecoration: 'underline' }}>Return Policies</Text>
                </Box>
            </Container>
        </Box>
    )
}

export default Footer;