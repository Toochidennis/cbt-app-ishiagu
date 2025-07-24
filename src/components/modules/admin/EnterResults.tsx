import React, { useState, useEffect } from 'react';
import type { CreateClass, CreateSubject } from '@/types/ipc/ipcTypes';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from "@/states/AuthStore";

const EnterResults: React.FC = () => {
    const [selectedClass, setSelectedClass] = React.useState('');
    const [subjects, setSubjects] = useState<CreateSubject[]>([]);
    const [classes, setClasses] = useState<CreateClass[]>([]);
    const navigate = useNavigate();
    const settings = useAuthStore((state) => state.settings);


    return (
        <>
        </>
    );

}
export default EnterResults;