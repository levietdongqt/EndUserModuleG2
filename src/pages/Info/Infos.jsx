import React, { useEffect, useState } from 'react';
import {
    Box, FormLabel, FormErrorMessage, Input, Text, InputRightElement, useToast, Avatar, AvatarBadge, AvatarGroup, Heading, Flex, Container,
    InputGroup, InputLeftAddon, Button, Radio, RadioGroup, Grid, GridItem, Stack, HStack, VStack, SimpleGrid, Icon,
} from '@chakra-ui/react';
import { ViewOffIcon, ViewIcon } from '@chakra-ui/icons';
import { useUserContext } from '../../contexts/UserContext';
import { getUserById, changePassword, updateUser } from '../../services/UserServices';
import { Form, Row, Col, Modal, Navbar, Nav, Table, FormControl } from 'react-bootstrap';
import { FaEdit, FaPhone, FaEnvelope, FaDollarSign, } from 'react-icons/fa';
import { useFormik } from 'formik';
import RegisterValidations from '../../validations/RegisterValidations';
import '../Info/Style.css';
import { BrowserRouter as Router, Route, Link, Switch } from 'react-router-dom';
import { forwardRef } from 'react';





const Infos = () => {
    const { currentUser } = useUserContext(); //Lấy user đã đăng nhập ở đây
    const [user, setUser] = useState({});
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [expanded, setExpanded] = useState(false);
    const [editedUser, setEditedUser] = useState({
        fullName: "", // Set an initial value to avoid undefined
        gender: "",
        phone: "",
        dateOfBirth: "",
        address: "",
        avatar: null,
    });
    const [isEditing, setIsEditing] = useState(true);
    const toast = useToast();
    const [activeTab, setActiveTab] = useState('PERSONAL');
    const [checkUpdate, setCheckUpdate] = useState(0);
    const gender = user.gender === null ? "" : user.gender ? "Male" : "Female";


    //CALL GET USER BY ID
    useEffect(() => {
        const getUserByIdAsync = async (id) => {
            const res = await getUserById(id);
            setUser(res.result);
        };

        // Kiểm tra currentUser trước khi gọi API
        if (currentUser) {
            getUserByIdAsync(currentUser.id);
        }

        setEditedUser({
            fullName: user.fullName || "", // Set fullName to an empty string if undefined
            gender: user.gender || "",
            phone: user.phone || "",
            dateOfBirth: user.dateOfBirth || "",
            address: user.address || "",
            avatar: null,
        });


    }, [checkUpdate, isEditing]);
    console.log(user.fullName)


    console.log("editname:", editedUser.fullName)



    //#region  SET NAV TAB
    const handleTabChange = (tab) => {
        setActiveTab(tab);
    };
    //#endregion

    //#region SHOW UPDATE FORM
    const handleEditClick = () => {
        setIsEditing(false);
    };
    const handleCancel = () => {
        setIsEditing(true);
    };
    //#endregion 

    //#region UPDATE AVATAR 
    const [selectedImage, setSelectedImage] = useState(null);

    //click vào đổi ảnh
    const handleImageClick = () => {
        document.getElementById('imageInput').click();
    };

    const handleImageChange = (event) => {
        const file = event.target.files[0];
        const imageUrl = URL.createObjectURL(file);
        setSelectedImage(imageUrl);
        if (file) {
            setEditedUser({
                ...editedUser,
                avatar: file,
            });
            console.log("lấy dc form data")
        }

    };

    const handleDrop = (event) => {
        event.preventDefault();
        const file = event.dataTransfer.files[0];
        const imageUrl = URL.createObjectURL(file);
        setSelectedImage(imageUrl);
        if (file) {
            setEditedUser({
                ...editedUser,
                avatar: file,
            });
        }
    };

    const allowDrop = (event) => {
        event.preventDefault();
    };
    //#endregion

    //#region HANDLE UPDATE FORM
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditedUser({
            ...editedUser,
            [name]: value,
        });
    };

    const handleGenderChange = (value) => {
        setEditedUser({
            ...editedUser,
            gender: value === true, // Convert value (boolean) to true/false
        });
    };


    const handleSubmit = async (e) => {
        e.preventDefault();


        if (!errors.fullName && !errors.phone && !errors.dateOfBirth && !errors.address) {
            // Hết lỗi, tiến hành update
        } else {
            toast({
                title: 'Error!',
                description: 'There are validation errors in the form. Please check the fields.',
                status: 'error',
                duration: 2000,
                isClosable: true
            });
            return;
        }

        const formData = new FormData();
        // Thêm các trường dữ liệu vào FormData
        formData.append("id", currentUser.id);
        formData.append("fullName", editedUser.fullName);
        formData.append("gender", values.gender);
        formData.append("phone", editedUser.phone);
        formData.append("dateOfBirth", editedUser.dateOfBirth);
        formData.append("address", editedUser.address);
        formData.append("role", currentUser.role);
        formData.append("status", currentUser.status);


        // Kiểm tra xem có hình ảnh mới được chọn không và thêm nó vào FormData nếu có
        if (editedUser.avatar) {
            formData.append("formFile", editedUser.avatar);
        }

        try {
            // Gọi hàm updateUser để cập nhật thông tin người dùng sử dụng FormData
            const update = await updateUser(formData);
            toast({
                title: 'SUCCESSFULLY',
                description: 'You have successfully updatted your information.',
                status: 'success',
                duration: 2000,
                isClosable: true
            });
            setCheckUpdate(checkUpdate + 1);
            setIsEditing(true);

            console.log("Thông tin cập nhật thành công:", editedUser);
        } catch (error) {
            toast({
                title: 'Error!',
                description: 'Error updatted your information.',
                status: 'error',
                duration: 2000,
                isClosable: true
            });

            console.error("Lỗi khi cập nhật thông tin:", error);
        }
    };

    //#endregion

    //#region date, month , years format function
    function formatDateToISO(dateString) {
        if (!dateString) {
            return null;
        }
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');

        return `${day}-${month}-${year}`;
    }
    // call formatDateToISO 
    const fmDateInfo = formatDateToISO(user.dateOfBirth);
    //#endregion

    //#region HANDEL UPDATE PASSWORD
    const handleNavToggle = () => {
        setExpanded(!expanded);
    };

    const handleOpenModal = () => {
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    // Change Password
    function ChangePasswordModal({ isOpen, onClose }) {
        const [oldPassword, setOldPassword] = useState('');
        const [newPassword, setNewPassword] = useState('');
        const [confirmPassword, setConfirmPassword] = useState('');
        const [error, setError] = useState(null);
        const [showOldPassword, setShowOldPassword] = useState(false);
        const [showNewPassword, setShowNewPassword] = useState(false);
        const [showConfirmPassword, setShowConfirmPassword] = useState(false);

        const handleSave = async () => {
            if (newPassword !== confirmPassword) {
                setError('Confirmation password does not match.');
                return;
            }
            user.oldPassword = oldPassword;
            user.newPassword = newPassword;

            try {
                console.log(user.id, user.oldPassword, user.newPassword);

                const result = await changePassword(user);
                toast({
                    title: 'SUCCESSFULLY',
                    description: 'You have successfully change your password.',
                    status: 'success',
                    duration: 2000,
                    isClosable: true
                });
                // Xử lý kết quả thành công
                // alert('Mật khẩu đã được thay đổi thành công.');
            } catch (error) {
                // Xử lý lỗi
                toast({
                    title: 'Error!',
                    description: 'Error change your password.',
                    status: 'error',
                    duration: 2000,
                    isClosable: true
                });
                // alert('Thay đổi mật khẩu thất bại. Vui lòng kiểm tra lại mật khẩu cũ.');
            }

            // Đặt lại các trường nhập liệu và đóng modal
            setOldPassword('');
            setNewPassword('');
            setConfirmPassword('');
            setError(null);
            onClose();
        };
        return (
            <Modal show={isOpen} onHide={onClose}>
                <Modal.Header closeButton>
                    <Modal.Title color={'facebook.500'}>   CHANGE PASSWORD</Modal.Title>
                </Modal.Header>
                <section className="modal-card-body">
                    {/* Hiển thị thông báo lỗi nếu có */}
                    {error && <div className="notification is-danger">{error}</div>}
                    {/* Các trường nhập liệu và nút Lưu */}
                </section>
                <Modal.Body>
                    <Form>
                        <Form.Group controlId="oldPassword">
                            <Form.Label style={{ fontWeight: "bold", color: "blue" }}>Old Password</Form.Label>
                            <InputGroup size="md">
                                <Input
                                    type={showOldPassword ? "text" : "password"}
                                    placeholder="Enter Old Password"
                                    value={oldPassword}
                                    onChange={(e) => setOldPassword(e.target.value)}
                                />
                                <InputRightElement width="4.5rem">
                                    <Button
                                        h="1.75rem"
                                        size="sm"
                                        variant="ghost"
                                        onClick={() => setShowOldPassword(!showOldPassword)}
                                        _hover={{ color: "blue.500" }}
                                    >
                                        {showOldPassword ? <ViewOffIcon /> : <ViewIcon />}
                                    </Button>
                                </InputRightElement>
                            </InputGroup>
                        </Form.Group>
                        <Form.Group controlId="newPassword">
                            <Form.Label style={{ fontWeight: "bold", color: "blue" }}>New Password</Form.Label>
                            <InputGroup size="md">
                                <Input
                                    type={showNewPassword ? "text" : "password"}
                                    placeholder="Enter New Password"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                />
                                <InputRightElement width="4.5rem">
                                    <Button
                                        h="1.75rem"
                                        size="sm"
                                        variant="ghost"
                                        onClick={() => setShowNewPassword(!showNewPassword)}
                                        _hover={{ color: "blue.500" }}
                                    >
                                        {showNewPassword ? <ViewOffIcon /> : <ViewIcon />}
                                    </Button>
                                </InputRightElement>
                            </InputGroup>
                        </Form.Group>
                        <Form.Group controlId="confirmPassword">
                            <Form.Label style={{ fontWeight: "bold", color: "blue" }}>Confirm new Password</Form.Label>
                            <InputGroup size="md">
                                <Input
                                    type={showConfirmPassword ? "text" : "password"}
                                    placeholder="Enter Confirm New Password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                />
                                <InputRightElement width="4.5rem">
                                    <Button
                                        h="1.75rem"
                                        size="sm"
                                        variant="ghost"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        _hover={{ color: "blue.500" }}
                                    >
                                        {showConfirmPassword ? <ViewOffIcon /> : <ViewIcon />}
                                    </Button>
                                </InputRightElement>
                            </InputGroup>
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button
                        variant="secondary"
                        onClick={onClose}
                        background="red" // Màu nền tùy chỉnh
                        color="white" // Màu chữ tùy chỉnh
                        _hover={{ background: "blue.500" }} // Hiệu ứng màu khi hover
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="primary"
                        onClick={handleSave}
                        background="green" // Màu nền tùy chỉnh
                        color="white" // Màu chữ tùy chỉnh
                        _hover={{ background: "blue.500" }} // Hiệu ứng màu khi hover
                    >

                        Save
                    </Button>
                </Modal.Footer>


            </Modal>


        );
    }
    //#endregion

    //#region FORMIK VALIDATION
    const { handleChange, handleBlur, touched, isValid, errors, values, setErrors, setFieldValue } = useFormik({
        initialValues: {
            // Khai báo các giá trị mặc định cho các trường dữ liệu ở đây
            fullName: editedUser.fullName || "Please update Full Name",
            gender: editedUser.gender || true,
            phone: editedUser.phone || "00000000000",
            address: editedUser.address || "Please update Address",
            dateOfBirth: editedUser.dateOfBirth || new Date(new Date().getFullYear() - 14, 0, 1).toISOString().split('T')[0],
        },
        validationSchema: RegisterValidations

    });
    //#endregion



    const customLinks = document.querySelectorAll('.custom-link');

    customLinks.forEach(link => {
        link.addEventListener('click', () => {
            link.blur();
        });


    });



    return (
        <Box>
            {/* <Row> */}
            <Flex>
                {/* NAVBAR */}
                <Box flex="0 0 auto" width="20%" overflowY="auto" pt={8}>
                    <Navbar bg="" variant="" expand="lg" className="navbar flex-column">
                        <Navbar.Toggle aria-controls="responsive-navbar-nav" onClick={handleNavToggle} />
                        <Navbar.Collapse id="responsive-navbar-nav" className={expanded ? 'show' : ''}>
                            <Nav className="flex-column">
                                <Nav.Link
                                    href=""
                                    className={`custom-link ${activeTab === 'PERSONAL' ? 'focused' : ''}`}
                                    onClick={() => handleTabChange('PERSONAL')}
                                >
                                    PERSONAL INFORMATION
                                </Nav.Link>
                                <Nav.Link
                                    onClick={handleOpenModal}
                                    className="custom-link-pass"
                                >
                                    CHANGE PASSWORD
                                </Nav.Link>
                                <ChangePasswordModal isOpen={isModalOpen} onClose={handleCloseModal} />

                                <Nav.Link
                                    href=""
                                    className={`custom-link ${activeTab === 'DELIVRERY' ? 'focused' : ''}`}
                                    onClick={() => handleTabChange('DELIVRERY')}
                                >
                                    DELIVRERY ADDRESS
                                </Nav.Link>

                                <Nav.Link
                                    href=""
                                    className={`custom-link ${activeTab === 'TRANSACTION' ? 'focused' : ''}`}
                                    onClick={() => handleTabChange('TRANSACTION')}
                                >
                                    TRANSACTION HISTORY
                                </Nav.Link>

                                <Nav.Link
                                    href=""
                                    className={`custom-link ${activeTab === 'IMAGES' ? 'focused' : ''}`}
                                    onClick={() => handleTabChange('IMAGES')}
                                >
                                    MY IMAGES
                                </Nav.Link>

                            </Nav>
                        </Navbar.Collapse>
                    </Navbar>
                </Box>

                <Box flex="1" width="60% " overflowY="auto" >

                    {/* USER CARD */}
                    <Container
                        borderWidth="1px"
                        borderRadius="lg"
                        p={4}
                        maxW="100%"
                        mx="auto"
                        boxShadow="lg"
                        width={{ base: '100%', sm: '90%' }}
                        display="flex"
                        flexDirection={{ base: 'column', sm: 'row' }}
                        alignItems="center"
                        marginTop="3"
                    >
                        <Box
                            width={{ base: '100%', sm: '30%' }}
                            display="flex"
                            alignItems="center"
                            justifyContent="center"
                        >
                            <Avatar size="2xl" src={`${process.env.REACT_APP_API_BASE_URL_LOCAL}${user.avatar}`} />
                        </Box>
                        <Box
                            width={{ base: '100%', sm: '70%' }}
                            marginLeft={{ sm: '4' }}
                        >
                            <div className="container">
                                <Text fontSize="2xl" fontWeight="bold" mb={2} textAlign={{ base: 'center', sm: 'left' }}>
                                    {user.fullName}
                                </Text>
                                <Flex >
                                    <Icon as={FaPhone} boxSize={6} color={'facebook.500'} />
                                    <Text fontSize="lg" marginLeft="1">{user.phone}</Text>
                                    <Icon as={FaEnvelope} boxSize={6} color={'facebook.500'} marginLeft={4} />
                                    <Text fontSize="lg" marginLeft="1">{user.email}</Text>
                                </Flex>
                                <Flex width="100%" justifyContent="flex-start">
                                    <Icon as={FaDollarSign} boxSize={6} color={'facebook.500'} />
                                    <Text fontSize="xl" fontWeight="bold" >
                                        Total Transaction:
                                    </Text>
                                    <Text fontSize="xl" fontWeight="bold" marginLeft="1" color="red">9</Text>
                                </Flex>
                            </div>
                        </Box>
                    </Container>
                    {activeTab === 'PERSONAL' && (
                        <Box>
                            {isEditing ?
                                (
                                    < Box borderWidth="1px" borderRadius="lg" p={4} maxW="100%" mx="auto" boxShadow="lg" width={{ base: '100%', sm: '90%' }} marginTop="5">
                                        <Flex alignItems="center" justifyContent="flex-end" mb={2}>
                                            <FaEdit size={20} cursor="pointer" onClick={handleEditClick} />
                                        </Flex>
                                        <Heading textAlign='center' color={'facebook.500'} fontSize={32} fontWeight={600} mb={10}>
                                            Basic Information
                                        </Heading>
                                        <Flex alignItems="center" mb={2}>
                                            <Text fontWeight="bold" flex="1">
                                                Full Name:
                                            </Text>
                                            <Text flex="3">{user.fullName}</Text>
                                        </Flex>
                                        <Flex alignItems="center" mb={2}>
                                            <Text fontWeight="bold" flex="1">
                                                Gender:
                                            </Text>
                                            <Text flex="3">{gender}</Text>
                                        </Flex>
                                        <Flex alignItems="center" mb={2}>
                                            <Text fontWeight="bold" flex="1">
                                                Email:
                                            </Text>
                                            <Text flex="3">{user.email}</Text>
                                        </Flex>
                                        <Flex alignItems="center" mb={2}>
                                            <Text fontWeight="bold" flex="1">
                                                Phone:
                                            </Text>
                                            <Text flex="3">{user.phone}</Text>
                                        </Flex>
                                        <Flex alignItems="center" mb={2}>
                                            <Text fontWeight="bold" flex="1">
                                                BirthDay:
                                            </Text>
                                            <Text flex="3">{fmDateInfo}</Text>
                                        </Flex>
                                        <Flex alignItems="center" mb={2}>
                                            <Text fontWeight="bold" flex="1">
                                                Address:
                                            </Text>
                                            <Text flex="3">{user.address}</Text>
                                        </Flex>
                                    </Box>

                                ) : (

                                    < Box borderWidth="1px" borderRadius="lg" p={4} maxW="100%" mx="auto" boxShadow="lg" width={{ base: '100%', sm: '90%' }} marginTop="5">
                                        <Heading textAlign='center' color={'facebook.500'} fontSize={32} fontWeight={600} mb={10}>
                                            Update Basic Information
                                        </Heading>
                                        <Box as="form" onSubmit={handleSubmit} >

                                            <InputGroup mb={3} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }} onDrop={handleDrop}
                                                onDragOver={allowDrop}>
                                                <Avatar
                                                    size="2xl"
                                                    name=""
                                                    src={selectedImage || `${process.env.REACT_APP_API_BASE_URL_LOCAL}${user.avatar}`}
                                                    onClick={handleImageClick}
                                                    cursor="pointer"
                                                    draggable="true"
                                                />
                                                <input
                                                    id="imageInput"
                                                    type="file"
                                                    style={{ display: 'none' }}
                                                    onChange={handleImageChange}
                                                />
                                            </InputGroup>


                                            <InputGroup mb={3} isInvalid={touched.fullName && errors.fullName}>
                                                <InputLeftAddon w="120px">Full Name:</InputLeftAddon>
                                                <Input
                                                    type="text"
                                                    name="fullName"
                                                    value={editedUser.fullName}
                                                    onChange={(e) => {
                                                        handleChange(e);
                                                        handleInputChange(e);
                                                    }}
                                                    onBlur={handleBlur}
                                                />
                                            </InputGroup>
                                            {touched.fullName && errors.fullName && (
                                                <div style={{ color: 'red' }}>{errors.fullName}</div>
                                            )}

                                            <InputGroup mb={3} isInvalid={touched.gender && errors.gender}>
                                                <InputLeftAddon w="120px">Gender:</InputLeftAddon>
                                                <RadioGroup
                                                    name="gender"
                                                    value={values.gender}
                                                    onChange={handleChange}
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
                                            {touched.gender && errors.gender && (
                                                <div style={{ color: 'red' }}>{errors.gender}</div>
                                            )}

                                            <InputGroup mb={3} isInvalid={touched.phone && errors.phone}>
                                                <InputLeftAddon w="120px">Phone:</InputLeftAddon>
                                                <Input
                                                    type="text"
                                                    name="phone"
                                                    value={editedUser.phone}
                                                    onChange={(e) => {
                                                        handleChange(e);
                                                        handleInputChange(e);
                                                    }}
                                                    onBlur={handleBlur}
                                                />
                                            </InputGroup>
                                            {touched.phone && errors.phone && (
                                                <div style={{ color: 'red' }}>{errors.phone}</div>
                                            )}


                                            <InputGroup mb={3} isInvalid={touched.dateOfBirth && errors.dateOfBirth}>
                                                <InputLeftAddon w="120px">BirthDay:</InputLeftAddon>
                                                <Input
                                                    type="date"
                                                    name="dateOfBirth"
                                                    value={editedUser.dateOfBirth}
                                                    onChange={(e) => {
                                                        handleChange(e);
                                                        handleInputChange(e);
                                                    }}
                                                    onBlur={handleBlur}

                                                />
                                            </InputGroup>
                                            {touched.dateOfBirth && errors.dateOfBirth && (
                                                <div style={{ color: 'red' }}>{errors.dateOfBirth}</div>
                                            )}


                                            <InputGroup mb={3} isInvalid={touched.address && errors.address}>
                                                <InputLeftAddon w="120px">Address:</InputLeftAddon>
                                                <Input
                                                    type="text"
                                                    name="address"
                                                    value={editedUser.address}
                                                    onChange={(e) => {
                                                        handleChange(e);
                                                        handleInputChange(e);
                                                    }}
                                                    onBlur={handleBlur}
                                                />
                                            </InputGroup>
                                            {touched.address && errors.address && (
                                                <div style={{ color: 'red' }}>{errors.address}</div>
                                            )}


                                            <Button colorScheme="blue" type="submit" >
                                                Save
                                            </Button>

                                            <Button colorScheme="gray" ml={3} onClick={handleCancel}>
                                                Cancel
                                            </Button>

                                            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>



                                            </div>
                                        </Box>
                                    </Box>

                                )}
                        </Box>
                    )}
                    {activeTab === 'TRANSACTION' && (
                        <Box>
                            {isEditing ?
                                (
                                    < Box borderWidth="1px" borderRadius="lg" p={4} maxW="100%" mx="auto" boxShadow="lg" width={{ base: '100%', sm: '90%' }} marginTop="5">

                                    </Box>

                                ) : (

                                    < Box borderWidth="1px" borderRadius="lg" p={4} maxW="100%" mx="auto" boxShadow="lg" width={{ base: '100%', sm: '90%' }} marginTop="5">
                                        <Heading textAlign='center' color={'facebook.500'} fontSize={32} fontWeight={600} mb={10}>
                                            Update TRANSACTION HISTORY
                                        </Heading>

                                    </Box>

                                )}
                        </Box>
                    )}
                    {activeTab === 'IMAGES' && (
                        <div>MY IMAGES</div>
                    )}

                </Box>
            </Flex >
        </Box >

    );

};


export default Infos;