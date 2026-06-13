import React from 'react';
import { DepartmentLoginWrapper } from '../../components/DepartmentLoginWrapper';
import { TimeOfficePortal } from './TimeOfficePortal';

export default function TimeOfficeLoginPage() {
    return (
        <DepartmentLoginWrapper departmentName="Time Office">
            <TimeOfficePortal />
        </DepartmentLoginWrapper>
    );
}
