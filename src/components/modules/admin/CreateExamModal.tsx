import React from "react";
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from "@hookform/resolvers/yup";
import { type CreateExamProps } from "@/types/admin/ui/exam";
import { examSchema } from "@/validations/exam.schema";
import { type CreateExamDto } from "@/types/admin/api/exam";
import Select from 'react-select'


const CreateExamModal: React.FC<CreateExamProps> = ({
    showCreateModal,
    setShowCreateModal,
}) => {

    const {
        register,
        handleSubmit,
        control,
        formState: { errors, },
        reset
    } = useForm<CreateExamDto>({
        resolver: yupResolver(examSchema)
    })

    const handleCreateExam = (data: CreateExamDto) => {
        //  e.preventDefault();
        console.log(data);
        reset()

        // onChange={(e) => {
        //     const file = e.target.files?.[0];
        //     field.onChange(file);
        //     if (file) {
        //         const reader = new FileReader();
        //         reader.onload = (event) => {
        //             try {
        //                 const json = JSON.parse(event.target?.result as string);
        //                 console.log("Parsed JSON:", json);
        //                 // store to state if needed
        //             } catch (error) {
        //                 console.error("Invalid JSON file.");
        //                 alert("Invalid JSON file.");
        //             }
        //         };
        //         reader.readAsText(file);
        //     }
        // }}
    };

    const subjectList = [
        { value: 1, label: 'Mathematics' },
        { value: 2, label: 'English' },
        { value: 3, label: 'Physics' },
    ]

    const classList = [
        { value: 1, label: 'JSS1' },
        { value: 2, label: 'JSS2' },
        { value: 3, label: 'JSS3' },
        { value: 4, label: 'JSS3' },
        { value: 5, label: 'JSS3' },
        { value: 6, label: 'JSS3' },
    ]

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center ">
            <div className="fixed inset-0 bg-black opacity-50 z-40"></div>
            <div className=" relative z-50 inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                <form onSubmit={handleSubmit(handleCreateExam)}>
                    <div className="bg-white px-4 pt-5 pb-4 sm:p-6 mb-4">
                        <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Create New Exam</h3>
                        <div className="space-y-4">
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700">Exam Name</label>
                                <input
                                    type="text"
                                    placeholder="Enter exam name"
                                    {...register('name')}
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                />
                                {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>}
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="subject" className="block text-sm font-medium mb-1 text-gray-700">Subject</label>
                                    <Controller
                                        name="subject"
                                        control={control}
                                        render={({ field }) => (
                                            <Select
                                                {...field}
                                                options={subjectList}
                                                menuPlacement="auto"
                                                menuShouldScrollIntoView={true}
                                                isClearable
                                                classNamePrefix="react-select"
                                                onChange={(val) => field.onChange(val || null)}
                                                styles={{
                                                    menu: (provided) => ({
                                                        ...provided,
                                                        maxHeight: 200,
                                                        overflowY: "auto",
                                                    }),
                                                }}
                                            />
                                        )}
                                    />
                                    {errors.subject && <p className="mt-1 text-sm text-red-600">{errors.subject.message}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Assign Class
                                    </label>
                                    <Controller
                                        name="class"
                                        control={control}
                                        render={({ field }) => (
                                            <Select
                                                {...field}
                                                options={classList}
                                                classNamePrefix="react-select"
                                                menuPlacement="auto"
                                                menuShouldScrollIntoView={true}
                                                isClearable
                                                onChange={(val) => field.onChange(val || null)}
                                                styles={{
                                                    menu: (provided) => ({
                                                        ...provided,
                                                        maxHeight: 200,
                                                        overflowY: "auto",
                                                    }),
                                                }}
                                            />
                                        )}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="date" className="block text-sm font-medium text-gray-700">Date</label>
                                    <input
                                        type="date"
                                        {...register("date")}
                                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                    />
                                    {errors.date && <p className="mt-1 text-sm text-red-600">{errors.date.message}</p>}
                                </div>
                                <div>
                                    <label htmlFor="time" className="block text-sm font-medium text-gray-700">Time</label>
                                    <input
                                        type="time"
                                        {...register("time")}
                                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                    />
                                    {errors.time && <p className="mt-1 text-sm text-red-600">{errors.time.message}</p>}
                                </div>
                            </div>

                            <div>
                                <label htmlFor="duration" className="block text-sm font-medium text-gray-700">Duration</label>
                                <input
                                    type="numeric"
                                    placeholder="e.g. 2 hours, 30 minutes"
                                    {...register("duration")}
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                />
                                {errors.duration && <p className="mt-1 text-sm text-red-600">{errors.duration.message}</p>}
                            </div>

                            <div className="">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Upload Questions
                                </label>
                                <Controller
                                    name="questions_file"
                                    control={control}
                                    render={({ field }) => (
                                        <input
                                            type="file"
                                            accept=".json"
                                            onChange={(e) => field.onChange(e.target.files?.[0])}
                                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 text-sm text-gray-700 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                                        />
                                    )}
                                />
                                {errors.questions_file && (
                                    <p className="mt-1 text-sm text-red-600">
                                        {errors.questions_file.message}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                        <button
                            type="submit"
                            className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm cursor-pointer"
                        >
                            Create Exam
                        </button>
                        <button
                            type="button"
                            onClick={() => {
                                setShowCreateModal(false);
                                reset({ name: "" })
                            }}
                            className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:w-auto sm:text-sm cursor-pointer"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateExamModal;
