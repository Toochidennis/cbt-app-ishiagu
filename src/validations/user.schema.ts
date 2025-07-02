import * as yup from "yup";

export const userSchema = yup.object().shape({
    surname: yup
        .string()
        .length(3, "Surname must be more than 2 letters")
        .required("Surname is required"),
    middle_name: yup.string().nullable(),
    first_name: yup
        .string()
        .length(3, "First name must be more than 2 letters")
        .required("First name is required"),
    gender: yup
        .string()
        .oneOf(["Male", "Female", ""])
        .required("Gender is required")
        .notOneOf([""], "Gender is required"),
    date_of_birth: yup
        .string()
        .nullable()
        .transform((curr, orig) => (orig === "" ? null : curr)),
    contact: yup.string().nullable(),
    role: yup
        .string()
        .oneOf(["Admin", "Staff", "Student", ""])
        .required("Role is required")
        .notOneOf([""], "Role is required"),
    class: yup
        .string()
        .nullable()
        .when("role", {
            is: "Student",
            then: (schema) => schema.required("Class is required for students"),
            otherwise: (schema) => schema.notRequired()
        }),
    address: yup.string().nullable(),
    state: yup
    .string()
    .required('State is required'),
    lga: yup.string().nullable(),
    city: yup.string().nullable(),
});
