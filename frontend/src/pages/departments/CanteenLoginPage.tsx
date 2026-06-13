import React from 'react';
import { DepartmentLoginWrapper } from '../../components/DepartmentLoginWrapper';
import { CanteenPortal } from './CanteenPortal';

export default function CanteenLoginPage() {
    return (
        <DepartmentLoginWrapper departmentName="Canteen">
            <CanteenPortal />
        </DepartmentLoginWrapper>
    );
}
