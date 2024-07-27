import "../../assets/styles/tab-account.css";
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store/index.ts';
import { getAccountStatus } from '../../store/slices/accountSlice.ts';
import { Table } from 'react-bootstrap';

const AccountInfo: React.FC = () => {
    const dispatch = useDispatch();
    const account = useSelector((state: RootState) => state.accountInfo);

    useEffect(() => {
        dispatch(getAccountStatus());
    }, [dispatch]);


    return (
        <div className="account-data">
            <div>
            <Table striped bordered hover size="sm text-start">
            <tbody>
                <tr>
                <td><span>First name:</span></td>
                <td className="ps-2">{account.user.firstname}</td>
                </tr>
                <tr>
                <td><span>Last name:</span></td>
                <td className="ps-2">{account.user.lastname}</td>
                </tr>
                <tr>
                <td><span>Role:</span></td>
                <td className="ps-2">{account.user.role}</td>
                </tr>
                <tr>
                <td><span>Permissions:</span></td>
                <td className="ps-2">{account.user.permissions.length > 0 ? account.user.permissions.join(', ') : 'No permissions available :('}</td>
                </tr>
            </tbody>
            </Table>
            </div>
        </div>
    );
};

export default AccountInfo;
