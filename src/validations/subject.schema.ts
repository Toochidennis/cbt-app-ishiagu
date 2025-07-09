import * as yup from 'yup';

export const subjectSchema = yup.object().shape({
    subject_code: yup.string().required('Subject code is required.'),
    subject_name: yup.string().required('Subject name is required.')
});

export const assignSubjectSchema = yup.object().shape({
    classes: yup
        .array()
        .min(1, 'Select at least one class')
        .of(
            yup.object({
                value: yup.string().required(),
                label: yup.string().required()
            })
        )
        .required('Classes is required.'),
    subjects: yup
        .array()
        .min(1, 'Select at least one subject')
        .of(
            yup.object({
                value: yup.string().required(),
                label: yup.string().required()
            })
        )
        .required('Subjects is required')
})