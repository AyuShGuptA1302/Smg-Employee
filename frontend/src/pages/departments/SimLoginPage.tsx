import React from 'react';
import { DepartmentLoginWrapper } from '../../components/DepartmentLoginWrapper';
import { SimPortal } from './SimPortal';

export default function SimLoginPage() {
    return (
        <DepartmentLoginWrapper departmentName="Sim">
            <SimPortal />
        </DepartmentLoginWrapper>
    );
}
