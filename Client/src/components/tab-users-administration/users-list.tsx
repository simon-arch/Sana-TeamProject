import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../store";
import {useEffect} from "react";
import {getUsers} from "../../store/slices/userSlice.ts";
import {Dropdown, Table} from "react-bootstrap";

const UsersList: React.FC = () => {
    const dispatch = useDispatch();
    const users = useSelector((state: RootState) => state.users.users);

    useEffect(() => {
        dispatch(getUsers());
    }, [dispatch]);

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
                    </tr>

                ))}
                </tbody>
            </Table>
        </>
    );
}

export default UsersList;