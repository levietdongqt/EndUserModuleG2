import React, { useEffect, useState } from 'react';
import { Modal, ModalOverlay, ModalBody, ModalContent, ModalHeader, ModalCloseButton, ModalFooter, Text, Button, Textarea, useToast } from '@chakra-ui/react';
import StarRatings from 'react-star-ratings';
import Filter from 'bad-words';

import { getReviewById, addReview } from '../services/ReviewServices';

import { useUserContext } from '../contexts/UserContext';
import useGetReviewId from '../hooks/useGetReviewId';

const ReviewModal = ({ onClose, isOpen, productId }) => {

    const [comment, setComment] = useState("");
    const [rating, setRating] = useState(0);
    const [review, setReview] = useState([]);
    const { currentUser } = useUserContext();
    const toast = useToast();
    const [reviewId] = useGetReviewId(currentUser.id, productId);
    useEffect(() => {
        if (reviewId) {
            getReviewById(reviewId)
                .then((result) => {
                    setReview(result.result);
                    setRating(result.result.rating);
                    setComment(result.result.content);
                });
        }
    }, [reviewId, comment,rating]);

    const onClickSend = () => {
        const filter = new Filter();
        // Censor curse words in the comment
        const censoredComment = filter.clean(comment);
        addReview(productId, currentUser.id , censoredComment, rating)
            .then((result) => {
                if (result.data.status !== 201) {
                    toast({
                        title: 'Error!',
                        description: 'Somethings went wrong.',
                        status: 'error',
                        duration: 2000,
                        isClosable: true
                    });
                } else {
                    console.log("success");
                        toast({
                            title: 'Success!',
                            description: 'Your review has been sent successfully.',
                            status: 'success',
                            duration: 2000,
                            isClosable: true
                        });
                        onClose(true);
                    }
            });
    };

    return (
        <Modal onClose={onClose} isOpen={isOpen} isCentered>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader fontSize={30} color='facebook.500' >{reviewId !== "" ? 'Edit Review' : 'Review'}</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <Text fontSize={20} mt={5} mb={3} fontWeight={400} color='facebook.500' >Rating :</Text>
                    <StarRatings
                        starDimension={'30'}
                        starSpacing={'2'}
                        rating={rating}
                        changeRating={(val) => setRating(val)}
                        isSelectable={true}
                        starRatedColor="#FFD700"
                        numberOfStars={5}
                        name='rating' />
                    <Text fontSize={20} mt={5} fontWeight={400} color='facebook.500' >Review Text :</Text>
                    <Textarea
                        maxLength={200}
                        spellCheck={false}
                        mt={13}
                        resize='none'
                        placeholder='Please write your review.'
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        height={200}
                    ></Textarea>
                </ModalBody>
                <ModalFooter>
                    <Button mx={3} px={7} colorScheme='facebook' onClick={onClickSend}>Send</Button>
                    <Button colorScheme='facebook' variant='outline' onClick={onClose}>Cancel</Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}

export default ReviewModal;