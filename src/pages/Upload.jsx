import React, { useEffect, useState, useRef } from "react";
import ImageUploading from "react-images-uploading";
import { useUserContext } from '../contexts/UserContext';
import { uploadImages } from "../services/CartService";
import {
  Paper,
  Button,
  Typography,
  TextField,
  Box,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  styled,
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import "../upload.css";

export default function Upload({ openDialog, handleCloseDialog }) {
  const [images, setImages] = React.useState([]);
  const { currentUser } = useUserContext();
  const maxNumber = 15;
  const onChange = (imageList, addUpdateIndex) => {
    console.log(imageList, addUpdateIndex);
    setImages(imageList);
  };
  const CustomDialogContent = styled(DialogContent)({
    display: 'flex',
    flexDirection: 'column',
    padding: '30px',
    margin: '20px',
  });
  const submit = async () => {
    if (images.length > 0) {
      const formData = new FormData();
      formData.append('userID', currentUser.id);
      formData.append('templateID', 2);
      images.forEach((image) => {
        formData.append(`files`, image.file);
      });
      await uploadImages(formData);
    }

  };
  return (
    <>
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="md"
        PaperProps={{
          style: {
            backgroundColor: 'whitesmoke', // thay đổi màu nền theo ý muốn của bạn
            width: 1000, // thay đổi độ rộng cố định theo ý muốn của bạn
            height: 800, // thay đổi chiều dài cố định theo ý muốn của bạn
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.5)',
          },
        }}
      >
        <DialogTitle color={'Highlight'} align={'center'} style={{ fontSize: 30 }}>
          Upload
        </DialogTitle>
        <CustomDialogContent>
          <div>
          <ImageUploading
            multiple
            value={images}
            onChange={onChange}
            maxNumber={maxNumber}
            dataURLKey="data_url"
            acceptType={["jpg", "jpeg", "png"]}
          >
            {({
              imageList,
              onImageUpload,
              onImageRemoveAll,
              onImageUpdate,
              onImageRemove,
              isDragging,
              dragProps,
              errors
            }) => (
              // write your building UI
              <div className="upload__image-wrapper">
                <button
                  style={isDragging ? { color: "red" } : null}
                  onClick={onImageUpload}
                  {...dragProps}
                >
                  Click or Drop here
                </button>
                &nbsp;
                <button onClick={onImageRemoveAll}>Remove all</button>
                <Grid container spacing={2}>
                  {imageList.map((image, index) => {
                    return (
                      <Grid item key={index}>
                        <Box
                          component="img"
                          sx={{
                            height: 100,
                            width: 200,
                            maxHeight: { xs: 233, md: 167 },
                            maxWidth: { xs: 350, md: 250 },
                            border: '0.5px thin #000', // Thêm khung đen 2px
                            borderRadius: 1, // Bo tròn góc 8px
                            transition: 'transform 0.3s', // Thêm hiệu ứng chuyển đổi 0.3 giây
                            '&:hover': {
                              transform: 'scale(1.1)', // Hiệu ứng phóng to khi di chuột qua hình ảnh
                              boxShadow: '0 0 10px rgba(0, 0, 0, 0.3)', // Hiệu ứng bóng đổ khi di chuột qua hình ảnh
                            },
                          }}
                          alt={`Image ${index}`}
                          src={image.data_url}
                        />
                        <div className="image-item__btn-wrapper">
                          <button onClick={() => onImageUpdate(index)}>Change</button>
                          <button onClick={() => onImageRemove(index)}>Remove</button>
                        </div>
                      </Grid>
                    );
                  })}
                </Grid>
                {/* {imageList.map((image, index) => (
                  <div key={index} className="image-item">
                    <img src={image.data_url} alt="" width="100" />
                    <div className="image-item__btn-wrapper">
                      <button onClick={() => onImageUpdate(index)}>Change</button>
                      <button onClick={() => onImageRemove(index)}>Remove</button>
                    </div>
                  </div>
                ))} */}
                {errors && (
                  <div>
                    {errors.maxNumber && (
                      <span>Number of selected images exceed maxNumber</span>
                    )}
                    {errors.acceptType && (
                      <span>Your selected file type is not allow</span>
                    )}
                    {errors.maxFileSize && (
                      <span>Selected file size exceed maxFileSize</span>
                    )}
                    {errors.resolution && (
                      <span>
                        Selected file is not match your desired resolution
                      </span>
                    )}
                  </div>
                )}
              </div>
            )}
          </ImageUploading>
          </div>
        </CustomDialogContent>
        
        <DialogActions>
          <Button type="submit"  onClick={submit}>
            Upload
          </Button>
          <Button onClick={handleCloseDialog}>Close</Button>
        </DialogActions>
      </Dialog>
    </>


  );
}
