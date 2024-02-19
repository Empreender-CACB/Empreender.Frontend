import React, { ReactNode } from 'react';
import { useAppSelector } from '@/store';

interface ForbiddenProps {
    permissions: string[];
    children: React.ReactNode;
    logic?: 'and' | 'or';
}

const Forbidden: React.FC<ForbiddenProps> = ({ permissions, children, logic = 'or' }) => {
    const { recursos } = useAppSelector(state => state.auth.user);

    let hasPermission: boolean;

    if (logic === 'or') {
        hasPermission = permissions.some(permission => recursos?.includes(permission));
    } else {
        hasPermission = permissions.every(permission => recursos?.includes(permission));
    }

    return hasPermission ? <>{children}</> : null;
};


export default Forbidden;
