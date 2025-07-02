import * as yup from 'yup';

export const classSchema = yup.object().shape({
    name: yup.string().required('Class name is required'),
});