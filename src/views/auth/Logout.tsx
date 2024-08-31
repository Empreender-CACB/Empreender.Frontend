import { useEffect } from 'react';
import useAuth from '@/utils/hooks/useAuth'

const Logout = () => {
    const { signOut } = useAuth();

    useEffect(() => {
        signOut();
    }, [signOut]);

    return <></>;
};

export default Logout;
