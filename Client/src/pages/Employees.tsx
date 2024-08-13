import {useEffect, useState} from 'react';
import {useAppDispatch, useAppSelector} from "../hooks/redux.ts";
import {getUsers, User} from "../store/slices/userSlice.ts";
import {Button, FormControl, FormGroup, FormLabel, FormSelect, InputGroup, Table} from "react-bootstrap";
import {HiMagnifyingGlass} from "react-icons/hi2";
import UserModal from "../components/UserModal/UserModal.tsx";
import {getRoles} from "../store/slices/roleSlice.ts";
import {getPermissions} from "../store/slices/permissionSlice.ts";
import {Capitalize} from "../helpers/format.ts";
import config from '../../config.json';
import RegisterUserModal from "../components/UserModal/RegisterUserModal.tsx";

import styles from "./styles/employees.module.css";

const Employees = () => {
    const dispatch = useAppDispatch();
    const usersRaw = useAppSelector(state => state.users.users);
    const account = useAppSelector<User>(state => state.accountInfo.user);
    
    useEffect(() => {
        setUsers(usersRaw);
    }, [dispatch, usersRaw])

    const [users, setUsers] = useState<User[]>(usersRaw);
    const [show, setShow] = useState(false);
    const [user, setUser] = useState<User>(null!);
    const [showRegisterModal, setShowRegisterModal] = useState(false);
    const [sort, setSort] = useState("name");
    const [prompt, setPrompt] = useState("");

    const openModal = (user: User) => {
        setShow(true);
        setUser(user);
    }

    const openRegisterModal = () => {
        setShowRegisterModal(true);
    };

    useEffect(() => {
        const source = [...users];
        switch (sort) {
            case "name":
                source.sort((a, b) => a.username.localeCompare(b.username));
                break;
            case "role":
                source.sort((a, b) => a.role.localeCompare(b.role));
                break;
            case "status":
                source.sort((a, b) => a.state.localeCompare(b.state));
                break;
        }
        setUsers(source);
    }, [dispatch, sort]);

    useEffect(() => {
        dispatch(getRoles());
        dispatch(getPermissions());
    }, [dispatch]);

    useEffect(() => {
        dispatch(getUsers());
    }, [dispatch, show]);

    useEffect(() => {
        setSort("name");
        setUsers(usersRaw);
        const source = [...usersRaw].filter(user => `${user.firstName} ${user.lastName}`.toLowerCase().startsWith(prompt));
        setUsers(source);
    }, [prompt])

    return (
        <div className="p-3">
            <div className="mb-5">
                <h1>Employees</h1>
                <p className="text-secondary">Complete list of employees</p>
            </div>
            <div className="my-3 d-flex justify-content-between">
                <div className="d-flex w-75 gap-4">
                    <InputGroup className="w-25">
                        <InputGroup.Text><HiMagnifyingGlass/></InputGroup.Text>
                        <FormControl type="text" placeholder="Quick search..." value={prompt}
                                     onChange={(e) => setPrompt(e.target.value)}/>
                    </InputGroup>
                    <FormGroup className="w-25 d-flex align-items-center">
                        <FormLabel className="text-secondary my-0 me-2"><small>Sort by</small></FormLabel>
                        <FormSelect className="w-75" value={sort} onChange={(e) => setSort(e.target.value)}>
                            <option value="name">Name</option>
                            <option value="role">Role</option>
                            <option value="status">Status</option>
                        </FormSelect>
                    </FormGroup>
                </div>
                {account.permissions &&
                    (account.permissions.includes(config.permissions.REGISTER_USER)) &&
                        <Button onClick={() => openRegisterModal()}>Add +</Button>}
            </div>
            <UserModal show={show} user={user} setShow = {setShow}/>
            <RegisterUserModal show={showRegisterModal} onHide={() => setShowRegisterModal(false)} />
            <Table hover className="border shadow rounded mb-5">
                <thead>
                <tr className={styles["table-header"]}>
                    <td>Name</td>
                    <td>Role</td>
                    <td>Status</td>
                    <td className="col-1">Action</td>
                </tr>
                </thead>
                <tbody>
                {users.map((user, index) => (
                    <tr key={index}>
                        <td className="p-3">{user.firstName} {user.lastName}</td>
                        <td className="p-3">{Capitalize(user.role)}</td>
                        <td className="p-3">
                            <span className={`${styles["badge"]} ${styles[`badge-${user.state.toLowerCase()}`]}`}>{Capitalize(user.state)}</span>
                        </td>
                        <td className="p-3">
                            <button onClick={() => openModal(user)} className="btn border py-0 px-2">...</button>
                        </td>
                    </tr>))}
                </tbody>
            </Table>
        </div>
    );
};

export default Employees;