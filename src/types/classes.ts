export interface ClassFormData {
    name: string
}

export interface AddClassProps {
    showAddModal: boolean;
    setShowAddModal: React.Dispatch<React.SetStateAction<boolean>>;
}