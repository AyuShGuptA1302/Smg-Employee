import React from 'react';
import { DepartmentLoginWrapper } from '../../components/DepartmentLoginWrapper';
import { TransportPortal } from './TransportPortal';

export default function TransportLoginPage() {
    return (
        <DepartmentLoginWrapper departmentName="Transport">
            <TransportPortal />
        </DepartmentLoginWrapper>
    );
}
