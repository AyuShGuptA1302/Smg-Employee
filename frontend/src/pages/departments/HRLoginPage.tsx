import React from 'react';
import { DepartmentLoginWrapper } from '../../components/DepartmentLoginWrapper';
import { HRPortal } from './HRPortal';

export default function HRLoginPage() {
    return (
        <DepartmentLoginWrapper departmentName="HR">
            <HRPortal />
        </DepartmentLoginWrapper>
    );
}
