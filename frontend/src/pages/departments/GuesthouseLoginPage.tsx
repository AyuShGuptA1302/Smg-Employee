import React from 'react';
import { DepartmentLoginWrapper } from '../../components/DepartmentLoginWrapper';
import { GuesthousePortal } from './GuesthousePortal';

export default function GuesthouseLoginPage() {
    return (
        <DepartmentLoginWrapper departmentName="Guesthouse">
            <GuesthousePortal />
        </DepartmentLoginWrapper>
    );
}
