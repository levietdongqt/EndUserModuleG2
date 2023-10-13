import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, FormControl, FormLabel, FormErrorMessage, InputGroup, Input, Text, InputRightElement, Button, Checkbox, useToast, Radio, RadioGroup, Stack, HStack, InputLeftAddon } from '@chakra-ui/react';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useFormik } from 'formik';
import { Register as Signup } from '../services/UserServices';
import RegisterValidations from '../validations/RegisterValidations';

const Register = () => {

  const [show, setShow] = useState(false);
  const [showrp, setShowrp] = useState(false);

  const toast = useToast();
  const navigate = useNavigate();

  const { handleChange, values, resetForm, handleBlur, touched, isValid, errors, setFieldValue, handleSubmit } = useFormik({
    initialValues: {
      fullName: '',
      email: '',
      address: '',
      password: '',
      repassword: '',
      phone: '0',
      gender: true,
      terms: false,
    },
    onSubmit: async (values) => {
      try {
        console.log(values.email);
        const userDTO = {
          fullName: values.fullName,
          gender: values.gender,
          email: values.email,
          phone: values.phone,
          address: values.address,
          dateOfBirth: values.dateOfBirth,
          gender: values.gender,
          password: values.password,
        };
        console.log(userDTO)

        const response = await Signup(userDTO);

        if (response.data) {
          navigate('/login');
          toast({
            title: 'Welcome to CLOTHIFY!',
            description: 'Please check your email and confirm.',
            status: 'success',
            duration: 2000,
            isClosable: true,
          });
        } else {
          resetForm();
          toast({
            title: 'Error!',
            description: 'This email is already in use.',
            status: 'error',
            duration: 2000,
            isClosable: true,
          });
        }
      } catch (error) {
        console.error(error);
        console.log("dk thất bại")
        // Xử lý lỗi ở đây nếu cần
      }
    },


    validationSchema: RegisterValidations
  });

  return (
    <Box as="form"
      display='flex'
      justifyContent='center'
      alignItems='center'
      width='100vw'
      mt={5}
      onSubmit={handleSubmit}
    >
      <Box width={{ base: '100vw', sm: '500px' }} p={2}>
        <Text textAlign='center' color={'facebook.500'} fontSize={32} fontWeight={600} mb={10} >Register</Text>


        <FormControl mb={3} isInvalid={touched.fullName && errors.fullName} >
          <FormLabel w="120px">Full Name:</FormLabel>
          <Input
            type="text"
            name="fullName"
            value={values.fullName}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder='Enter Full Name'
          />
          {touched.fullName && <FormErrorMessage>{errors.fullName}</FormErrorMessage>}
        </FormControl>


        <FormControl mt={3} isInvalid={touched.email && errors.email} >
          <FormLabel fontSize={20} >Email</FormLabel>
          <Input
            name='email'
            placeholder='Enter Email'
            onChange={handleChange}
            value={values.email}
            onBlur={handleBlur}
          />
          {touched.email && <FormErrorMessage>{errors.email}</FormErrorMessage>}
        </FormControl>

        <FormControl mt={3} isInvalid={touched.phone && errors.phone} >
          <FormLabel fontSize={20} >Phone</FormLabel>
          <Input
            type='tel'
            name='phone'
            placeholder='Enter Phone'
            onChange={handleChange}
            value={values.phone}
            onBlur={handleBlur}
          />
          {touched.phone && <FormErrorMessage>{errors.phone}</FormErrorMessage>}
        </FormControl>

        <FormControl mt={3} isInvalid={touched.address && errors.address} >
          <FormLabel fontSize={20} >Address</FormLabel>
          <Input
            type='text'
            name='address'
            placeholder='Enter Address'
            onChange={handleChange}
            value={values.address}
            onBlur={handleBlur}
          />
          {touched.address && <FormErrorMessage>{errors.address}</FormErrorMessage>}
        </FormControl>


        <FormControl mt={3} isInvalid={touched.dateOfBirth && errors.dateOfBirth} >
          <FormLabel fontSize={20} >Birth Day</FormLabel>
          <Input
            type='date'
            name='dateOfBirth'
            placeholder='Enter Birth Day'
            onChange={handleChange}
            value={values.dateOfBirth}
            onBlur={handleBlur}
          />
          {touched.dateOfBirth && <FormErrorMessage>{errors.dateOfBirth}</FormErrorMessage>}
        </FormControl>

        <FormControl mt={3} isInvalid={touched.gender && errors.gender}>
          <InputGroup >
            <InputLeftAddon w="120px" fontSize={20} fontWeight={600} >Gender:</InputLeftAddon>
            <RadioGroup
              name="gender"
              value={values.gender}
              // onChange={handleChange}
              pt={2}
            >
              <Radio value={true}
                isChecked={values.gender === true}
                onChange={() => setFieldValue("gender", true)} pr={5} pl={5}>Male</Radio>
              <Radio value={false}
                isChecked={values.gender === false}
                onChange={() => setFieldValue("gender", false)} pr={2}>Female</Radio>
            </RadioGroup>

          </InputGroup>
          {touched.gender && <FormErrorMessage>{errors.gender}</FormErrorMessage>}
        </FormControl>

        <FormControl mt={3} isInvalid={touched.password && errors.password} >
          <FormLabel fontSize={20} >Password</FormLabel>
          <InputGroup size='md'>
            <Input
              name='password'
              pr='4.5rem'
              type={show ? 'text' : 'password'}
              placeholder='Enter password'
              onChange={handleChange}
              value={values.password}
              onBlur={handleBlur}
            />
            <InputRightElement width='4.5rem'>
              <Button h='1.75rem' size='sm' variant='ghost' onClick={() => setShow(!show)}>
                {show ? <VisibilityOff /> : <Visibility />}
              </Button>
            </InputRightElement>
          </InputGroup>
          {touched.password && <FormErrorMessage>{errors.password}</FormErrorMessage>}
        </FormControl>

        <FormControl mt={3} isInvalid={touched.repassword && errors.repassword} >
          <FormLabel fontSize={20} >Confirm Password</FormLabel>
          <InputGroup size='md'>
            <Input
              name='repassword'
              pr='4.5rem'
              type={showrp ? 'text' : 'password'}
              placeholder='Enter repassword'
              onChange={handleChange}
              value={values.repassword}
              onBlur={handleBlur}
            />
            <InputRightElement width='4.5rem'>
              <Button h='1.75rem' size='sm' variant='ghost' onClick={() => setShowrp(!showrp)}>
                {showrp ? <VisibilityOff /> : <Visibility />}
              </Button>
            </InputRightElement>
          </InputGroup>
          {touched.repassword && <FormErrorMessage>{errors.repassword}</FormErrorMessage>}
        </FormControl>

        <Checkbox name='terms' isChecked={values.terms} onChange={handleChange} mt={5} >I agree the <strong>Terms of Service</strong> and <strong>Privacy Policy</strong>.</Checkbox>
        <Button mt={5} width='100%' variant='solid' colorScheme='facebook' disabled={!isValid} type='submit'  >Register</Button>
        <br />
        <Text my={3} width='100%' textAlign='center' >or</Text>
        <Button width='100%' variant='outline' colorScheme='facebook' onClick={() => navigate('/login')} >Login</Button>
      </Box>
    </Box>
  )
}

export default Register;