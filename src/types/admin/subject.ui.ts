import type React from "react";

export interface SubjectModalProps {
    showAddModal: boolean;
    setShowAddModal: React.Dispatch<React.SetStateAction<boolean>>;
}