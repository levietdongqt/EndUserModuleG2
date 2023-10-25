import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import {
  Box, FormControl, FormLabel, InputGroup, Input, Text, InputRightElement, Button, Checkbox, useToast,
  Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalCloseButton
} from '@chakra-ui/react';
import { Visibility, VisibilityOff } from '@mui/icons-material';
//import GoogleIcon from '@mui/icons-material/Google';
import { useFormik } from 'formik';
import { sendmail } from '../../services/UserServices';
import bcrypt from 'bcryptjs/dist/bcrypt';
import { useUserContext } from '../../contexts/UserContext';
import LoginValidations from '../../validations/LoginValidations';
import { Login as LogIn, OAuth2Request } from '../../services/AuthServices';
import { useGoogleLogin } from '@react-oauth/google';
import { testRequest } from '../../services/TestService';

const Login = () => {

  const [show, setShow] = useState(false);
  const [remember, setRemember] = useState(false);
  const { setCurrentUser, setToken } = useUserContext();
  const [cookies, setCookie, removeCookie] = useCookies(['currentUser']);
  const [tokenCookie, setTokenCookie, removeTokenCookie] = useCookies(['access_token']);
  const navigate = useNavigate();
  const toast = useToast();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [email, setEmail] = useState('');

  //#region HANDLE LOGIN
  const handldeResponse = (result, remember) => {
    if (result.data.status === 200) {
      console.log(result.data)
      setCurrentUser(result.data.result);
      setToken(result.data.token);
      toast({
        title: 'Logged in.',
        description: 'You have successfully logged in.',
        status: 'success',
        duration: 2000,
        isClosable: true
      });
      navigate('/');
      if (remember) {
        console.log("luuuu lauuu")
        setCookie('currentUser', result.data.result, { path: '/' });
        setTokenCookie('access_token', result.data.token, { path: '/' })
      } else {
        console.log("Luuu 1 xiuuuu")
        setCookie('currentUser', result.data.result, { path: '/', expires: 0 });
        setTokenCookie('access_token', result.data.token, { path: '/', expires: 0 })
      };
    } else {
      resetForm();
      toast({
        title: 'Error!',
        description: result.data.message,
        status: 'error',
        duration: 2000,
        isClosable: true,
        position: "top"
      });
    }
  }
  //#endregion



  //#region FORMIK CHEKC ERROR AND SUBMIT LOGIN

  const { values, handleSubmit, handleChange, isValid, resetForm } = useFormik({
    initialValues: {
      email: '',
      password: ''
    },
    onSubmit: values => {
      console.log("Voooo")

      console.log(values.email)
      const salt = "$2a$10$tpe4SRcMCzhG0xHhUFAs1.";
      const hashedPassword = bcrypt.hashSync(values.password, salt);
      LogIn(values.email, hashedPassword)
        .then((result) => {
          handldeResponse(result, remember);
        });
    },
    validationSchema: LoginValidations,
  });
  //#endregion


  //#region LOGIN WITH GOOGLE
  const login = useGoogleLogin({
    onSuccess: (response) => {
      OAuth2Request(response.access_token).then((result) => {
        handldeResponse(result, true);
        testRequest().then((result) => {
          console.log(result)
        })
      })
    },
    onError: (error) => console.log('Login Failed:', error)
  });
  //#endregion

  //#region MODAL PASSWORD RECOVERY
  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleSubmitpr = async (event) => {
    event.preventDefault();
    let errorMessage = '';

    try {
      const senmail = await sendmail(email);

      if (senmail) {
        // Gửi toast thông báo thành công
        closeModal();
        toast({
          title: "Please check your email and reset your password",
          status: "success",
          duration: 3000, // Độ lâu hiển thị thông báo (miligiây)
          isClosable: true,
        });

      }
    } catch (error) {

      toast({
        title: "Error",
        description: "This email address does not exist in the system. Please check again",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }


  };





  return (
    <Box
      display='flex'
      justifyContent='center'
      alignItems='center'
      width='100vw'
      height='auto'
    >
      <Box width={{ base: '100vw', sm: '500px' }} p={2}>
        <Text textAlign='center' color={'facebook.500'} fontSize={32} fontWeight={600} mb={10} >Login</Text>
        <FormControl mt={3} >
          <FormLabel fontSize={20} >Email</FormLabel>
          <Input
            name='email'
            placeholder='Enter Email'
            onChange={handleChange}
            value={values.email}
          />
        </FormControl>
        <FormControl mt={3}>
          <FormLabel fontSize={20} >Password</FormLabel>
          <InputGroup size='md'>
            <Input
              name='password'
              pr='4.5rem'
              type={show ? 'text' : 'password'}
              placeholder='Enter password'
              onChange={handleChange}
              value={values.password}
            />
            <InputRightElement width='4.5rem'>
              <Button h='1.75rem' size='sm' variant='ghost' onClick={() => setShow(!show)}>
                {show ? <VisibilityOff /> : <Visibility />}
              </Button>
            </InputRightElement>
          </InputGroup>
        </FormControl>
        <Checkbox value={remember} onChange={() => setRemember(!remember)} mt={5} >Remember me</Checkbox>

        <Button mt={5} width='100%' variant='solid' colorScheme='facebook' disabled={!isValid} onClick={handleSubmit} >Login</Button>
        <br />
        <Text my={3} width='100%' textAlign='center' >or</Text>
        <Button width='100%' variant='outline' colorScheme='facebook' onClick={() => login()} >Google</Button>
        <Text my={3} width='100%' textAlign='center' >or</Text>
        <Button width='100%' variant='outline' colorScheme='facebook' onClick={openModal} >Forgot password ?</Button>
        <Text my={3} width='100%' textAlign='center' >or</Text>
        <Button width='100%' variant='outline' colorScheme='facebook' onClick={() => navigate('/register')} >Register</Button>
      </Box>

      <Modal isOpen={isModalOpen} onClose={closeModal} size="sm">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader fontSize="2xl" fontWeight="bold" p={4}>
            Forgot Password ?
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <form onSubmit={handleSubmitpr}>
              <div>
                <FormLabel>Email</FormLabel>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  size="lg"
                />
              </div>
              <Button
                type="submit"
                colorScheme="blue"
                size="lg"
                width="100%"
                mt={4}
              >
                Submit
              </Button>
            </form>
          </ModalBody>
        </ModalContent>
      </Modal>



    </Box>
  )
}

export default Login;