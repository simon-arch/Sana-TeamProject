import "../../assets/styles/tab-roles.css";
import UserCard from "./usercard";
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from "../../store";
import { useEffect } from "react";
import { getUsers } from "../../store/slices/userSlice";
import { getRoles } from "../../store/slices/roleSlice";
import { Alert, Spinner } from "react-bootstrap";


function RoleMenu() {
    const dispatch = useDispatch();

    const usersState = useSelector((state: RootState) => state.users);
    const uStatus = usersState.status;
    const users = usersState.users;

    const rolesState = useSelector((state: RootState) => state.roles);
    const rStatus = rolesState.status;
    const roles = rolesState.roles;

    useEffect(() => {
      dispatch(getUsers());
      dispatch(getRoles());
    }, [dispatch]);

    if (uStatus == 'loading' || rStatus == 'loading')
      return <Spinner className="roleMenu-spinner" animation="border" role="status"></Spinner>;

    if (uStatus == 'error' || rStatus == 'error')
      return (<Alert variant='danger' className="text-center mx-2">Error fetching data.</Alert>)

    return (
      <>
        <table className="table table-striped table-bordered border">
            <thead>
                <tr>
                <th scope="col">Credentials</th>
                <th scope="col">Role</th>
                </tr>
            </thead>
            <tbody>
                {users.map((user, key) => (
                  <UserCard key={key} user={user} avaliableRoles={roles}></UserCard>
                ))}
            </tbody>
        </table>
      </>
    );
  }
  
export default RoleMenu;