import "../../assets/styles/tab-roles.css";
import UserCard from "./usercard";
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from "../../store";
import { useEffect } from "react";
import { getUsers } from "../../store/slices/userSlice";
import { getRoles } from "../../store/slices/roleSlice";


function RoleMenu() {
    const dispatch = useDispatch();

    useEffect(() => {
      dispatch(getUsers());
      dispatch(getRoles());
    }, [dispatch]);

    const users = useSelector((state: RootState) => state.users);
    const roles = useSelector((state: RootState) => state.roles);

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