import { useEffect, useState } from 'react';
import { Text, Box, CircularProgress } from '@chakra-ui/react';
import { confirm } from "../../services/UserServices";

function Confirm() {
    const [countdown, setCountdown] = useState(5);
    const [verifying, setVerifying] = useState(true);

    useEffect(() => {
        const confirmAsync = async (userId, code) => {
            const response = await confirm(userId, code);

            if (response) {
                setVerifying(false);
                const timer = setInterval(() => {
                    setCountdown((prevCountdown) => {
                        if (prevCountdown > 0) {
                            return prevCountdown - 1;
                        } else {
                            // Khi countdown = 0, hủy bỏ timer và chuyển đến trang login
                            clearInterval(timer);
                            window.location.href = '/login';
                            return 0;
                        }
                    });
                }, 1000);

                return () => {
                    clearInterval(timer);
                };
            }
        };

        const location = window.location;
        const searchParams = new URLSearchParams(location.search);
        const userId = searchParams.get('userId');
        const code = searchParams.get('code');
        if (userId && code) {
            confirmAsync(userId, code);
        }
    }, []);
    console.log(countdown)
    return (
        <Box display="flex" flexDirection="column" alignItems="center" mt="4">
            {verifying ? (
                <Box display="flex" flexDirection="column" alignItems="center">
                    <CircularProgress isIndeterminate size="32px" color="teal" />
                    <Text mt="2" fontSize="xl">
                        Verifying...
                    </Text>
                </Box>
            ) : (
                <Text
                    fontSize="xl"
                    fontWeight="bold" // Tạo hiệu ứng đậm cho văn bản
                    color={'facebook.500'} // Đặt màu chữ (teal.500 là ví dụ, bạn có thể chọn màu khác)
                    transition="color 0.3s" // Tạo hiệu ứng màu khi thay đổi
                >
                    Authentication successful. Redirecting to the following login page in {countdown}{' '}
                    {countdown === 1 ? 'second' : 'seconds'}...
                </Text>
            )}
        </Box>
    );
}

export default Confirm;
