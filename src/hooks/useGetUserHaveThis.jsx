import { useEffect, useState } from 'react';

import { getOrdersByUserId } from '../services/OrderServices';

const useGetUserHaveThis = (userId, productId) => {

    const [have, setHave] = useState(false);

    useEffect(() => {
        userId && productId &&
        getOrdersByUserId(userId)
            .then((result) => {
              if(result.result.status === 'Enabled'){
                  result.result.purchaseOrders.forEach((item) => {
                      if (item.status === 'Received') {
                          item.myImages?.forEach((order) => {
                              const test = order.templateId === productId;
                              if (test) {
                                  setHave(true);
                              }
                          });
                      }
                  });
              }
            });
    }, [userId, productId]);

    return [have];
}

export default useGetUserHaveThis;
