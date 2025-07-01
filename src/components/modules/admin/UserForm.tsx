import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { userSchema } from "@/validations/UserSchema";

interface Props {
    showAddModal: Boolean;
    setShowAddModal: (value: Boolean) => void;
}

const UserForm: React.FC<Props> = ({
    showAddModal,
    setShowAddModal,
}) => {
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm({
        resolver: yupResolver(userSchema),
        defaultValues: {
            surname: "",
            middle_name: "",
            first_name: "",
            gender: "",
            date_of_birth: "",
            email: "",
            role: "",
            class: "",
            address: "",
            state: "",
            lga: "",
            city: "",
        },
    });

    const [users, setUsers] = useState([{}])

    const onSubmit = (data) => {
        const userInitials = `${data.firstname[0] || ""}${data.surname[0] || ""}`.toUpperCase();
        const newUserData = {
            ...data,
            id: users.length + 1,
            avatar: userInitials,
        };

        setUsers([...users, newUserData]);
        setShowAddModal(false);
        reset();
    };

    return (
        <>
            {showAddModal && (
                <div className="fixed inset-0 z-50 overflow-y-auto">
                    <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
                        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
                            <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
                        </div>
                        <span
                            className="hidden sm:inline-block sm:align-middle sm:h-screen"
                            aria-hidden="true"
                        >
                            &#8203;
                        </span>
                        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                            <form onSubmit={handleSubmit(onSubmit)}>
                                <div className="bg-white px-4 pt-5 pb-4 sm:p-6">
                                    <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                                        Add New User
                                    </h3>
                                    <div className="space-y-4">
                                        {/* Surname */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">
                                                Surname
                                            </label>
                                            <input
                                                type="text"
                                                {...register("surname")}
                                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                            />
                                            {errors.surname && (
                                                <p className="mt-1 text-sm text-red-600">
                                                    {errors.surname.message}
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
                                                {...register("middle_name")}
                                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                            />
                                        </div>

                                        {/* First name */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">
                                                First name
                                            </label>
                                            <input
                                                type="text"
                                                {...register("first_name")}
                                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                            />
                                            {errors.first_name && (
                                                <p className="mt-1 text-sm text-red-600">
                                                    {errors.first_name.message}
                                                </p>
                                            )}
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
                                                {...register("date_of_birth")}
                                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                            />
                                        </div>

                                        {/* Email */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">
                                                Email
                                            </label>
                                            <input
                                                type="email"
                                                {...register("email")}
                                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                            />
                                            {errors.email && (
                                                <p className="mt-1 text-sm text-red-600">
                                                    {errors.email.message}
                                                </p>
                                            )}
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
                                            <select
                                                {...register("class")}
                                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                            >
                                                <option value="">Select Class</option>
                                                {classesList.map((cls) => (
                                                    <option key={cls.id} value={cls.name}>
                                                        {cls.name}
                                                    </option>
                                                ))}
                                            </select>
                                            {errors.class && (
                                                <p className="mt-1 text-sm text-red-600">
                                                    {errors.class.message}
                                                </p>
                                            )}
                                        </div>

                                        {/* Address */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">
                                                Address
                                            </label>
                                            <input
                                                type="text"
                                                {...register("address")}
                                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                            />
                                        </div>

                                        {/* State */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">
                                                State
                                            </label>
                                            <input
                                                type="text"
                                                {...register("state")}
                                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                            />
                                        </div>

                                        {/* LGA */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">
                                                LGA
                                            </label>
                                            <input
                                                type="text"
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
                                                {...register("city")}
                                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                            />
                                        </div>
                                    </div>
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
                                            setShowAddModal(false);
                                            reset();
                                        }}
                                        className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:w-auto sm:text-sm"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default UserForm;
