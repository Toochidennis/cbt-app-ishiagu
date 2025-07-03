import * as yup from 'yup'

export const assignTeacherSchema = yup.object().shape({
    teacher: yup
        .object({
            value: yup.number().required(),
            label: yup.string().required()
        })
        .required('Teacher is required.'),
    subjects: yup
        .array()
        .of(
            yup.object({
                value: yup.number().required(),
                label: yup.string().required()
            })
        )
        .min(1, 'Select at least one subject.')
        .required('Subjects is required.'),
    classes: yup
        .array()
        .of(
            yup.object({
                value: yup.number().required(),
                label: yup.string().required()
            })
        )
        .min(1, 'Select at least one class.')
        .required('Classes is required.')
});
