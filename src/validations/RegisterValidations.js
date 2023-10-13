import * as yup from 'yup';

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
        .matches(/^\d{11}$/, "Phone number must be 11 digits"),

    gender: yup.boolean().required("Gender is required"),
    terms: yup.boolean().oneOf([true], "You must agree to the Terms of Service and Privacy Policy").required("You must agree to the Terms of Service and Privacy Policy"),

    dateOfBirth: yup
        .date()
        .required("Date of birth is required")
        .test(
            "is-age-greater-than-14",
            "You must be at least 14 years old",
            (value) => {
                const today = new Date();
                const birthDate = new Date(value);
                const age = today.getFullYear() - birthDate.getFullYear();
                const monthDiff = today.getMonth() - birthDate.getMonth();

                if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
                    age--;
                }

                return age >= 14;
            }
        ),


});

export default RegisterValidations;