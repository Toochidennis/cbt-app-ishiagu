import type { SelectOption } from "@/types/shared";

export type AssignTeacherDto = {
    teacher: SelectOption;
    subjects: SelectOption[];
    classes: SelectOption[];
};
