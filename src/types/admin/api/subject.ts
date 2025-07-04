import type { SelectOption } from "@/types/shared";
export interface CreateSubjectDto {
    subject_code: string;
    subject_name: string;
}

export interface AssignSubjectDto {
    classes: SelectOption[];
    subjects: SelectOption[];
}