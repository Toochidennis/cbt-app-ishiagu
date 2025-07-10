import React, { useEffect } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import Select from 'react-select'
import { type SubjectModalProps } from '@/types/admin/ui/subject'
import { type AssignSubjectDto } from '@/types/admin/api/subject'
import { assignSubjectSchema } from '@/validations/subject.schema'
import type { SelectOption } from '@/types/shared'



const AssignSubjectToClassModal: React.FC<SubjectModalProps> = ({
    assignSubject,
    setAssignSubject
}) => {
    const {
        control,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<AssignSubjectDto>({
        resolver: yupResolver(assignSubjectSchema)
    })

    const [subjectsList, setSubjectsList] = React.useState<SelectOption[]>([]);
    const [classesList, setClassesList] = React.useState<SelectOption[]>([]);

    async function getSubjects() {
        try {
            const { data } = await window.api.invoke('subject:get');

            if (Array.isArray(data)) {
                let subjects = data.map(subject => ({
                    value: subject.id ?? '',
                    label: subject.name
                }));
                setSubjectsList(subjects);
            }
        } catch (error) {
            console.error("Failed to load subjects", error);
        }
    }

    async function getClasses() {
        try{
            const {data} = await window.api.invoke('class:get')

            if (Array.isArray(data)) {
                let classes = data.map(cls => ({
                    value: cls.id ?? '',
                    label: cls.name
                }));
                setClassesList(classes);
            }
        }catch(error){
            console.error("Failed to load subjects", error);
        }
    }

    useEffect(() => {
        getClasses();
        getSubjects();
    }, []);


    const onSubmit = async (input: AssignSubjectDto) => {
        console.log(input);
        for(const cls of input.classes){
            const {data} = await window.api.invoke('user:get', cls.value )
            console.log(data);
        }
    }


    return (
        <>
            {assignSubject && (
                <div className='fixed inset-0 z-50 flex items-center justify-center'>
                    {/** Backdrop */}
                    <div className='fixed inset-0 bg-black opacity-50 z-40'></div>

                    {/** Modal */}
                    <div className='relative z-50 align-bottom bg-white rounded-lg shadow-xl transform transition-all sm:my-8 sm:max-w-sm sm:align-middle sm:w-full'>
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <div className='px-4 pt-5 pb-4 sm:p-6'>
                                <h3 className='text-lg leading-6 font-medium text-gray-900 mb-4'>
                                    Assign Subjects
                                </h3>
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
                                            setAssignSubject((prev) => !prev);
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

export default AssignSubjectToClassModal