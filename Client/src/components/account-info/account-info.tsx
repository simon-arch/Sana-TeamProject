import "../../assets/styles/tab-account.css";
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store/index.ts';
import { getAccountStatus, logout } from '../../store/slices/accountSlice.ts';
import { Button, Table } from 'react-bootstrap';

const AccountInfo: React.FC = () => {
    const dispatch = useDispatch();
    const account = useSelector((state: RootState) => state.accountInfo);

    useEffect(() => {
        dispatch(getAccountStatus());
    }, [dispatch]);

    const handleLogout = () => {
        dispatch(logout());
    };

    return (
        <div className="account-data">
            <div>
            <Table striped bordered hover size="sm text-start">
            <tbody>
                <tr>
                <td><span>Username:</span></td>
                <td className="ps-2">{account.name}</td>
                </tr>
                <tr>
                <td><span>Role:</span></td>
                <td className="ps-2">{account.role}</td>
                </tr>
                <tr>
                <td><span>Permissions:</span></td>
                <td className="ps-2">{account.permissions.length > 0 ? account.permissions.join(', ') : 'No permissions available :('}</td>
                </tr>
            </tbody>
            </Table>
            </div>
            <Button variant='outline-danger' id="logout-button" onClick={handleLogout}>Logout</Button>
        </div>
    );
};

export default AccountInfo;
