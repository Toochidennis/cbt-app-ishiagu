import * as yup from "yup";

export const userSchema = yup.object().shape({
    surname: yup.string().required("Surname is required"),
    middle_name: yup.string().nullable(),
    first_name: yup.string().required("First name is required"),
    gender: yup.string().oneOf(["Male", "Female"]).required("Gender is required"),
    date_of_birth: yup.date().nullable(),
    email: yup
        .string()
        .nullable()
        .email("Invalid email format"),
    role: yup
        .string()
        .oneOf(["Admin", "Staff", "Student"])
        .required("Role is required"),
    class: yup.string().required("Class is required"),
    address: yup.string().nullable(),
    state: yup.string().nullable(),
    lga: yup.string().nullable(),
    city: yup.string().nullable(),
});
