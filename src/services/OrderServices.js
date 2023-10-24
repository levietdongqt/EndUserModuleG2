import axios from 'axios';
import baseRequest from "../contexts/AxiosContext";



    // GET PURCHASE BYID
    export const getOrderById = async (id) => {
        try {
            const response = await baseRequest.get(`/User/GetPurchaseById?id=${id}`);
            return response.data;
        } catch (error) {
            // Bắt lỗi và xử lý tại đây
            if (error.response) {
                // Lỗi từ phía server, ví dụ: status code không phải 2xx
                console.error('Lỗi từ server:', error.response.status, error.response.data);
            } else if (error.request) {
                // Không nhận được phản hồi từ server
                console.error('Không kết nối được tới server:', error.request);
            } else {
                // Lỗi khác
                console.error('Lỗi:', error.message);
            }

            // Trả về một giá trị mà bạn xác định để xử lý lỗi tại nơi gọi hàm này
            return null;  // Hoặc throw một exception
        }
    };

    // GET PUSRCHAS BY USERID & STATUS
    export const getOrdersByStatus = async (userId, statuses) => {
        try {
            const statusesParam = statuses.map(status => `statuses=${encodeURIComponent(status)}`).join('&');
            const url = `/User/GetPurchaseBySt?userID=${userId}&${statusesParam}`;
            const response = await baseRequest.get(url);
            return response.data;
        } catch (error) {
            if (error.response) {
                // Lỗi từ phía server, ví dụ: status code không phải 2xx
                console.error('Lỗi từ server:', error.response.status, error.response.data);
            } else if (error.request) {
                // Không nhận được phản hồi từ server
                console.error('Không kết nối được tới server:', error.request);
            } else {
                // Lỗi khác
                console.error('Lỗi:', error.message);
            }
            return null;
        }
    };

    // UPDATE STATUS
    export const updateOrderStatus = async (purDTO) => {
        try {
            const response = await baseRequest.put(`/User/EditPurChase`, purDTO);
            return response.data;
        } catch (error) {
            if (error.response) {
                // Lỗi từ phía server, ví dụ: status code không phải 2xx
                console.error('Lỗi từ server:', error.response.status, error.response.data);
            } else if (error.request) {
                // Không nhận được phản hồi từ server
                console.error('Không kết nối được tới server:', error.request);
            } else {
                // Lỗi khác
                console.error('Lỗi:', error.message);
            }

            // Trả về một giá trị mà bạn xác định để xử lý lỗi tại nơi gọi hàm này
            return null;
        }

    };

    // GET PURCHASE BYID
    export const getDeliveryById = async (id) => {
        try {
            const response = await baseRequest.get(`/User/DeliveryById?id=${id}`);
            return response.data;
        } catch (error) {
            // Bắt lỗi và xử lý tại đây
            if (error.response) {
                // Lỗi từ phía server, ví dụ: status code không phải 2xx
                console.error('Lỗi từ server:', error.response.status, error.response.data);
            } else if (error.request) {
                // Không nhận được phản hồi từ server
                console.error('Không kết nối được tới server:', error.request);
            } else {
                // Lỗi khác
                console.error('Lỗi:', error.message);
            }

            // Trả về một giá trị mà bạn xác định để xử lý lỗi tại nơi gọi hàm này
            return null;  // Hoặc throw một exception
        }
    };

export const getAllOrders = async () => {
    const { data } = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/orders`);
    return data;
};
export const getOrdersByUserId = async (id) => {
    const { data } = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/User/Orders/${id}`);
    return data;
};

export const addOrder = async (products, buyer, address) => {
    const { data } = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/orders`, {
        products,
        buyer,
        address
    });
    return data;
};


export const deleteOrder = async (id) => {
    const { data } = await axios.delete(`${process.env.REACT_APP_API_BASE_URL}/orders/${id}`);
    return data;
};