import React, { useEffect, useState, useCallback } from 'react';
import { Flex, Spacer, Box, Text, Textarea, Input, InputGroup, InputLeftElement, Divider, Center, useToast, Badge } from '@chakra-ui/react';
import { Padding, Phone } from '@mui/icons-material';
import { useCookies } from 'react-cookie';
import { useUserContext } from '../contexts/UserContext';
import { getUserById, updateUser, changePassword } from '../services/UserServices';
import { Form, Row, Col, Label, Control, Button, ButtonGroup, Modal } from 'react-bootstrap';
import '../CSS/User.css';
import { FaSave, FaTimes } from 'react-icons/fa';

const Infos = () => {
  console.log("voo info")
  const { currentUser } = useUserContext();  //Lấy user đã đăng nhập ở đây
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Lấy thông tin user bằng cách gọi API getUserById(currentUser.id)
    console.log(currentUser.id)
    getUserById(currentUser.id)
      .then((res) => {
        const data = res.result;
        setUser(data); // Lưu dữ liệu user vào state
        console.log(user)
      })
      .catch((error) => {
        console.error('Error fetching user data:', error);
      });
  }, [currentUser.id]);
  const EditableField = ({ label, field, initialValue }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editedValue, setEditedValue] = useState(initialValue);


    const handleEditClick = useCallback(() => {
      setIsEditing(true);
    }, []);

    const handleSaveClick = useCallback(async () => {
      try {
        const updatedValues = {
          ...user,
          [field]: editedValue,
        };

        const userDTO = {
          id: currentUser.id,
          ...updatedValues,
        };
        const updatedUser = await updateUser(userDTO);

        console.log('Updated user:', updatedUser);
        setUser(updatedValues);
        setIsEditing(false);
      } catch (error) {
        console.error('Update user error:', error.message);
      }
    }, [currentUser.id, field, editedValue, user]);


    const handleCancelClick = useCallback(() => {
      setIsEditing(false);
      setEditedValue(initialValue);
    }, [initialValue]);


    const renderField = () => {
      if (field === 'dateOfBirth') {
        return (
          <Form.Control
            type="date"
            value={editedValue}
            onChange={(e) => setEditedValue(e.target.value)}
            autoFocus  // Add autoFocus to focus the input field
            style={{ border: 'none', outline: 'none' }} // Remove border and outline

          />
        );
      }

      // Mặc định sử dụng trường nhập văn bản
      return (
        <Form.Control
          type="text"
          value={editedValue}
          onChange={(e) => setEditedValue(e.target.value)}
          autoFocus  // Add autoFocus to focus the input field
          style={{ border: 'none', outline: 'none' }} // Remove border and outline

        />
      );
    };

    return (
      <Form.Group as={Row} className="mb-3">
        <Form.Label column sm={3} className=" d-flex align-items-center">{label}</Form.Label>

        <Col sm={6} className="d-flex align-items-center">
          {!isEditing ? (
            <div className="d-flex align-items-center">
              <span
                onClick={handleEditClick}
                className="hover-effect"
                data-toggle="tooltip"
                title="Click to edit"
              >
                {editedValue}
              </span>
            </div>
          ) : (
            <div className="d-flex align-items-center">
              {renderField()}
              <ButtonGroup style={{ margin: '10px' }}>
                <Button
                  onClick={handleSaveClick}
                  className="btn-success d-flex align-items-center"
                >
                  <FaSave size={20} className="mr-2" /> Save
                </Button>
                <Button
                  onClick={handleCancelClick}
                  className="btn-danger d-flex align-items-center"
                >
                  <FaTimes size={20} className="mr-2" /> Cancel
                </Button>
              </ButtonGroup>
            </div>
          )}
        </Col>
      </Form.Group>


    );
  };

  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

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
        console.log(user.id, user.oldPassword, user.newPassword)

        const result = await changePassword(user);
        console.log(result)
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
                onChange={(e) => setOldPassword(e.target.value)}
              />
            </Form.Group>
            <Form.Group controlId="newPassword">
              <Form.Label>Mật khẩu mới</Form.Label>
              <Form.Control
                type="password"
                placeholder="Nhập mật khẩu mới"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </Form.Group>
            <Form.Group controlId="confirmPassword">
              <Form.Label>Xác nhận mật khẩu mới</Form.Label>
              <Form.Control
                type="password"
                placeholder="Nhập lại mật khẩu mới"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
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




  // const onInputPhone = (e) => {
  //   setPhone(e.target.value);
  // };

  // const onClickSave = () => {
  //   if (phone.length === 11) {
  //     updateUser(currentUser, address, phone)
  //       .then((result) => {
  //         if (result.status) {
  //           toast({
  //             title: 'Error!',
  //             description: 'Somethings went wrong.',
  //             status: 'error',
  //             duration: 2000,
  //             isClosable: true
  //           });
  //         } else {
  //           toast({
  //             title: 'Successful!',
  //             description: 'Successfully saved.',
  //             status: 'success',
  //             duration: 2000,
  //             isClosable: true
  //           });
  //         }
  //       });
  //   } else {
  //     toast({
  //       title: 'Error!',
  //       description: 'Please enter a valid phone number.',
  //       status: 'error',
  //       duration: 2000,
  //       isClosable: true
  //     });
  //   }

  // };

  // const onInputAddress = (e) => {
  //   setAddress(e.target.value);
  // };

  return (
    <Box className="container">
      <Text p={5} textAlign='center' fontSize={30} fontWeight={300} color='facebook.500' >My Informations</Text>
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

      <Form className='formDetail'>
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
      </Form>
    </Box>


  )




}

export default Infos;