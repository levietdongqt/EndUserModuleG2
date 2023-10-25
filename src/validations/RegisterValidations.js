import * as yup from 'yup';
import { differenceInYears } from 'date-fns';
const today = new Date();

const RegisterValidations = yup.object().shape({
    fullName: yup.string().required("Full name is required").min(1).max(30),
    email: yup
        .string()
        .required("Email is required")
        .email("Please enter a valid email address"),
    address: yup.string().required("Address is required"),
    password: yup.string().required("Password is required").min(5).max(20),
    repassword: yup.string().when("password", {
        is: (password) => password && password.length > 0,
        then: yup.string().oneOf([yup.ref("password")], "Passwords must match"),
        otherwise: yup.string().required("Confirm password is required"),
    }),
    phone: yup
        .string()
        .required("Phone number is required")
        .matches(/^\d{9,11}$/, "Phone number must be between 9 and 11 digits"),

    gender: yup.boolean().required("Gender is required"),
    terms: yup.boolean().oneOf([true], "You must agree to the Terms of Service and Privacy Policy").required("You must agree to the Terms of Service and Privacy Policy"),

    dateOfBirth: yup
        .date()
        .max(today, 'Date of birth cannot be in the future')
        .required('Date of birth is required')
        .test('is-at-least-14-years-old', 'You must be at least 14 years old', (value) => {
            return differenceInYears(today, value) >= 14;
        }),


});

export default RegisterValidations;