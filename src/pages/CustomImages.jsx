import React, { useEffect, useState, useRef } from "react";
import ImageUploading from "react-images-uploading";
import { useUserContext } from "../contexts/UserContext";
import { uploadImages } from "../services/ImageServices";
import ThemeProvider from "../theme";
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
  Tooltip,
  IconButton,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import DeleteIcon from "@mui/icons-material/Delete";
import RestoreIcon from '@mui/icons-material/Restore';
import UndoIcon from "@mui/icons-material/Undo";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import { useToast } from "@chakra-ui/react";
import "../upload.css";
import { deleteImages } from "../services/ImageServices";
import swal from "sweetalert";
import { deleteMyImage } from "../services/ImageServices";

export default function CustomImages({
  openDialog,
  handleCloseDialog,
  myImage,
}) {
  const [images, setImages] = useState([]);
  const [restoreImages, setRestoreImages] = useState([]);
  const { currentUser } = useUserContext();
  const maxNumber = 15;
  const toast = useToast();
  useEffect(() => {
    loadImages();
    if (!openDialog) {
      setImages([]);
      console.log(restoreImages);
      setRestoreImages([]);
    }
  }, [myImage, openDialog]);
  const onChange = (imageList, addUpdateIndex) => {
    setImages(imageList);
  };
  const errorPopup = (mess) => {
    swal({
      title: "Warning",
      text: mess,
      icon: "warning",
    })
  }
  const CustomDialogContent = styled(DialogContent)({
    display: "flex",
    flexDirection: "column",
    padding: "30px",
    margin: "20px",
  });
  const VisuallyHiddenInput = styled("input")({
    clip: "rect(0 0 0 0)",
    clipPath: "inset(50%)",
    height: 1,
    overflow: "hidden",
    position: "absolute",
    bottom: 0,
    left: 0,
    whiteSpace: "nowrap",
    width: 1,
  });
  const submit = async () => {
    var isContinue = true;
    if (images.length === 0) {
      errorPopup("The uploading must be have some images!")
      return;
    }
    if (restoreImages && restoreImages.length > 0 && images.length > 0) {
      const deletedIds = restoreImages.map((image) => image.id);
     await deleteImages(deletedIds).then(response => {
        if(response.data.status !== 200){
            errorPopup(response.data.message);
            isContinue = false;
        }
      })
    }
    if (images.length > 0 && isContinue ) {
      const formData = new FormData();
      formData.append("userID", currentUser.id);
      formData.append("templateID", myImage.templateId);
      console.log("Imagesssssss", images)
      var isUpload = false;
      images.forEach((image) => {
        if (image.file) {
          isUpload = true;
        }
        formData.append(`files`, image.file);
      });
      if (isUpload) {
        uploadImages(formData).then((response) => {
          if (response.data.status === 200) {
            toast({
              title: "Success",
              description: "Upload successfully!.",
              status: "success",
              duration: 2000,
              isClosable: true,
              position: 'top'
            });
            handleCloseDialog(true)
          } else {
            errorPopup(response.data.message);
          }
        });
      }else{
        toast({
          title: "Success",
          description: "Update images successfully!.",
          status: "success",
          duration: 2000,
          isClosable: true,
          position: 'top'
        });
      }

    }
  };
  const hanlderRemoveAll = () => {
      // eslint-disable-next-line no-restricted-globals
      if(confirm("Are you sure to detele this template?")){
        deleteMyImage(myImage.id,currentUser.id).then(response => {
          if(response.data.status === 200){
            swal({
              title: "Information",
              text: "Delete template successfully!",
              icon: "info",
            })
          }else{
            errorPopup(response.data.message)
          }
         
          handleCloseDialog(true);

        })
      }
  }
  //XỬ lý Upload Hình ảnh
  const loadImages = async () => {
    console.log(myImage);
    if (Array.isArray(myImage.images) && myImage.images.length > 0) {
      myImage.images.forEach((image) => {
        const img = {
          id: image.id,
          data_url: `${process.env.REACT_APP_API_BASE_URL_LOCAL}${image.imageUrl}`,
        };
        setImages((prev) => [...prev, img]);
      });
    }
    console.log(images);
  };
  return (
    <>
      <ThemeProvider>
        <Dialog
          open={openDialog}
          onClose={handleCloseDialog}
          maxWidth="md"
          PaperProps={{
            style: {
              backgroundColor: "whitesmoke", // thay đổi màu nền theo ý muốn của bạn
              width: 1000, // thay đổi độ rộng cố định theo ý muốn của bạn
              height: 800, // thay đổi chiều dài cố định theo ý muốn của bạn
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.5)",
            },
          }}
        >
          <DialogTitle
            color={"Highlight"}
            align={"center"}
            style={{ fontSize: 30 }}
          >
            Edit Albums
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
                  errors,
                }) => (
                  // write your building UI
                  <div className="upload__image-wrapper">
                    {/* <button
                  style={isDragging ? { color: "red" } : null}
                  onClick={onImageUpload}
                  startIcon={<AddPhotoAlternateIcon />}
                  {...dragProps}
                >
                  Click or Drop here 
                </button> */}
                    <Tooltip title="Plus">
                      <Button
                        size="100px"
                        startIcon={<AddPhotoAlternateIcon />}
                        color="primary"
                        onClick={onImageUpload}
                        {...dragProps}
                      ></Button>
                    </Tooltip>
                    &nbsp;
                    <Tooltip title="Delete Template">
                      <Button
                        size="100px"
                        startIcon={<DeleteForeverIcon />}
                        color="error"
                        onClick={async () => {
                          const imagesHsId = imageList.filter(
                            (img) => img.id !== undefined
                          );
                          // const deletedIds = imagesHsId.map((item) => item.id);
                          setRestoreImages(imagesHsId);
                          hanlderRemoveAll();
                        }}
                        {...dragProps}
                      ></Button>
                    </Tooltip>
                    &nbsp;
                    <Tooltip title="Restore">
                      <Button
                        size="100px"
                        startIcon={<RestoreIcon />}
                        color="warning"
                        onClick={async () => {
                          setImages((prev) => [...prev, ...restoreImages]);
                          setRestoreImages([]);
                        }}
                        {...dragProps}
                      ></Button>
                    </Tooltip>
                    <hr></hr>
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
                                border: "0.5px thin #000", // Thêm khung đen 2px
                                borderRadius: 1, // Bo tròn góc 8px
                                transition: "transform 0.3s", // Thêm hiệu ứng chuyển đổi 0.3 giây
                                "&:hover": {
                                  transform: "scale(1.1)", // Hiệu ứng phóng to khi di chuột qua hình ảnh
                                  boxShadow: "0 0 10px rgba(0, 0, 0, 0.3)", // Hiệu ứng bóng đổ khi di chuột qua hình ảnh
                                },
                              }}
                              alt={`Image ${index}`}
                              src={image.data_url}
                            />
                            <div className="image-item__btn-wrapper">
                              <Tooltip title="Change">
                                <IconButton
                                  onClick={async (event) => {
                                    setRestoreImages((prev) => [
                                      ...prev,
                                      image,
                                    ]);
                                    onImageUpdate(index);
                                  }}
                                >
                                  <UndoIcon sx={{ fontSize: 20 }} />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Remove">
                                <IconButton
                                  onClick={async (event) => {
                                    if (image.id !== undefined) {
                                      setRestoreImages((prev) => [
                                        ...prev,
                                        image,
                                      ]);
                                    }
                                    onImageRemove(index);
                                  }}
                                >
                                  <DeleteIcon
                                    sx={{ fontSize: 20 }}
                                    color="error"
                                  />
                                </IconButton>
                              </Tooltip>
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
                        {errors.maxNumber && errorPopup("Number of selected images exceed maxNumber")}
                        {errors.acceptType && errorPopup("Your selected file type is not allow")}
                        {errors.maxFileSize && errorPopup("Selected file size exceed maxFileSize")}
                        {errors.resolution && errorPopup("Selected file is not match your desired resolution")}
                      </div>
                    )}
                  </div>
                )}
              </ImageUploading>
            </div>
          </CustomDialogContent>

          <DialogActions>
            <Button
              component="label"
              variant="contained"
              startIcon={<CloudUploadIcon />}
              color="primary"
              sx={
                {
                  // ... các style khác
                }
              }
              onClick={submit}
            >
              Save
            </Button>
            <Button onClick={handleCloseDialog}>Close</Button>
          </DialogActions>
        </Dialog>
      </ThemeProvider>
    </>
  );
}
