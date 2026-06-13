import React from 'react';
import { DepartmentLoginWrapper } from '../../components/DepartmentLoginWrapper';
import { UniformPortal } from './UniformPortal';

export default function UniformLoginPage() {
    return (
        <DepartmentLoginWrapper departmentName="Uniform">
            <UniformPortal />
        </DepartmentLoginWrapper>
    );
}
