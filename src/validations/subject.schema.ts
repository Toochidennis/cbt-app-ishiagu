import * as yup from 'yup';

export const subjectSchema = yup.object().shape({
    subject_code: yup.string().required('Subject code is required.'),
    subject_name: yup.string().required('Subject name is required.')
});