import type { CreateClass, CreateSubject } from '@/types/ipc/ipcTypes';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from "@/states/AuthStore";

const ResultSubjects: React.FC = () => {
    const [selectedClass, setSelectedClass] = React.useState('');
    const [subjects, setSubjects] = useState<CreateSubject[]>([]);
    const [classes, setClasses] = useState<CreateClass[]>([]);
    const navigate = useNavigate();
    const settings = useAuthStore((state) => state.settings);


    async function getSubjects(classId: string, term: number, year: number) {
        try {
            const { data } = await window.api.invoke('subject:get-by-class', { classId, term, year });
            if (Array.isArray(data)) {
                setSubjects(data);
            }
        } catch (error) {
            console.error("Failed to load subjects", error);
        }
    }

    useEffect(() => {
        const fetchClassesAndSubjects = async () => {
            const { data } = await window.api.invoke('class:get');
            if (Array.isArray(data) && data.length > 0) {
                setClasses(data);
                setSelectedClass(data[0].id!); // set default selected class by ID
                if (settings) {
                    getSubjects(data[0].id!, settings.term, settings.year);
                }

            }
        };

        fetchClassesAndSubjects();
    }, []);


    // Fetch subjects when selectedClass changes
    useEffect(() => {
        if (selectedClass) {
            if (settings) {
                getSubjects(selectedClass, settings.term, settings.year);
            }
        } else {
            setSubjects([]);
        }
    }, [selectedClass]);

    return (
        <>
            <button
                onClick={() => navigate('/results')}
                className="fixed z-50 flex items-center hover:bg-gray-300 p-2 rounded text-gray-600 hover:text-gray-900 cursor-pointer mt-2"
            >
                <i className="fas fa-arrow-left text-xl mr-2"></i>
                <span className="text-sm font-medium">Back</span>
            </button>

            <div className="z-50 mx-auto py-16">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
                    <div className="flex items-center gap-4">
                        <div className="flex-shrink-0">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Select Class
                            </label>
                            <select
                                value={selectedClass}
                                onChange={(e) => {
                                    const classId = e.target.value;
                                    setSelectedClass(classId);
                                    if (settings) {
                                        getSubjects(selectedClass, settings.term, settings.year);
                                    }
                                }
                                }
                                className="w-48 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pr-8"
                            >
                                <option value="">All Classes</option>
                                {classes.map((cls) => (
                                    <option key={cls.id} value={cls.id}>
                                        {cls.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-16">S/N</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subject Name</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subject Code</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Class</th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {subjects.map((subject, index) => {
                                    const currentClass = classes.find((cls) => cls.id === selectedClass);
                                    return (
                                        <tr
                                            key={subject.id}
                                            className={`${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-blue-50 transition-colors`}
                                        >
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{index + 1}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{subject.name}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{subject.code}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{currentClass?.name || 'N/A'}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <div className="flex items-center justify-end gap-2">
                                                    <button
                                                        onClick={() => {
                                                            // navigate('/results/add', {
                                                            //     state: {
                                                            //         subject,
                                                            //         class: currentClass,
                                                            //     }
                                                            // });
                                                        }}
                                                        className="px-4 py-2 bg-blue-600 text-white text-xs rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors whitespace-nowrap cursor-pointer"
                                                    >
                                                        Add/Update Results
                                                    </button>
                                                    <button
                                                        className="px-4 py-2 bg-gray-100 text-gray-700 text-xs rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors whitespace-nowrap cursor-pointer"
                                                    >
                                                        View Results
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ResultSubjects;
