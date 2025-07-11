import React, { useState, useEffect } from "react";
import { Controller, useForm, type Resolver } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import Select from 'react-select'
import { toast } from "react-toastify";
import { userSchema } from "@/validations/user.schema";
import { type UserFormData, type AddUserFormProps } from "@/types/admin/api/users";
import { type CreateUser } from "@/types/ipc/ipcTypes";
import type { SelectOption } from "@/types/shared";

const AddUserForm: React.FC<AddUserFormProps> = ({
    showAddModal,
    setShowAddModal
}) => {
    const {
        register,
        control,
        handleSubmit,
        formState: { errors },
        reset,
        watch,
    } = useForm<UserFormData>({
        resolver: yupResolver(userSchema) as Resolver<UserFormData>,
    });

    const [classesList, setClassesList] = useState<SelectOption[]>([]);
    const role = watch('role');

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
    }, []);

    function generatePassword(name: string): string {
        const cleanedName = name.replace(/\s/g, '');
        const prefix = cleanedName.length >= 5 ? cleanedName.substring(0, 5) : cleanedName;
        const randomNumbers = Math.floor(1000 + Math.random() * 9000);
        return prefix + randomNumbers;
    }

    const onSubmit = (data: UserFormData) => {
        console.log(data);
        const file: File = data.usersFile;
    
        // if (file) {
        //     const toastId = toast.loading('Inserting users...');
        //     const reader = new FileReader();
    
        //     reader.onload = async (event) => {
        //         try {
        //             const json = JSON.parse(event.target?.result as string);
    
        //             const users: CreateUser[] = [];
    
        //             for (const user of json) {
        //                 const plainPassword = generatePassword(user.surname);
    
        //                 const createUser: CreateUser = {
        //                     regNumber: user.reg_number,
        //                     role: "student",
        //                     surname: user.surname,
        //                     firstName: user.firstname,
        //                     middleName: user.middlename,
        //                     classId: user.class_id,
        //                     gender: "male",
        //                     username: user.reg_number,
        //                     passwordHash: plainPassword,
        //                     isActive: 1
        //                 };

        //                 users.push(createUser);
        //             }

        //             const { id } = await window.api.invoke('user:create-many', users);

        //             toast.update(toastId, {
        //                 render: `${id} user(s) inserted.`,
        //                 type: "success",
        //                 isLoading: false,
        //                 autoClose: 3000,
        //             });

        //         } catch (error) {
        //             console.error("Invalid JSON file.", error);
        //             toast.update(toastId, {
        //                 render: "Error inserting users!",
        //                 type: "error",
        //                 isLoading: false,
        //                 autoClose: 3000,
        //             });
        //         }
        //     };
    
        //     reader.readAsText(file);
        // }
    
        reset();
    };    

    return (
        <>
            {showAddModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center">
                    {/** Backdrop */}
                    <div className="fixed inset-0 bg-black opacity-50 z-40"></div>

                    {/** Modal */}
                    <div className="relative z-50 inline-block align-bottom bg-white rounded-lg text-left overflow-y-auto max-h-[90vh] shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <div className="bg-white px-4 pt-5 pb-4 sm:p-6">
                                <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                                    Add New User
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {/* Surname */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">
                                            Surname
                                        </label>
                                        <input
                                            type="text"
                                            placeholder="Enter surname"
                                            {...register("surname")}
                                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                        />
                                        {errors.surname && (
                                            <p className="mt-1 text-sm text-red-600">
                                                {errors.surname.message}
                                            </p>
                                        )}
                                    </div>

                                    {/* First name */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">
                                            First name
                                        </label>
                                        <input
                                            type="text"
                                            placeholder="Enter first name"
                                            {...register("firstName")}
                                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                        />
                                        {errors.firstName && (
                                            <p className="mt-1 text-sm text-red-600">
                                                {errors.firstName.message}
                                            </p>
                                        )}
                                    </div>

                                    {/* Middle Name */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">
                                            Middle Name
                                        </label>
                                        <input
                                            type="text"
                                            placeholder="Enter middle name"
                                            {...register("middleName")}
                                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                        />
                                    </div>

                                    {/* Gender */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">
                                            Gender
                                        </label>
                                        <select
                                            {...register("gender")}
                                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                        >
                                            <option value="">Select Gender</option>
                                            <option value="Male">Male</option>
                                            <option value="Female">Female</option>
                                        </select>
                                        {errors.gender && (
                                            <p className="mt-1 text-sm text-red-600">
                                                {errors.gender.message}
                                            </p>
                                        )}
                                    </div>

                                    {/* Date of Birth */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">
                                            Date of Birth
                                        </label>
                                        <input
                                            type="date"
                                            {...register("dateOfBirth")}
                                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                        />
                                    </div>

                                    {/* Email */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">
                                            Contact
                                        </label>
                                        <input
                                            type="tel"
                                            placeholder="Enter contact"
                                            {...register("contact")}
                                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                        />
                                    </div>

                                    {/* Role */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">
                                            Role
                                        </label>
                                        <select
                                            {...register("role")}
                                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                        >
                                            <option value="">Select Role</option>
                                            <option value="Admin">Admin</option>
                                            <option value="Staff">Staff</option>
                                            <option value="Student">Student</option>
                                        </select>
                                        {errors.role && (
                                            <p className="mt-1 text-sm text-red-600">
                                                {errors.role.message}
                                            </p>
                                        )}
                                    </div>

                                    {/* Class */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">
                                            Class
                                        </label>
                                        {role === "Student" && (
                                            <Controller
                                                name='classes'
                                                control={control}
                                                render={({ field }) => (
                                                    <Select
                                                        {...field}
                                                        options={classesList}
                                                        classNamePrefix='react-select'
                                                        onChange={(val) => field.onChange(val)}
                                                    />
                                                )} />
                                            )}
                                            {errors.classes && <p className="text-sm text-red-600 mt-1">{errors.classes.message}</p>}
                                    </div>
                                    {/* State */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">
                                            State
                                        </label>
                                        <input
                                            type="text"
                                            placeholder="Enter State"
                                            {...register("state")}
                                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                        />
                                        {errors.state && (
                                            <p className="mt-1 text-sm text-red-600">
                                                {errors.state.message}
                                            </p>
                                        )}
                                    </div>

                                    {/* LGA */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">
                                            LGA
                                        </label>
                                        <input
                                            type="text"
                                            placeholder="Enter LGA"
                                            {...register("lga")}
                                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                        />
                                    </div>

                                    {/* City */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">
                                            City
                                        </label>
                                        <input
                                            type="text"
                                            placeholder="Enter City"
                                            {...register("city")}
                                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                        />
                                    </div>

                                    {/* Address */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">
                                            Address
                                        </label>
                                        <input
                                            type="text"
                                            placeholder="Enter Address"
                                            {...register("address")}
                                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                        />
                                    </div>
                                </div>
                                <div className="">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Upload Questions
                                    </label>
                                    <Controller
                                        name="usersFile"
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
                                    {errors.usersFile && (
                                        <p className="mt-1 text-sm text-red-600">
                                            {errors.usersFile.message}
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div className="bg-gray-50 px-2 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                                <button
                                    type="submit"
                                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm cursor-pointer"
                                >
                                    Save
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowAddModal((prev) => !prev);
                                        reset();
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

export default AddUserForm;
