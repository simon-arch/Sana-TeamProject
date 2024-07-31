import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../store";
import {useEffect} from "react";
import {getSelectedUser, getUsers} from "../../store/slices/userSlice.ts";
import {Button, Dropdown, Table} from "react-bootstrap";
import {hasPermission} from "../../store/helper.ts";
import OffCanvas from "../offcanvas.tsx";
import EditUser from "./edit-user.tsx";


const UsersList: React.FC = () => {
    const dispatch = useDispatch();
    const users = useSelector((state: RootState) => state.users.users);
    const permissions = useSelector((state: RootState) => state.accountInfo.user.permissions);
    const canDeleteUsers = hasPermission(permissions, "DeleteUsers");
    const canEditUsers = hasPermission(permissions, "UpdateUsers", "ManageUserPermissions", "ManageUserRoles");

    useEffect(() => {
        dispatch(getUsers());
    }, [dispatch]);

    const handleEditClick = (userId: number) => {
        dispatch(getSelectedUser(userId));
    };

    return (
        <>
            <Table striped bordered hover>
                <thead>
                <tr>
                    <th>ID</th>
                    <th>Username</th>
                    <th>Full name</th>
                    <th>Role</th>
                    <th>Permissions</th>
                    <th>Register date</th>
                    <th>Last update</th>
                    <th>Last login</th>
                    <th>Actions</th>
                </tr>
                </thead>
                <tbody>
                {users.map(user => (
                    <tr key={user.id}>
                        <td>{user.id}</td>
                        <td>{user.username}</td>
                        <td>{user.firstname} {user.lastname}</td>
                        <td>{user.role}</td>
                        <td>
                            <Dropdown>
                                <Dropdown.Toggle variant="success" id="dropdown-basic">
                                    Display
                                </Dropdown.Toggle>

                                <Dropdown.Menu>
                                    {user.permissions.map(permission => (
                                        <Dropdown.Item key={permission}>{permission}</Dropdown.Item>
                                    ))}
                                </Dropdown.Menu>
                            </Dropdown>
                        </td>
                        <td>lorem ipsum</td>
                        <td>lorem ipsum</td>
                        <td>lorem ipsum</td>
                        <td>
                            {canEditUsers &&
                                <OffCanvas title="Edit User" placement="end"
                                           trigger={<Button onClick={() => handleEditClick(user.id)}>Edit</Button>}>
                                    <EditUser/>
                                </OffCanvas>
                            }

                            {canDeleteUsers && <Button>Delete</Button>}
                        </td>
                    </tr>

                ))}
                </tbody>
            </Table>
        </>
    );
}

export default UsersList;