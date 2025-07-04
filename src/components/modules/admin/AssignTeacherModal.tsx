import React from 'react'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import Select from 'react-select'
import { type AssignTeacherDto } from '@/types/admin/api/teacher'
import { type AssignTeacherProps } from '@/types/admin/ui/teacher'
import { assignTeacherSchema } from '@/validations/teacher.schema'

const AssignTeacherModal: React.FC<AssignTeacherProps> = ({
    assignTeacher,
    setAssignTeacher
}) => {
    const {
        control,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<AssignTeacherDto>({
        resolver: yupResolver(assignTeacherSchema)
    })

    const onSubmit = (data: AssignTeacherDto) => {
        console.log(data)
    }

    const classesList = [
        { value: 1, label: 'JSS1' },
        { value: 2, label: 'JSS2' },
        { value: 3, label: 'JSS3' },
        { value: 4, label: 'JSS3' },
        { value: 5, label: 'JSS3' },
        { value: 6, label: 'JSS3' },
    ]

    const subjectsList = [
        { value: 1, label: 'Mathematics' },
        { value: 2, label: 'English' },
        { value: 3, label: 'Physics' },
    ]

    const teacherList = [
        { value: 1, label: 'Toochi Dennis' },
        { value: 2, label: 'Mark John' },
        { value: 3, label: 'Doe' },
    ]

    return (
        <>
            {assignTeacher && (
                <div className='fixed inset-0 z-50 flex items-center justify-center'>
                    {/** Backdrop */}
                    <div className='fixed inset-0 bg-black opacity-50 z-40'></div>
                    <div className='relative z-50 align-bottom bg-white rounded-lg shadow-xl transform transition-all sm:my-8 sm:max-w-sm sm:align-middle sm:w-full'>
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <div className='px-4 pt-5 pb-4 sm:p-6'>
                                <h3 className='text-lg leading-6 font-medium text-gray-900 mb-4'>
                                    Assign Teacher
                                </h3>
                                <div className='mb-6'>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Teacher
                                    </label>
                                    <Controller
                                        name="teacher"
                                        control={control}
                                        render={({ field }) => (
                                            <Select
                                                {...field}
                                                isMulti = {false}
                                                options={teacherList}
                                                classNamePrefix="react-select"
                                            />
                                        )}
                                    />
                                    {errors.teacher && (
                                        <p className="mt-1 text-sm text-red-600">
                                            {errors.teacher.message}
                                        </p>
                                    )}
                                </div>

                                <div className='mb-6'>
                                    <label className='block text-sm font-medium text-gray-700 mb-1'>Subjects</label>
                                    <Controller
                                        name="subjects"
                                        control={control}
                                        render={({ field }) => (
                                            <Select
                                                {...field}
                                                isMulti
                                                options={subjectsList}
                                                classNamePrefix="react-select"
                                            />
                                        )}
                                    />
                                    {errors.subjects && <p className="text-sm text-red-600 mt-1">{errors.subjects.message}</p>}
                                </div>
                                <div className='mb-4'>
                                    <label className='block text-sm font-medium text-gray-700 mb-1'>
                                        Classes
                                    </label>
                                    <Controller
                                        name='classes'
                                        control={control}
                                        render={({ field }) => (
                                            <Select
                                                {...field}
                                                isMulti
                                                options={classesList}
                                                classNamePrefix='react-select'
                                            />
                                        )} />
                                    {errors.classes && <p className="text-sm text-red-600 mt-1">{errors.classes.message}</p>}
                                </div>
                                <div className="flex justify-end gap-3">
                                    <button
                                        type="submit"
                                        className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm"
                                    >
                                        Save
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setAssignTeacher((prev) => !prev);
                                            reset();
                                        }}
                                        className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:w-auto sm:text-sm"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    )
}

export default AssignTeacherModal