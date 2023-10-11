import React, { useEffect, useState } from 'react';
import {
    Box, FormLabel, FormErrorMessage, Input, Text, InputRightElement, useToast, Avatar, AvatarBadge, AvatarGroup, Heading, Flex, Container,
    InputGroup, InputLeftAddon, Button, Radio, RadioGroup, Grid, GridItem, Stack, HStack, VStack, useRadio, useRadioGroup,
} from '@chakra-ui/react';
import { useUserContext } from '../../contexts/UserContext';
import { getUserById, changePassword, updateUser } from '../../services/UserServices';
import { Form, Row, Col, Modal, Navbar, Nav, Table, FormControl } from 'react-bootstrap';
import { FaEdit, FaPhone, FaEnvelope, FaDollarSign } from 'react-icons/fa';
import '../Info/Style.css';







export const Infos = () => {
    const { currentUser } = useUserContext(); //Lấy user đã đăng nhập ở đây
    const [user, setUser] = useState({});
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [expanded, setExpanded] = useState(false);
    const gender = user.gender ? "Female" : "Male";



    useEffect(() => {
        // Lấy thông tin user bằng cách gọi API getUserById(currentUser.id)
        getUserByIdAsync(currentUser.id);
    }, []);


    //GET BY ID
    const getUserByIdAsync = async (id) => {
        var res = await getUserById(id);
        console.log(res);
        setUser(res.result);
    };

    //#region UPDATE AVATAR 
    // UPDATE AVATAR 
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

    // END UPDATE AVATAR 
    //#endregion


    //#region HANDLE UPDATE FORM
    // 
    const [editedUser, setEditedUser] = useState({
        fullName: user.fullName,
        gender: gender,
        phone: user.phone,
        dateOfBirth: user.dateOfBirth,
        address: user.address,
        avatar: null,
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditedUser({
            ...user,
            [name]: value,
        });
    };

    const handleGenderChange = (value) => {
        setEditedUser({
            ...editedUser,
            gender: value,
        });
    };
    console.log(editedUser.fullName)
    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log(editedUser.avatar)
        const updatedValues = {
            ...user,
            ...(editedUser.avatar ? { formFile: editedUser.avatar } : {}),
            fullName: editedUser.fullName,
            gender: editedUser.gender === "Male",
            phone: editedUser.phone,
            dateOfBirth: editedUser.dateOfBirth,
            address: editedUser.address,
        };
        console.log(updatedValues.formFile)
        const userDTO = {
            id: currentUser.id,
            ...updatedValues,

        };

        console.log("inavatar", userDTO.formFile)
        try {
            // Gọi hàm updateUser để cập nhật thông tin người dùng
            await updateUser(userDTO);

            // Nếu cập nhật thành công, bạn có thể thực hiện các hành động khác ở đây
            console.log("Thông tin cập nhật thành công:", editedUser);
        } catch (error) {
            // Xử lý lỗi nếu có
            console.error("Lỗi khi cập nhật thông tin:", error);
        }
    };
    //#endregion

    //#region date, month , years format function

    //date, month , years format function
    function formatDateToISO(dateString) {
        if (!dateString) {
            return null;
        }

        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');

        return `${year}-${month}-${day}`;
    }
    // call formatDateToISO 
    const formattedDate = formatDateToISO(editedUser.dateOfBirth);

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

        const handleSave = async () => {
            if (newPassword !== confirmPassword) {
                setError('Mật khẩu xác nhận không khớp.');
                return;
            }
            user.oldPassword = oldPassword;
            user.newPassword = newPassword;

            try {
                console.log(user.id, user.oldPassword, user.newPassword);

                const result = await changePassword(user);
                console.log(result);
                // Xử lý kết quả thành công
                alert('Mật khẩu đã được thay đổi thành công.');
            } catch (error) {
                // Xử lý lỗi
                alert('Thay đổi mật khẩu thất bại. Vui lòng kiểm tra lại mật khẩu cũ.');
            }

            // Đặt lại các trường nhập liệu và đóng modal
            setOldPassword('');
            setNewPassword('');
            setConfirmPassword('');
            onClose();
        };
        return (
            <Modal show={isOpen} onHide={onClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Thay đổi mật khẩu</Modal.Title>
                </Modal.Header>
                <section className="modal-card-body">
                    {/* Hiển thị thông báo lỗi nếu có */}
                    {error && <div className="notification is-danger">{error}</div>}
                    {/* Các trường nhập liệu và nút Save */}
                </section>
                <Modal.Body>
                    <Form>
                        <Form.Group controlId="oldPassword">
                            <Form.Label>Mật khẩu cũ</Form.Label>
                            <Form.Control
                                type="password"
                                placeholder="Nhập mật khẩu cũ"
                                value={oldPassword}
                                onChange={(e) => setOldPassword(e.target.value)} />
                        </Form.Group>
                        <Form.Group controlId="newPassword">
                            <Form.Label>Mật khẩu mới</Form.Label>
                            <Form.Control
                                type="password"
                                placeholder="Nhập mật khẩu mới"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)} />
                        </Form.Group>
                        <Form.Group controlId="confirmPassword">
                            <Form.Label>Xác nhận mật khẩu mới</Form.Label>
                            <Form.Control
                                type="password"
                                placeholder="Nhập lại mật khẩu mới"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)} />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={onClose}>
                        Đóng
                    </Button>
                    <Button variant="primary" onClick={handleSave}>
                        Lưu thay đổi
                    </Button>
                </Modal.Footer>
            </Modal>
        );
    }
    //#endregion

    // const EditableField = ({ label, field, initialValue }) => {
    //     const [isEditing, setIsEditing] = useState(false);
    //     const [editedValue, setEditedValue] = useState(initialValue);
    //     const handleEditClick = useCallback(() => {
    //         setIsEditing(true);
    //     }, []);


    //     const handleSaveClick = useCallback(async () => {
    //         try {
    //             const updatedValues = {
    //                 ...user,
    //                 [field]: editedValue,
    //             };
    //             const userDTO = {
    //                 id: currentUser.id,
    //                 ...updatedValues,
    //             };
    //             const updatedUser = await updateUser(userDTO);
    //             console.log('Updated user:', updatedUser);
    //             setUser(updatedValues);
    //             setIsEditing(false);
    //         } catch (error) {
    //             console.error('Update user error:', error.message);
    //         }
    //     }, [currentUser.id, field, editedValue, user]);

    //     const handleCancelClick = useCallback(() => {
    //         setIsEditing(false);
    //         setEditedValue(initialValue);
    //     }, [initialValue]);


    //     const renderField = () => {
    //         if (field === 'dateOfBirth') {
    //             return (
    //                 <Form.Control
    //                     type="date"
    //                     value={editedValue}
    //                     onChange={(e) => setEditedValue(e.target.value)}
    //                     autoFocus  // Add autoFocus to focus the input field
    //                     style={{ border: 'none', outline: 'none' }} // Remove border and outline
    //                 />
    //             );
    //         }
    //         // Mặc định sử dụng trường nhập văn bản
    //         return (
    //             <Form.Control
    //                 type="text"
    //                 value={editedValue}
    //                 onChange={(e) => setEditedValue(e.target.value)}
    //                 autoFocus  // Add autoFocus to focus the input field
    //                 style={{ border: 'none', outline: 'none' }} // Remove border and outline
    //             />
    //         );
    //     };
    //     return (
    //         <Form.Group as={Row} className="mb-3">
    //             <Form.Label column sm={3} className=" d-flex align-items-center">{label}</Form.Label>
    //             <Col sm={6} className="d-flex align-items-center">
    //                 {!isEditing ? (
    //                     <div className="d-flex align-items-center">
    //                         <span
    //                             onClick={handleEditClick}
    //                             className="hover-effect"
    //                             data-toggle="tooltip"
    //                             title="Click to edit"
    //                         >
    //                             {editedValue}
    //                         </span>
    //                     </div>
    //                 ) : (
    //                     <div className="d-flex align-items-center">
    //                         {renderField()}
    //                         <ButtonGroup style={{ margin: '10px' }}>
    //                             <Button
    //                                 onClick={handleSaveClick}
    //                                 className="btn-success d-flex align-items-center"
    //                             >
    //                                 <FaSave size={20} className="mr-2" /> Save
    //                             </Button>
    //                             <Button
    //                                 onClick={handleCancelClick}
    //                                 className="btn-danger d-flex align-items-center"
    //                             >
    //                                 <FaTimes size={20} className="mr-2" /> Cancel
    //                             </Button>
    //                         </ButtonGroup>
    //                     </div>
    //                 )}
    //             </Col>
    //         </Form.Group>
    //     );
    // };




    return (
        <Box>
            <Row>
                {/* NAVBAR */}
                <Col sm={3}>
                    <Navbar bg="" variant="" expand="lg" className="navbar  flex-column">
                        <Navbar.Toggle aria-controls="responsive-navbar-nav" onClick={handleNavToggle} />
                        <Navbar.Collapse id="responsive-navbar-nav" className={expanded ? 'show' : ''}>
                            <Nav className="flex-column">
                                <Nav.Link href="#inbox">PERSONAL INFORMATION</Nav.Link>
                                <div className="App">
                                    <Nav.Link href="" onClick={handleOpenModal}>CHANGE PASSWORD</Nav.Link>
                                    <ChangePasswordModal isOpen={isModalOpen} onClose={handleCloseModal} />
                                </div>
                                <Nav.Link href="#send-email">TRANSACTION HISTORY</Nav.Link>
                                <Nav.Link href="#drafts">MY IMAGES</Nav.Link>
                            </Nav>
                        </Navbar.Collapse>
                    </Navbar>
                </Col>

                <Col sm={8}>

                    {/* USER CARD */}
                    <Row responsive className='custom-table' >
                        <Col sm={3}>
                            <div >
                                {/* <img src={`https://localhost:5000/${user.avatar}`} alt="" className="avatar-image" /> */}
                                {/* <Avatar alt="User Avatar" src={`https://localhost:5000/${user.avatar}`} /> */}
                                <Avatar size='2xl' name='' src='https://localhost:5000/ ${user.avatar}' />{' '}
                            </div>
                            {console.log(user.avatar)}
                        </Col>
                        <Col sm={9}>
                            <div className='container' >
                                <span className="card-title">{user.fullName}</span>
                                {/* Thêm dữ liệu cột khác ở đây tương ứng với tiêu đề cột */}
                            </div>

                            <div responsive className="card-row">
                                <FaPhone size={20} className="icon" />
                                <span className='card-value'>{user.phone}</span>
                                <FaEnvelope size={20} className="icon" />
                                <span className='card-value'>{user.email}</span>
                            </div>

                            <div className="card-infoTran custom-table" >
                                <FaDollarSign size={20} className="icon" />
                                <span className="card-bold">Total Transaction: </span>
                                <span className=''>9</span>
                            </div>
                        </Col>
                    </Row>

                    {/* // UPDATE INFORMATION */}
                    <Container borderWidth="1px" borderRadius="lg" p={4} maxW="100%" mx="auto" boxShadow="lg">
                        <Heading textAlign='center' color={'facebook.500'} fontSize={32} fontWeight={600} mb={10}>
                            Update Basic Information
                        </Heading>
                        <Box as="form" onSubmit={handleSubmit}>


                            <InputGroup mb={3} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }} onDrop={handleDrop}
                                onDragOver={allowDrop}>
                                <Avatar
                                    size="2xl"
                                    name=""
                                    src={selectedImage || `https://localhost:5000/${user.avatar}`}
                                    onClick={handleImageClick}
                                    cursor="pointer"
                                    draggable="true"
                                />
                                <input
                                    id="imageInput"
                                    type="file"
                                    accept="image/*"
                                    style={{ display: 'none' }}
                                    onChange={handleImageChange}
                                />
                            </InputGroup>


                            <InputGroup mb={3}>
                                <InputLeftAddon>Full Name:</InputLeftAddon>
                                <Input
                                    type="text"
                                    name="fullName"
                                    value={editedUser.fullName}
                                    onChange={handleInputChange}
                                />
                            </InputGroup>

                            <InputGroup mb={3} display="flex" alignItems="center">
                                <FormControl as="fieldset" className='table-content'>
                                    <FormLabel as="legend" >Gender:</FormLabel>
                                    <RadioGroup
                                        name="gender"
                                        value={editedUser.gender}
                                        onChange={handleGenderChange}
                                    >
                                        <Radio value="male" pr={5}>Male</Radio>
                                        <Radio value="female" pr={2}>Female</Radio>
                                    </RadioGroup>
                                </FormControl>
                            </InputGroup>


                            <InputGroup mb={3}>
                                <InputLeftAddon>Phone:</InputLeftAddon>
                                <Input
                                    type="text"
                                    name="phone"
                                    value={editedUser.phone}
                                    onChange={handleInputChange}
                                />
                            </InputGroup>

                            <InputGroup mb={3}>
                                <InputLeftAddon>BirthDay:</InputLeftAddon>
                                <Input
                                    type="date"
                                    name="dateOfBirth"
                                    value={formattedDate}
                                    onChange={handleInputChange}
                                />

                            </InputGroup>
                            <InputGroup mb={3}>
                                <InputLeftAddon>Address:</InputLeftAddon>
                                <Input
                                    type="text"
                                    name="address"
                                    value={editedUser.address}
                                    onChange={handleInputChange}
                                />
                            </InputGroup>
                            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                <Button colorScheme="blue" type="submit">
                                    Save
                                </Button>
                            </div>

                        </Box>
                    </Container>


                    {/* // BASIC INFORMATION */}
                    <Box borderWidth="1px" borderRadius="lg" p={4} maxW="100%" mx="auto" boxShadow="lg">
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
                            <Text flex="3">{formattedDate}</Text>
                        </Flex>
                        <Flex alignItems="center" mb={2}>
                            <Text fontWeight="bold" flex="1">
                                Address:
                            </Text>
                            <Text flex="3">{user.address}</Text>
                        </Flex>
                    </Box>

                </Col>
            </Row>
        </Box>

    );

};


export default Infos;