import React, { useEffect, useState, useRef } from "react";
import ImageUploading from "react-images-uploading";
import {
  uploadImages,
  LoadImagesByTemplateIdAsync,
  deleteImages
} from "../services/ImageServices";
import ThemeProvider from "../theme";
import {
  Button,
  Box,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  styled,
  Tooltip,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import DeleteIcon from "@mui/icons-material/Delete";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import RestoreIcon from '@mui/icons-material/Restore';
import UndoIcon from "@mui/icons-material/Undo";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import { useToast } from "@chakra-ui/react";
import "../upload.css";
import swal from "sweetalert";
import { useUserContext } from "../contexts/UserContext";

export default function Upload({
  openDialog,
  handleCloseDialog,
  template,
  oldImages,
}) {
  const [images, setImages] = React.useState([]);
  const [myImage, setMyImage] = React.useState([]);
  const [restoreImages, setRestoreImages] = React.useState([]);
  const { currentUser } = useUserContext();
  const maxNumber = 15;
  const toast = useToast();
  const onChange = (imageList, addUpdateIndex) => {
    setImages(imageList);
  };

  const errorPopup = (mess) => {
    swal({
      title: "Warning",
      text: mess,
      icon: "warning",
    });
  };

  useEffect(() => {
    loadImages();
    if (!openDialog) {
      setImages([]);
    }
  }, []);

  const loadImages = async () => {
    if (template) {
      var templateId = 1;
      if (template === 1) {
        templateId = 1;
      } else {
        templateId = template.id;
      }
      console.log(template);
      const userId = currentUser.id;
      console.log("Id", templateId);
      const res = await LoadImagesByTemplateIdAsync(templateId, userId);
      if (res.data.status === 200) {
        var result = res.data.result;
        console.log("cm", result);
        setMyImage(result);
        if (result && Array.isArray(result.images) && result.images.length > 0) {
          result.images.forEach((image) => {
            const img = {
              id: image.id,
              data_url: `${process.env.REACT_APP_API_BASE_URL_LOCAL}${image.imageUrl}`,
            };
            setImages((prev) => [...prev, img]);
          });
        }
        console.log(images);

      }
    }
  }



  const CustomDialogContent = styled(DialogContent)({
    display: "flex",
    flexDirection: "column",
    padding: "30px",
    margin: "20px",
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
        if (response.data.status !== 200) {
          errorPopup(response.data.message);
          isContinue = false;
        }
      })
    }
    if (images.length > 0 && isContinue) {
      const formData = new FormData();
      formData.append("userID", currentUser.id);
      if(template === 1){
        formData.append("templateID", 1);
      }else{
        formData.append("templateID", myImage.templateId);
      }
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
      } else {
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
            color={"#132043"}
            align={"center"}
            style={{ fontSize: 30, letterSpacing: "0.1em" }}
          >
            {template === 1 ? "Simple Upload" : `Upload With ${template.name}`}
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
                    <Tooltip title="Upload">
                      <Button
                        size="100px"
                        startIcon={<AddPhotoAlternateIcon />}
                        color="primary"
                        onClick={onImageUpload}
                        {...dragProps}
                      ></Button>
                    </Tooltip>
                    &nbsp;
                    <Tooltip title="Delete All">
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
                          onImageRemoveAll();
                        }}
                        {...dragProps}
                      ></Button>
                      &nbsp;
                    </Tooltip>
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
                              <Tooltip title="Undo">
                                <Button
                                  size="100px"
                                  startIcon={<UndoIcon />}
                                  color="info"
                                  onClick={async (event) => {
                                    setRestoreImages((prev) => [
                                      ...prev,
                                      image,
                                    ]);
                                    onImageUpdate(index);
                                  }}
                                  {...dragProps}
                                ></Button>
                              </Tooltip>
                              <Tooltip title="Remove">
                                <Button
                                  size="100px"
                                  startIcon={<DeleteIcon />}
                                  color="error"
                                  onClick={async (event) => {
                                    if (image.id !== undefined) {
                                      setRestoreImages((prev) => [
                                        ...prev,
                                        image,
                                      ]);
                                    }
                                    onImageRemove(index);
                                  }}
                                  {...dragProps}
                                ></Button>
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
                        {errors.maxNumber &&
                          errorPopup(
                            "Number of selected images exceed maxNumber"
                          )}
                        {errors.acceptType &&
                          errorPopup("Your selected file type is not allow")}
                        {errors.maxFileSize &&
                          errorPopup("Selected file size exceed maxFileSize")}
                        {errors.resolution &&
                          errorPopup(
                            "Selected file is not match your desired resolution"
                          )}
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
              variant="outlined"
              startIcon={<CloudUploadIcon />}
              color="inherit"
              sx={
                {
                  // ... các style khác
                }
              }
              onClick={submit}
            >
              Save
            </Button>
            <Button
              component="label"
              variant="outlined"
              startIcon={<ExitToAppIcon />}
              color="success"
              sx={{
                letterSpacing: "0.05em",
              }}
              onClick={handleCloseDialog}
            >
              Close
            </Button>
          </DialogActions>
        </Dialog>
      </ThemeProvider>
    </>
  );
}
