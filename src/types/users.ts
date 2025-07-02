export interface UserFormData {
    surname: string;
    middle_name?: string | null;
    first_name: string;
    gender: "Male" | "Female";
    date_of_birth?: string | null;
    contact?: string | null;
    role: "Admin" | "Staff" | "Student";
    class?: string | null;
    address?: string | null;
    state: string;
    lga?: string | null;
    city?: string | null;
}

export interface AddUserFormProps {
    showAddModal: boolean;
    setShowAddModal: React.Dispatch<React.SetStateAction<boolean>>;
}