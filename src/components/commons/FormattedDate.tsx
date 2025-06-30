import React from 'react'

interface FormattedDateProps {
    date?: Date;
    locale?: string;
    options?: Intl.DateTimeFormatOptions;
}

const FormattedDate: React.FC<FormattedDateProps> = ({
    date = new Date(),
    locale = 'en-US',
    options = {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    },
}) => {
    return (
        <>{date.toLocaleDateString(locale, options)}</>
    )
}

export default FormattedDate;