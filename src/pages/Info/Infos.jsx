import React, { useEffect, useState } from 'react';
import { Box, FormLabel, FormErrorMessage, Input, Text, InputRightElement, useToast } from '@chakra-ui/react';
import { useUserContext } from '../../contexts/UserContext';
import { getUserById, changePassword } from '../../services/UserServices';
import { Form, Row, Col, Button, Modal, Navbar, Nav, Table, Container, InputGroup, FormControl } from 'react-bootstrap';
import { FaEdit, FaPhone, FaEnvelope, FaDollarSign } from 'react-icons/fa';
import '../Info/Style.css';
import Avatar from '@mui/material/Avatar';





/* src/index.css */

export const Infos = () => {
    const { currentUser } = useUserContext(); //Lấy user đã đăng nhập ở đây
    const [user, setUser] = useState({});
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [expanded, setExpanded] = useState(false);



    useEffect(() => {
        // Lấy thông tin user bằng cách gọi API getUserById(currentUser.id)
        getUserByIdAsync(currentUser.id);
    }, []);

    const getUserByIdAsync = async (id) => {
        var res = await getUserById(id);
        console.log(res);
        setUser(res.result);
    };

    const gender = user.gender ? "female" : "male";
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

    return (
        <Box>
            {/* <Text p={5} textAlign='center' fontSize={30} fontWeight={300} color='facebook.500' >My Informations</Text> */}
            {/* <Box display='flex' flexDirection={{ base: 'column', md: 'row' }} >
      
              <Box width='100%' display='flex' flexDirection='column' alignItems='center'  >
                <Text p={5} textAlign='center' fontSize={22} fontWeight={500} color='facebook.500' >Address{address}</Text>
                <Textarea mb={5} height={150} maxWidth={500} resize='none' placeholder='Please write your address...' value={address} onInput={onInputAddress} ></Textarea>
                <Button colorScheme='facebook' onClick={onClickSave} >Save</Button>
              </Box>
      
              <Center height={300} mt={5} mx={3} display={{ base: 'none', md: 'block' }} >
                <Divider orientation='vertical' />
              </Center>
              <Box width='100%' display='flex' flexDirection='column' alignItems='center' >
                <Text p={5} textAlign='center' fontSize={22} fontWeight={500} color='facebook.500' >Phone: </Text>
                <InputGroup maxWidth={300} marginX='auto' >
                  <InputLeftElement
                    pointerEvents='none'
                    children={<Phone color='gray.300' />}
                  />
                  <Input maxLength={11} type='tel' placeholder='Phone number' value={phone} onInput={onInputPhone} />
                </InputGroup>
                <Button mt={5} colorScheme='facebook' onClick={onClickSave} >Save</Button>
              </Box>
            </Box> */}

            {/* <Form className='formDetail'>
              <Row>
                <Col>
                  <EditableField label="FullName" field="fullName" initialValue={user?.fullName} />
                </Col>
      
                <Col>
                  <EditableField label="Address" field="address" initialValue={user?.address} />
                </Col>
              </Row>
              <Row>
                <Col>
                  <EditableField label="Phone" field="phone" initialValue={user?.phone} />
                </Col>
      
                <Col>
                  <EditableField label="Birth Day" field="dateOfBirth" initialValue={user?.dateOfBirth} />
                </Col>
              </Row>
              <div className="App">
                <Button variant="primary" onClick={handleOpenModal}>
                  Thay đổi mật khẩu
                </Button>
                <ChangePasswordModal isOpen={isModalOpen} onClose={handleCloseModal} />
              </div>
            </Form> */}


            <Row>
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
                    <Row responsive className='custom-table' >
                        <Col sm={3}>
                            <div >
                                <img src={`https://localhost:5000/${user.avatar}`} alt="" className="avatar-image" />
                                {/* <Avatar alt="User Avatar" src={`https://localhost:5000/${user.avatar}`} /> */}
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

                    <Container>
                        <h1 className="mb-4">Update Basic Information</h1>
                        <Form>
                            <Row className="mb-3">
                                <Form.Group as={Col} controlId="fullName">
                                    <Form.Label>Full Name:</Form.Label>
                                    <InputGroup>
                                        <FormControl
                                            type="text"
                                            name="fullName"
                                            value={user.fullName}
                                        />
                                    </InputGroup>
                                </Form.Group>
                            </Row>
                            <Row className="mb-3">
                                <Form.Group as={Col} controlId="gender">
                                    <Form.Label>Gender:</Form.Label>
                                    <InputGroup>
                                        <FormControl
                                            type="text"
                                            name="gender"
                                            value={gender}
                                        />
                                    </InputGroup>
                                </Form.Group>
                            </Row>
                            <Row className="mb-3">
                                <Form.Group as={Col} controlId="phone">
                                    <Form.Label>Phone:</Form.Label>
                                    <InputGroup>
                                        <FormControl
                                            type="text"
                                            name="phone"
                                            value={user.phone}
                                        />
                                    </InputGroup>
                                </Form.Group>
                            </Row>
                            <Row className="mb-3">
                                <Form.Group as={Col} controlId="birthday">
                                    <Form.Label>BirthDay:</Form.Label>
                                    <InputGroup>
                                        <FormControl
                                            type="text"
                                            name="birthday"
                                            value={user.dateOfBirth}
                                        />
                                    </InputGroup>
                                </Form.Group>
                            </Row>
                            <Row className="mb-3">
                                <Form.Group as={Col} controlId="address">
                                    <Form.Label>Address:</Form.Label>
                                    <InputGroup>
                                        <FormControl
                                            type="text"
                                            name="address"
                                            value={user.address}
                                        />
                                    </InputGroup>
                                </Form.Group>
                            </Row>
                            <Button variant="primary" type="submit">
                                Submit
                            </Button>
                        </Form>
                    </Container>

                    <div className="custom-table">
                        <div className="section-header">
                            <h1 className="section-title">Basic Information</h1>

                        </div>
                        <div className="table-content">
                            <div className="info-row">
                                <span className="bold">Full Name:</span>
                                <span className="info-value">{user.fullName}</span>
                                {/* <p size={20} className="" /> */}
                            </div>
                            <div className="info-row">
                                <span className="bold">Gender   :</span>
                                <span className="info-value">{gender}</span>
                                {/* <p size={20} className="" /> */}
                            </div>
                            <div className="info-row">
                                <span className="bold">Email    :</span>
                                <span className="info-value">{user.email}</span>
                                <p size={20} className="" />

                            </div>
                            <div className="info-row">
                                <span className="bold">Phone    :</span>
                                <span className="info-value">{user.phone}</span>
                                <p size={20} className="" />

                            </div>
                            <div className="info-row">
                                <span className="bold">BirthDay :</span>
                                <span className="info-value">{user.dateOfBirth}</span>
                                <p size={20} className="" />

                            </div>
                            <div className="info-row">
                                <span className="bold">Address  :</span>
                                <span className="info-value">{user.address}</span>
                                <p size={20} className="" />
                            </div>
                        </div>
                    </div>

                    <div className="section-header">
                        <h2 className="section-title">Delivery Address</h2>
                    </div>
                    <Table hover responsive className='custom-table'>
                        <tbody>
                            <tr>
                                <td className="bold">Address</td>
                                <td>{user.address}</td>
                                <td className="arrow-left"> <FaEdit size={20} className="mr-2" /> </td>
                            </tr>
                            <tr>
                                <td className="bold">Address</td>
                                <td>{user.address}</td>
                                <td className="arrow-left"> <FaEdit size={20} className="mr-2" /> </td>
                            </tr>
                        </tbody>
                    </Table>
                </Col>
            </Row>
        </Box>

    );

};


export default Infos;