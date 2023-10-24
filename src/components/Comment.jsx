import React, { useEffect, useState } from 'react';
import { Divider, Box, Text } from '@chakra-ui/react';
import moment from 'moment';

import useGetNameById from '../hooks/useGetNameById';

const Comment = ({ authorId, commentText, createdAt }) => {

    const [name] = useGetNameById(authorId);
    const [author, setAuthor] = useState("");

    useEffect(() => {
        setAuthor(name)
    }, [name]);

    return (
        <Box>
            <Divider />
            <Box
                display='flex'
                flexDirection='column'
                mt={2}
                fontSize={{ base: 16, md: 20 }}
                padding={5}
                backgroundColor='#f0f0f0'
                borderRadius={8}
            >
                <Box
                    display='flex'
                    justifyContent='space-between'
                    alignItems='center'
                >
                    <Text fontWeight={600}>{author}</Text>
                    <Text fontWeight={300}>{moment(createdAt).format('DD MMMM YYYY')}</Text>
                </Box>
                <Text mt={3} lineHeight={1.5}>{commentText}</Text>
            </Box>
        </Box>
    )
}

export default Comment;