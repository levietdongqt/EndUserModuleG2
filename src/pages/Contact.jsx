import React, {useState} from 'react';
import {Box, Grid, Image, Alert, Input, Textarea, Button, Text, FormControl, Heading} from '@chakra-ui/react';
import {FaSquareTwitter,FaSquareFacebook,FaSquareInstagram,FaSquareYoutube} from 'react-icons/fa6';

const Contact = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [emailSent, setEmailSent] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        // Xử lý logic khi người dùng submit form
    };
    const position = [51.505, -0.09]
    return (
        <Box maxW="1140px" mx="auto" p={8}>
            <Box textAlign={'center'} mb={10}>
                <Heading as='h2' size='3xl'>
                    Contact
                </Heading>
            </Box>
            <Grid templateColumns={{base: '1fr', md: '1fr 1fr'}} gap={8} mb={4}>
                <Box display="flex">
                    <Box
                        display="flex"
                        flexDirection="column"
                        alignItems="center"
                        maxWidth={600}
                        mx="auto"
                        borderWidth="2px"
                        borderRadius="12px"
                        boxShadow={1}
                        borderColor={'black'}
                        p={35}
                        flex="1"
                    >
                        <Text variant="h4" align="center" mb={2} color={'#16113a'} fontSize={24} fontWeight={700}>
                            Send us a message
                        </Text>
                        <form onSubmit={handleSubmit} style={{width: '100%'}}>
                            <Box mb={4}>
                                <Input
                                    lineHeight={'28px'}
                                    fontSize={18}
                                    border="2px solid #16113a"
                                    borderRadius="8px"
                                    p="10px 10px 10px 30px"
                                    transition="all .15s ease-out"
                                    placeholder="Tên"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    marginY="normal"
                                    isRequired
                                />
                            </Box>
                            <Box mb={4}>

                                <Input
                                    lineHeight={'28px'}
                                    fontSize={18}
                                    border="2px solid #16113a"
                                    borderRadius="8px"
                                    p="10px 10px 10px 30px"
                                    transition="all .15s ease-out"
                                    placeholder="Email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    marginY="normal"
                                    isRequired
                                    type="email"
                                />
                            </Box>
                            <Box mb={4}>
                                <Textarea
                                    lineHeight={'28px'}
                                    fontSize={18}
                                    border="2px solid #16113a"
                                    borderRadius="8px"
                                    p="10px 10px 10px 30px"
                                    transition="all .15s ease-out"
                                    placeholder="Tin nhắn"
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    marginY="normal"
                                    isRequired
                                    rows={4}
                                />
                            </Box>

                            <Button
                                width={'100%'}
                                type="submit"
                                marginTop="2"
                                backgroundColor="#000"
                                color="#fff"
                                _hover={{
                                    backgroundColor: '#111',
                                }}
                            >
                                Send
                            </Button>
                        </form>
                    </Box>
                </Box>


                <Box ml={4}>
                    <Heading as='h2' size='xl'>
                        Locations
                    </Heading>
                    <Box width={'100%'}>
                        <iframe width="500" height="200" frameBorder="0" scrolling="no" marginHeight="0" marginWidth="0"
                                id="gmap_canvas"
                                src="https://maps.google.com/maps?width=500&amp;height=200&amp;hl=en&amp;q=H%E1%BB%93%20Ch%C3%AD%20Minh%20ho%20chi%20minh+()&amp;t=&amp;z=12&amp;ie=UTF8&amp;iwloc=B&amp;output=embed"></iframe>
                    </Box>
                    <Heading as='h2' size='xl' mt={7}>
                        Follow us
                    </Heading>
                    <Box display={'flex'} justifyContent={'flex-start'}>
                        <FaSquareTwitter size={50} color={'#16113a'} cursor={'pointer'} onClick={() => window.open('https://www.Twitter.com/','_blank')} />
                        <FaSquareFacebook size={50} color={'#16113a'} cursor={'pointer'} onClick={() => window.open('https://www.Facebook.com/','_blank')} />
                        <FaSquareInstagram size={50} color={'#16113a'} cursor={'pointer'} onClick={() => window.open('https://www.Instagram.com/','_blank')} />
                        <FaSquareYoutube size={50} color={'#16113a'} cursor={'pointer'} onClick={() => window.open('https://YouTube.com/','_blank')} />
                    </Box>

                </Box>
            </Grid>
        </Box>
    );
};

export default Contact;