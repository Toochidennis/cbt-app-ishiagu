import * as yup from "yup";

export const userSchema = yup.object().shape({
    surname: yup
        .string()
        .nullable(),
    //.required("Surname is required"),
    middleName: yup.string().nullable(),
    firstName: yup
        .string()
        .nullable(),
    //.required("First name is required"),
    gender: yup
        .string()
        .oneOf(["Male", "Female", ""]),
    //.required("Gender is required")
    // .notOneOf([""], "Gender is required"),
    dateOfBirth: yup
        .string()
        .nullable()
        .transform((curr, orig) => (orig === "" ? null : curr)),
    contact: yup.string().nullable(),
    role: yup
        .string()
        .nullable()
        .oneOf(["admin", "staff", "student", ""]),
    classes: yup.object({
        value: yup.string().required(),
        label: yup.string().required()
    })
        .when("role", {
            is: "Student",
            then: (schema) => schema.required("Class is required for students"),
            otherwise: (schema) => schema.notRequired()
        }),
    address: yup.string().nullable(),
    state: yup
        .string(),
    // .required('State is required'),
    lga: yup.string().nullable(),
    city: yup.string().nullable(),
    usersFile: yup
        .mixed<File>()
        .required("Users file is required.")
        .test("fileType", "Only JSON files are allowed.", (value) => {
            return value && value.type === "application/json";
        }),
});
