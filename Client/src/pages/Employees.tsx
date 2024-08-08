import {useEffect, useState} from 'react';
import {useAppDispatch, useAppSelector} from "../hooks/redux.ts";
import {getUsers, User} from "../store/slices/userSlice.ts";
import {FormControl, FormGroup, FormLabel, FormSelect, InputGroup, Table} from "react-bootstrap";
import {HiMagnifyingGlass} from "react-icons/hi2";
import UserModal from "../components/UserModal/UserModal.tsx";
import {getRoles} from "../store/slices/roleSlice.ts";
import {getPermissions} from "../store/slices/permissionSlice.ts";
import {Capitalize} from "../helpers/format.ts";

const Employees = () => {
    const dispatch = useAppDispatch();
    const usersRaw = useAppSelector<User[]>(state => state.users.users);

    useEffect(() => {
        setUsers(usersRaw);
    }, [dispatch, usersRaw])

    const [users, setUsers] = useState<User[]>(usersRaw);
    const [show, setShow] = useState(false);
    const [user, setUser] = useState<User>(null!);
    const [sort, setSort] = useState("name");
    const [prompt, setPrompt] = useState("");

    const openModal = (user : User) => {
        setShow(true);
        setUser(user);
    }

    useEffect(() => {
        const source = [...users];
        switch (sort) {
            case "name":
                source.sort((a, b) => a.username.localeCompare(b.username));
                break;
            case "role":
                source.sort((a, b) => a.role.localeCompare(b.role));
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
        const source = [...usersRaw].filter(user => `${user.firstname} ${user.lastname}`.toLowerCase().startsWith(prompt));
        setUsers(source);
    }, [prompt])

    return (
        <div className="p-3">
            <div className="mb-5">
                <h1>Employees</h1>
                <p className="text-secondary">Complete list of employees</p>
            </div>
            {/*placeholder*/}
            <div className="my-3 d-flex gap-4">
                <InputGroup className="w-25">
                    <InputGroup.Text><HiMagnifyingGlass/></InputGroup.Text>
                    <FormControl type="text" placeholder="Quick search..." value={prompt} onChange={(e) => setPrompt(e.target.value)}/>
                </InputGroup>
                <FormGroup className="w-25 d-flex align-items-center">
                    <FormLabel className="text-secondary my-0 me-2"><small>Sort by</small></FormLabel>
                    <FormSelect className="w-75" value={sort} onChange={(e) => setSort(e.target.value)}>
                        <option value="name">Name</option>
                        <option value="role">Role</option>
                        <option value="status">Status [NOT IMPLEMENTED]</option>
                    </FormSelect>
                </FormGroup>
            </div>
            <UserModal show={show} onHide={() => setShow(false)} user={user}/>
            <Table hover className="border shadow rounded mb-5">
                <thead>
                <tr>
                    <td className="px-3 text-start text-secondary bg-light">Name</td>
                    <td className="px-3 text-start text-secondary bg-light">Role</td>
                    <td className="text-secondary bg-light">Status</td>
                    <td className="text-secondary bg-light col-1">Action</td>
                </tr>
                </thead>
                <tbody>
                {users.map((user, index) => (
                <tr key={index}>
                    <td className="p-3 text-start">{user.firstname} {user.lastname}</td>
                    <td className="p-3 text-start">{Capitalize(user.role)}</td>
                    <td className="p-3">
                        <span className="px-3 py-1 text-success rounded-pill border border-success">active</span>
                    </td>
                    <td className="p-3"><button onClick={() => openModal(user)} className="btn border py-0 px-2">...</button></td>
                </tr>))}
                </tbody>
            </Table>
            {/*placeholder
                <div className="d-flex justify-content-between">
                <Pagination>
                    <Pagination.First/>
                    <Pagination.Prev/>
                    <Pagination.Item active>1</Pagination.Item>
                    <Pagination.Item>2</Pagination.Item>
                    <Pagination.Item>3</Pagination.Item>
                    <Pagination.Ellipsis/>
                    <Pagination.Item>10</Pagination.Item>
                    <Pagination.Next/>
                    <Pagination.Last/>
                </Pagination>
                <small className="text-secondary">Displaying 10 of 100</small>
            </div> */}
        </div>
    );
};

export default Employees;