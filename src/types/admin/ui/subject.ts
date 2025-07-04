import type React from "react";

export interface SubjectModalProps {
    assignSubject: boolean;
    setAssignSubject: React.Dispatch<React.SetStateAction<boolean>>;
}