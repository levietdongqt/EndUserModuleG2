import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Box, FormControl, FormLabel, FormErrorMessage, InputGroup, Input, Text, InputRightElement, Button, Checkbox, useToast, Radio, RadioGroup, Stack, HStack, InputLeftAddon } from '@chakra-ui/react';
import { useFormik } from 'formik';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { resetPassword, sendmail } from '../../services/UserServices';
import RegisterValidations from '../../validations/RegisterValidations';
import moment from 'moment';
import bcrypt from 'bcryptjs/dist/bcrypt';

function PasswordRecovery() {
    const toast = useToast();
    const navigate = useNavigate();
    const [show, setShow] = useState(false);
    const [showrp, setShowrp] = useState(false);
    const [verifying, setVerifying] = useState(false);
    const [userId, setUserId] = useState('');
    const [expiration, setExpiration] = useState('');

    useEffect(() => {
        const location = window.location;
        const searchParams = new URLSearchParams(location.search);
        const userIdParam = searchParams.get('userId');
        const expirationParam = searchParams.get('expiration');

        if (userIdParam && expirationParam) {
            setUserId(userIdParam);
            setExpiration(expirationParam);
            // Lấy thời gian hiện tại
            const currentTime = moment();

            // Giả sử bạn đã nhận thời gian hết hạn từ URL hoặc nơi khác
            // Thời gian hết hạn dưới dạng Unix timestamp
            const expirationTimeUnix = parseInt(expirationParam, 10);

            // Chuyển đổi thời gian hết hạn từ Unix timestamp thành đối tượng moment
            const expirationTime = moment.unix(expirationTimeUnix);

            // So sánh thời gian hiện tại với thời gian hết hạn
            if (currentTime.isBefore(expirationTime)) {
                setVerifying(true);

                console.log('Thời gian hiện tại còn hợp lệ.');

            } else {
                console.log('Thời gian hiện tại đã hết hạn.');
            }
        }
    }, []);

    const { handleChange, values, resetForm, handleBlur, touched, isValid, errors, setFieldValue, } = useFormik({
        initialValues: {
            password: '',
            repassword: '',
            email: '',
        },
        validationSchema: RegisterValidations
    });


    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!errors.password && !errors.repassword && values.password != '') {
            // Hết lỗi, tiến hành update
        } else {
            toast({
                title: 'Error!',
                description: 'Please fill in all information and check for errors.',
                status: 'error',
                duration: 2000,
                isClosable: true
            });
            return;
        }
        try {
            const salt = "$2a$10$tpe4SRcMCzhG0xHhUFAs1.";
            const hashedOldPassword = bcrypt.hashSync(values.repassword, salt);
            console.log(values.password)
            const userDTO = {
                id: userId,
                password: hashedOldPassword,
            };
            console.log(userDTO.password)
            const response = await resetPassword(userDTO);
            console.log(response)
            if (response.data) {
                navigate('/login');
                toast({
                    title: 'Welcome Back to CLOTHIFY!',
                    description: 'Reset password successfully.',
                    status: 'success',
                    duration: 2000,
                    isClosable: true,
                });
            } else {
                toast({
                    title: 'Error!',
                    description: 'Reset password failed',
                    status: 'error',
                    duration: 2000,
                    isClosable: true,
                });
            }
        } catch (error) {

            toast({
                title: 'Error!',
                status: 'error',
                duration: 2000,
                isClosable: true,
            });
            // Xử lý lỗi ở đây nếu cần
        }
    };


    const handleSubmitpr = async (event) => {
        event.preventDefault();

        if (values.email == '' || errors.email) {
            toast({
                title: 'Error!',
                description: 'Please fill in all information and check for errors.',
                status: 'error',
                duration: 2000,
                isClosable: true
            });
            return;
        }
        try {
            const senmail = await sendmail(values.email);
            if (senmail) {
                // Gửi toast thông báo thành công
                navigate('/login')
                toast({
                    title: "Please check your email and reset your password",
                    status: "success",
                    duration: 3000, // Độ lâu hiển thị thông báo (miligiây)
                    isClosable: true,
                });
            }

        }
        catch (error) {
            // Lấy thông báo lỗi từ phản hồi
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
        <Box>
            {verifying ? (
                <Box
                    as="form"
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    width="100vw"
                    mt={5}
                    onSubmit={handleSubmit} // Use the default form submission
                >
                    <Box width={{ base: '100vw', sm: '500px' }} p={2}>
                        <Text textAlign="center" color="facebook.500" fontSize={32} fontWeight={600} mb={10}>
                            Reset Password
                        </Text>

                        <FormControl mt={3} isInvalid={touched.password && errors.password}>
                            <FormLabel fontSize={20}>Password</FormLabel>
                            <InputGroup size="md">
                                <Input
                                    name="password"
                                    pr="4.5rem"
                                    type={show ? 'text' : 'password'}
                                    placeholder="Enter New Password"
                                    onChange={handleChange}
                                    value={values.password}
                                    onBlur={handleBlur}
                                />
                                <InputRightElement width="4.5rem">
                                    <Button h="1.75rem" size="sm" variant="ghost" onClick={() => setShow(!show)}>
                                        {show ? <VisibilityOff /> : <Visibility />}
                                    </Button>
                                </InputRightElement>
                            </InputGroup>
                            {touched.password && <FormErrorMessage>{errors.password}</FormErrorMessage>}
                        </FormControl>

                        <FormControl mt={3} isInvalid={touched.repassword && errors.repassword}>
                            <FormLabel fontSize={20}>Confirm Password</FormLabel>
                            <InputGroup size="md">
                                <Input
                                    name="repassword"
                                    pr="4.5rem"
                                    type={showrp ? 'text' : 'password'}
                                    placeholder="Enter repassword"
                                    onChange={handleChange}
                                    value={values.repassword}
                                    onBlur={handleBlur}
                                />
                                <InputRightElement width="4.5rem">
                                    <Button h="1.75rem" size="sm" variant="ghost" onClick={() => setShowrp(!showrp)}>
                                        {showrp ? <VisibilityOff /> : <Visibility />}
                                    </Button>
                                </InputRightElement>
                            </InputGroup>
                            {touched.repassword && <FormErrorMessage>{errors.repassword}</FormErrorMessage>}
                        </FormControl>

                        <Button mt={5} width="100%" variant="solid" colorScheme="facebook" type="submit" disabled={!isValid}>
                            Submit
                        </Button>
                    </Box>
                </Box>
            ) : (
                <Box
                    as="form"
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    width="100vw"
                    mt={5}
                    onSubmit={handleSubmitpr} // Use the default form submission
                >
                    <Box width={{ base: '100vw', sm: '500px' }} p={2}>
                        <Text textAlign="center" color="red" fontSize={32} fontWeight={600} mb={10}>
                            The link is expired or invalid. Please re-enter your email address to receive the new link.
                        </Text>

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

                        <Button mt={5} width="100%" variant="solid" colorScheme="facebook" type="submit" disabled={!isValid}>
                            Submit
                        </Button>
                    </Box>
                </Box>

            )}
        </Box>
    );
}

export default PasswordRecovery;
