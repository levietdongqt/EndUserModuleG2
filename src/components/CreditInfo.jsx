import React, { useEffect, useState, useRef } from "react";
import ImageUploading from "react-images-uploading";
import { useUserContext } from '../contexts/UserContext';
import { uploadImages } from "../services/ImageServices";
import ThemeProvider from '../theme';
import 'bootstrap/dist/css/bootstrap.min.css';
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
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import { useToast } from "@chakra-ui/react";
import "../upload.css";

export default function CreditInfo({ openDialog, handleCloseDialog, userInfo }) {
  const { currentUser } = useUserContext();
  const maxNumber = 15;
  const toast = useToast();
  const CustomDialogContent = styled(DialogContent)({
    display: 'flex',
    flexDirection: 'column',
    padding: '30px',
    margin: '20px',
  });
  return (
    <>
      <ThemeProvider>
        <Dialog
          open={openDialog}
          onClose={handleCloseDialog}
          maxWidth="md"
          PaperProps={{
            style: {
              backgroundColor: 'whitesmoke', // thay đổi màu nền theo ý muốn của bạn
              width: 600, // thay đổi độ rộng cố định theo ý muốn của bạn
              height: 400, // thay đổi chiều dài cố định theo ý muốn của bạn
              boxShadow: '0 4px 8px rgba(0, 0, 0, 0.5)',
            },
          }}
        >
          <DialogTitle color={'Highlight'} align={'center'} style={{ fontSize: 30 }}>
          Credit card information
          </DialogTitle>
          <CustomDialogContent>
          <div class="row">
                      <div class="col-md-6 mb-3">
                        <label for="cc-name">Name on card</label>
                        <input type="text" class="form-control" id="cc-name" placeholder="" required />
                        <small class="text-muted">Full name as displayed on card</small>
                        <div class="invalid-feedback">
                          Name on card is required
                        </div>
                      </div>
                      <div class="col-md-6 mb-3">
                        <label for="cc-number">Credit card number</label>
                        <input type="text" class="form-control" id="cc-number" placeholder="" required />
                        <div class="invalid-feedback">
                          Credit card number is required
                        </div>
                      </div>
                    </div>
                    <div class="row">
                      <div class="col-md-3 mb-3">
                        <label for="cc-expiration">Expiration</label>
                        <input type="text" class="form-control" id="cc-expiration" placeholder="" required />
                        <div class="invalid-feedback">
                          Expiration date required
                        </div>
                      </div>
                      <div class="col-md-3 mb-3">
                        <label for="cc-expiration">CVV</label>
                        <input type="text" class="form-control" id="cc-cvv" placeholder="" required />
                        <div class="invalid-feedback">
                          Security code required
                        </div>
                      </div>
                    </div>
                    <hr class="mb-4" />
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
