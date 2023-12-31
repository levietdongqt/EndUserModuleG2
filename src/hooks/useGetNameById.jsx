import { useEffect, useState } from 'react';

import { getUserById } from '../services/UserServices';

const useGetNameById = (id) => {
    const [name, setName] = useState("");

    useEffect(() => {
        getUserById(id)
            .then((result) => {
                setName(result.result.fullName);
            });
    }, [id]);

    return [name];
}

export default useGetNameById;