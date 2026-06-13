import React from 'react';
import { DepartmentLoginWrapper } from '../../components/DepartmentLoginWrapper';
import { ReceptionPortal } from './ReceptionPortal';

export default function ReceptionLoginPage() {
    return (
        <DepartmentLoginWrapper departmentName="Reception">
            <ReceptionPortal />
        </DepartmentLoginWrapper>
    );
}
