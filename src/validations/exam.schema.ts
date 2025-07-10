import * as yup from 'yup'

export const examSchema = yup.object().shape({
    name: yup.string().required('Exam name is required'),
    subject: yup
        .object({
            value: yup.string().required(),
            label: yup.string().required()
        })
        .nullable()
        .required('Subjects is required.'),
    date: yup.string().required('Date is required'),
    time: yup
        .string()
        .required('Time is required')
        .matches(/^([0-1]\d|2[0-3]):([0-5]\d)$/, "Invalid time format"),
    duration: yup.number().required('Duration is required'),
    class: yup
        .object({
            value: yup.string().required(),
            label: yup.string().required()
        })
        .nullable()
        .required('Class is required.'),
    questions_file: yup
        .mixed<File>()
        .required("Questions file is required.")
        .test("fileType", "Only JSON files are allowed.", (value) => {
            return value && value.type === "application/json";
        }),
})