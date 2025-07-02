import React from 'react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { type CreateSubjectDto } from '@/types/admin/subject.api'
import { type SubjectModalProps } from '@/types/admin/subject.ui'
import { subjectSchema } from '@/validations/subject.schema'

const AddSubjectModal: React.FC<SubjectModalProps> = ({
    showAddModal,
    setShowAddModal
}) => {
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset
    } = useForm<CreateSubjectDto>({
        resolver: yupResolver(subjectSchema)
    })

    const onSubmit = (data: CreateSubjectDto) => {
        console.log(data)
        reset()
        setShowAddModal((prev) => !prev)
    }

    return (
        <>
            {showAddModal && (
                <div className='fixed inset-0 z-50 flex items-center justify-center'>
                    {/**Backdrop */}
                    <div className='fixed inset-0 bg-black opacity-50 z-40'></div>

                    {/**Modal */}
                    <div className='relative z-50 align-bottom bg-white rounded-lg shadow-xl text-left transform transition-all sm:my-8 sm:align-middle sm:max-w-sm sm:w-full'>
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <div className='px-4 pt-5 pb-4 sm:p-6'>
                                <h3 className='text-lg leading-6 font-medium text-gray-900 mb-4'>
                                    Add New Subject
                                </h3>
                                <div className='space-y-4'>
                                <input
                                    type="text"
                                    placeholder="Enter subject code"
                                    {...register("subject_code")}
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                />
                                {errors.subject_code && (
                                    <p className="mt-1 text-sm text-red-600">
                                        {errors.subject_code.message}
                                    </p>
                                )}

                                <input
                                    type="text"
                                    placeholder="Enter subject name"
                                    {...register("subject_name")}
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                />
                                {errors.subject_name && (
                                    <p className="mt-1 text-sm text-red-600">
                                        {errors.subject_name.message}
                                    </p>
                                )}
                                </div>

                                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                                    <button
                                        type="submit"
                                        className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm"
                                    >
                                        Save
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setShowAddModal((prev) => !prev);
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

export default AddSubjectModal