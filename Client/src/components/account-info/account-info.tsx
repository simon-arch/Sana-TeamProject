import "../../assets/styles/tab-account.css";
import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/index.ts';
import { Table } from 'react-bootstrap';
import { Capitalize } from "../tab-roles/usercard.tsx";

const AccountInfo: React.FC = () => {
    const account = useSelector((state: RootState) => state.accountInfo);
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
                <td className="ps-2">{Capitalize(account.user.role)}</td>
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
