import type { SelectOption } from "@/types/shared";

export interface CreateExamDto {
    name: string;
    subject: SelectOption;
    date: string;
    time: string;
    duration: number;
    class: SelectOption;
    questions_file: File;
}
//status: "Upcoming" | "In Progress" | "Completed";