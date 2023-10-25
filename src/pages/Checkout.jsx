import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import "../checkout.css"
import { useUserContext } from '../contexts/UserContext';
import { getCartInfo } from '../services/CartService';
import { useNavigate } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import { useCartContext } from '../contexts/CartContext';
import { useToast } from '@chakra-ui/react';
import { directPayment } from '../services/CartService';
import OnlinePayment from './OnlinePayment';
import swal from 'sweetalert';

export default function Checkout() {

  const toast = useToast();
  const [cookies, setCookie, removeCookie] = useCookies(['cart']);
  const { cart, setCart, refresh } = useCartContext();
  const { currentUser } = useUserContext();
  const [total, setTotal] = useState(0)
  const navigate = useNavigate();
  const [showCredit, setShowCredit] = useState(true);
  const [sFullName, setFullName] = useState("");
  const [sPhone, setPhone] = useState("");
  const [sAddress, setAdress] = useState("");

  const [openCartDialog, setOpenCartDialog] = useState(false);
  const [orderDTO, setOrderDTO] = useState({
    userId: 0,
    fullName: "", // Set an initial value to avoid undefined
    phone: "",
    address: "",
    email: "",
    totalPrice: 0,
    note: ""
  });
  const isSuccessPayPal = (isSuccess) => {
    console.log("Successs")
    swal({
      title: "Information",
      text: "The order have been created!",
      icon: "info",
    })
    navigate("/")
  }
  useEffect(() => {
    if (currentUser) {
      setFullName(currentUser.fullName)
      setAdress(currentUser.address ? currentUser.address : "")
      setPhone(currentUser.phone ? currentUser.phone : "")

      console.log("User ID", currentUser.id)
      getCartInfo(currentUser.id).then(response => {
        if (response.data.status === 200) {
          setCookie("cart", response.data.result)
          setCart(response.data.result)
          var totalPrice = response.data.result.reduce((accumulator, currentItem) => {
            var price = currentItem.quantity * currentItem.price;
            return accumulator + price
          }, 0)
          setTotal(Number(totalPrice.toFixed(2)));
        } else {
          setCookie("cart", [])
          setCart([])
        }
      });
      console.log("CookieCart: ", cart)
    }
  }, []);
  const popop = (messs, status) => {
    toast({
      title: status,
      description: messs,
      status: status.toLowerCase(),
      duration: 2000,
      isClosable: true,
      position: "top"
    });
  }
  const submit = () => {
    if (total <= 0) {
      swal({
        title: "Warning",
        text: "The order is invalid, please add something into cart first!",
        icon: "warning",
      })
    }
    const fullName = document.getElementById("fullName").value;
    const phoneNumber = document.getElementById("phoneNumber").value;
    const address = document.getElementById("address").value;
    const note = document.getElementById("note").value;
    const email = currentUser.email;
    const phoneRegex = /^\d{9,11}$/;
    var isValid = true;
    if (!fullName) {
      popop("Full name is require! ", "Warning")
      isValid = false;
    }
    if (!phoneNumber || !phoneRegex.test(phoneNumber)) {
      popop("Phone number is invalid! ", "Warning")
      isValid = false;
    }
    if (!address) {
      popop("Address is require! ", "Warning")
      isValid = false;
    }
    if (note && note.length > 254) {
      popop("Note must be less than 255 characters! ", "Warning")
      isValid = false;
    }
    var paymentMethod = true;
    const paymentMethodRadios = document.getElementsByName("paymentMethod");
    for (let i = 0; i < paymentMethodRadios.length; i++) {
      if (paymentMethodRadios[i].checked) {
        paymentMethod = paymentMethodRadios[i].value;
        break;
      }
    }
    console.log("IsValid", isValid)
    if (isValid) {
      // eslint-disable-next-line no-restricted-globals
      if (confirm("Are you sure to purchase this order?")) {
        const newOrder = {
          userId: currentUser.id,
          fullName: fullName, // Set fullName to an empty string if undefined
          phone: phoneNumber,
          address: address,
          email: email,
          totalPrice: total,
          note: note ? note : ""
        }
        setOrderDTO(newOrder);
        if (paymentMethod === "true") {
          console.log("vo ne");
          setOpenCartDialog(true)
        } else {
          directPayment(newOrder).then(response => {
            if (response.data.status === 200) {
              swal({
                title: "Information",
                text: "The order have been created! Please come to our office to make payment",
                icon: "info",
              })
              navigate("/")
            }

          })
        }
      }
    }
  }
  const handleCloseDialogEdit = () => {
    setOpenCartDialog(false);
  }
  const changeHandler = (event) => {
    setFullName(event.target.value)
  }
  const changeAdress = (event) => {
    setAdress(event.target.value)
  }
  const changePhone = (event) => {
    setPhone(event.target.value)
  }
  return (
    <div className="maincontainer">
      <div class="container">
        <div class="py-5 text-center">
          <h1>Checkout</h1>
        </div>
        <div class="row">
          <div class="col-md-4 order-md-2 mb-4">
            <h4 class="d-flex justify-content-between align-items-center mb-3">
              <span class="text-muted">Your cart</span>
              <span class="badge badge-secondary badge-pill">3</span>
            </h4>
            <ul class="list-group mb-3">
              {
                cart && cart.map((item) => {
                  return (
                    <li class="list-group-item d-flex justify-content-between lh-condensed">
                      <div>
                        <h6 class="my-0">{item.templateName} ({item.width}x{item.length})</h6>
                        <small class="text-muted">Material: {item.materialPage}</small>
                      </div>
                      <div >
                        <h6 class="my-0 textRight" >${Number((item.price * item.quantity).toFixed(2))}</h6>
                        <span class="text-muted">Amount: {item.quantity}</span>
                      </div>

                    </li>
                  )
                })
              }
              <li class="list-group-item d-flex justify-content-between">
                <span>Total (USD)</span>
                <strong>${total}</strong>
              </li>
            </ul>
          </div>
          <div class="col-md-8 order-md-1">
            <h4 class="mb-3">Delivery Information</h4>
            <form class="needs-validation" >
              <div class="row">
                <div class="mb-3">
                  <label for="firstName">Full name</label>
                  <input type="text" class="form-control" id="fullName" placeholder="" value={sFullName} onChange={changeHandler} required />
                  <div class="invalid-feedback">
                    Valid first name is required.
                  </div>
                </div>
              </div>
              <div class="mb-3">
                <label for="username">Phone number</label>
                <input type="text" class="form-control" id="phoneNumber" value={sPhone} placeholder="Phone number" required onChange={changePhone} />
                <div class="invalid-feedback">
                  Phone number is required.
                </div>
              </div>
              <div class="mb-3">
                <label for="address">Address</label>
                <input type="text" class="form-control" id="address" value={sAddress} placeholder="1234 Main St" required onChange={changeAdress} />
                <div class="invalid-feedback">
                  Please enter your shipping address.
                </div>
              </div>
              <div class="mb-3">
                <label for="address">Note</label>
                <br></br>
                <textarea class="form-control" name="note" id="note" rows="4" cols="70"></textarea>
              </div>
              <div class="custom-control custom-checkbox">
              </div>
              <hr class="mb-4" />
              <h4 class="mb-3">Payment</h4>
              <div class="d-block my-3" >
                <div>
                  <input id="true" name="paymentMethod" type="radio" class="custom-control-input" value='true' checked />
                  <label class="custom-control-label" for="credit"> Credit card</label>
                </div>
                <div class="mt">
                  <input id="false" name="paymentMethod" type="radio" class="custom-control-input" value='false' />
                  <label class="custom-control-label" for="debit"> In Office</label>
                </div>

              </div>

              <button onClick={submit} class="btn btn-primary btn-lg btn-block mb" type="button">Continue to checkout</button>
              {
                openCartDialog && <OnlinePayment test= {openCartDialog} successHandler={isSuccessPayPal} amount={total} orderDTO={orderDTO} />
              }

            </form>
          </div>
        </div>
      </div>
    </div>

  )
}