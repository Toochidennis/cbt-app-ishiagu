import React, { useEffect } from "react";
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from "@hookform/resolvers/yup";
import { type CreateExamProps } from "@/types/admin/ui/exam";
import { examSchema } from "@/validations/exam.schema";
import { type CreateExamDto } from "@/types/admin/api/exam";
import Select from 'react-select'
import type { SelectOption } from "@/types/shared";
import { toast } from "react-toastify";
import type { CreateExamSchedule, CreateQuestion } from "@/types/ipc/ipcTypes";
import { useAuthStore } from "@/states/AuthStore";


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

    const [subjectsList, setSubjectsList] = React.useState<SelectOption[]>([]);
    const [classesList, setClassesList] = React.useState<SelectOption[]>([]);
    const settings = useAuthStore((state) => state.settings);

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
        try {
            const { data } = await window.api.invoke('class:get')

            if (Array.isArray(data)) {
                let classes = data.map(cls => ({
                    value: cls.id ?? '',
                    label: cls.name
                }));
                setClassesList(classes);
            }
        } catch (error) {
            console.error("Failed to load subjects", error);
        }
    }

    useEffect(() => {
        getClasses();
        getSubjects();
    }, []);

    const handleCreateExam = async (data: CreateExamDto) => {
        console.log(data);
        const file: File = data.questions_file;
        const classes = data.class;
        const subject = data.subject;

        if (!file) return;

        const toastId = toast.loading('Scheduling exam...');

        try {
            if (settings) {
                const examSchedule: CreateExamSchedule = {
                    description: data.name,
                    examDate: data.date,
                    durationMinutes: data.duration,
                    year: settings.year,
                    term: settings.term,
                    subjectId: subject.value,
                    classId: classes.value,
                    time: data.time
                };

                const { id } = await window.api.invoke('exam-schedule:create', examSchedule);

                const reader = new FileReader();

                reader.onload = async (event) => {
                    try {
                        const json = JSON.parse(event.target?.result as string);
                        const questions: CreateQuestion[] = [];

                        for (const question of json) {
                            const opts = [
                                { label: "A", value: question.option_1 },
                                { label: "B", value: question.option_2 },
                                { label: "C", value: question.option_3 },
                                { label: "D", value: question.option_4 },
                            ];

                            questions.push({
                                examScheduleId: id,
                                questionText: JSON.stringify({
                                    text: question.question,
                                    image: question.image,
                                    passage: question.passage ?? ''
                                }),
                                options: JSON.stringify(opts),
                                marks: 2,
                                correctOption: question.answer,
                            });
                        }

                        const results = await window.api.invoke('question:create-many', questions);
                        console.log('Inserted questions:', results);

                        toast.update(toastId, {
                            render: "Exam scheduled successfully!",
                            type: "success",
                            isLoading: false,
                            autoClose: 3000,
                        });

                        reset();
                    } catch (error) {
                        console.error("Invalid JSON or failed insert:", error);
                        toast.update(toastId, {
                            render: "Error scheduling exam!",
                            type: "error",
                            isLoading: false,
                            autoClose: 3000,
                        });
                    }
                };

                reader.readAsText(file);
            }
        } catch (error) {
            console.error("Error creating exam schedule:", error);
            toast.update(toastId, {
                render: "Error scheduling exam!",
                type: "error",
                isLoading: false,
                autoClose: 3000,
            });
        }
    };


    return (
        <>
            {showCreateModal && (
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
                                                        options={subjectsList}
                                                        classNamePrefix="react-select"
                                                        onChange={(val) => field.onChange(val || null)}
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
                                                        options={classesList}
                                                        classNamePrefix="react-select"
                                                        // menuPlacement="auto"
                                                        // menuShouldScrollIntoView={true}
                                                        isClearable
                                                        onChange={(val) => field.onChange(val || null)}
                                                    // styles={{
                                                    //     menu: (provided) => ({
                                                    //         ...provided,
                                                    //         maxHeight: 200,
                                                    //         overflowY: "auto",
                                                    //     }),
                                                    // }}
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
            )}
        </>
    );
};

export default CreateExamModal;

