import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store';
import {checkAuthStatus, logout} from '../../hooks/accountSlice.ts';

const AccountInfo: React.FC = () => {
    const dispatch = useDispatch();
    const account = useSelector((state: RootState) => state.accountInfo);

    useEffect(() => {
        dispatch(checkAuthStatus());
    }, [dispatch]);

    const handleLogout = () => {
        dispatch(logout());
    };

    return (
        <div>
            <div>
                <p>Username: {account.name}</p>
                <p>Role: {account.role}</p>
                <p>Permissions: {account.permissions.length > 0 ? account.permissions.join(', ') : 'No permissions available.'}</p>
            </div>
            <button onClick={handleLogout}>Logout</button>
        </div>
    );
};

export default AccountInfo;
