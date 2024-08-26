import {useEffect, useState} from 'react';
import {useAppSelector} from '../../../hooks/redux';
import User, {UserLite} from '../../../models/User';

interface Props {
    user: User;
    isEdited: boolean;
    setEdited(prevState: boolean): void;
    setApprovers(prevState: Record<string, boolean>): void;
    usersWithApprovalPermission: Record<string, boolean>;
}

const ApprovedVacationsByUsersSelect = (props: Props) => {
    const users = useAppSelector<UserLite[]>(state => state.users.usersWithApprovalPermission);

    const [sourceCheckboxes, setSourceCheckboxes] = useState<Record<string, boolean>>({});

    useEffect(() => {
        if (props.user && Array.isArray(props.user.approvedVacationsByUsers) && users.length > 0) {
            const target: Record<string, boolean> = {};
            users.forEach(user => {
                target[user.username] = props.user.approvedVacationsByUsers.includes(user.username);
            });
            props.setApprovers(target);
            setSourceCheckboxes(target);
            props.setEdited(false);
        }
    }, [users, props.user, props.setApprovers, props.setEdited]);

    const handleCheckboxChange = (username: string) => {
        const updatedApprovers = {
            ...props.usersWithApprovalPermission,
            [username]: !props.usersWithApprovalPermission[username]
        };
        props.setApprovers(updatedApprovers);
    };

    useEffect(() => {
        props.setEdited(props.usersWithApprovalPermission !== sourceCheckboxes);
    }, [props.usersWithApprovalPermission]);

    return (
        <div>
            <h2>Approved Vacations by Users</h2>
            <table className="table text-start table-bordered">
                <tbody>
                {users.map(user => (
                    <tr key={user.username}>
                        <td>
                            <input className="mx-2"
                                   id={user.username}
                                   name={user.username}
                                   type="checkbox"
                                   checked={props.usersWithApprovalPermission[user.username] || false}
                                   onChange={() => handleCheckboxChange(user.username)}
                            />
                            <label htmlFor={user.username}>{user.firstName} {user.lastName}</label>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};

export default ApprovedVacationsByUsersSelect;
