import * as yup from 'yup';

export const subjectSchema = yup.object().shape({
    subject_code: yup.string().required('Subject code is required.'),
    subject_name: yup.string().required('Subject name is required.')
});

export const assignSubjectSchema = yup.object().shape({
    subject_code: yup.string().required('Subject code is required.'),
    subjects: yup
    .array()
    .of(
        yup.string().required('Each subject is required.')
    )
    .min(1, 'At least one subject must be selected.')
    .required('Subjects are required.')
})