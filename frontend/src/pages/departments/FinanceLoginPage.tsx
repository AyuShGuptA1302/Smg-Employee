import React from 'react';
import { DepartmentLoginWrapper } from '../../components/DepartmentLoginWrapper';
import { FinancePortal } from './FinancePortal';

export default function FinanceLoginPage() {
    return (
        <DepartmentLoginWrapper departmentName="Finance">
            <FinancePortal />
        </DepartmentLoginWrapper>
    );
}
