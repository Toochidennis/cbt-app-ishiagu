import type { SelectOption } from "@/types/shared";

export interface UserFormData {
    id?: string;
    surname: string;
    middleName?: string | null;
    firstName: string;
    gender: "Male" | "Female";
    dateOfBirth?: string | null;
    contact?: string | null;
    role: "Admin" | "Staff" | "Student";
    classes: SelectOption[];
    address?: string | null;
    state: string;
    lga?: string | null;
    city?: string | null;
    usersFile: File;
}

export interface AddUserFormProps {
    showAddModal: boolean;
    setShowAddModal: React.Dispatch<React.SetStateAction<boolean>>;
}