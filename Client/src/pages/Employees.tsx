import React, {useEffect, useState} from 'react';
import {useAppDispatch, useAppSelector} from "../hooks/redux.ts";
import {deleteUser, getUsers, User} from "../store/slices/userSlice.ts";
import {Button, FormControl, FormGroup, FormLabel, FormSelect, InputGroup, Table} from "react-bootstrap";
import {HiMagnifyingGlass} from "react-icons/hi2";
import UserModal from "../components/UserModal/UserModal.tsx";
import {getRoles} from "../store/slices/roleSlice.ts";
import {getPermissions} from "../store/slices/permissionSlice.ts";
import {Capitalize} from "../helpers/format.ts";
import config from '../../config.json';
import RegisterUserModal from "../components/UserModal/RegisterUserModal.tsx";
import PageBar from "../components/PageBar/PageBar.tsx";
import {debounceTime, distinctUntilChanged, map, Subject} from "rxjs";

const Employees = () => {
    const dispatch = useAppDispatch();
    const usersRaw = useAppSelector<User[]>(state => state.users.users);
    const userNumber = useAppSelector<number>(state => state.users.totalCount);
    const account = useAppSelector<User>(state => state.accountInfo.user);
    
    useEffect(() => {
        setUsers(usersRaw);
    }, [dispatch, usersRaw])

    const [page, setPage] = useState(1);
    const pageSize = 10;

    const [users, setUsers] = useState<User[]>(usersRaw);
    const [show, setShow] = useState(false);
    const [user, setUser] = useState<User>(null!);
    const [showRegisterModal, setShowRegisterModal] = useState(false);
    const [sort, setSort] = useState("name");

    const [query, setQuery] = useState("");
    const [debouncedQuery, setDebouncedQuery] = useState("");
    const [onSearch$] = useState(new Subject());

    const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) =>  {
        setQuery(event.target.value);
        onSearch$.next(event.target.value)
    };

    const openModal = (user: User) => {
        setShow(true);
        setUser(user);
    }

    const handleDeleteUser = (user: User) => {
        dispatch(deleteUser({username: user.username}));
    }

    useEffect(() => {
        const subscription = onSearch$.pipe(
            map((prompt: string) => prompt.trim()),
            debounceTime(400),
            distinctUntilChanged()
        ).subscribe(setDebouncedQuery);

        return () => subscription.unsubscribe();
    }, [onSearch$]);

    useEffect(() => {
        const source = [...users];
        switch (sort) {
            case "name":
                source.sort((a, b) => `${a.firstName} ${b.lastName}`.localeCompare(`${b.firstName} ${b.lastName}`));
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
        dispatch(getUsers({pageNumber: page, pageSize, query: debouncedQuery}));
    }, [dispatch, page, show, debouncedQuery]);


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
                        <FormControl type="text" placeholder="Quick search..." value={query}
                                     onChange={handleSearch}/>
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
                        <Button onClick={() => setShowRegisterModal(true)}>Add +</Button>}
            </div>
            <UserModal show={show} onHide={() => setShow(false)} user={user}/>
            <RegisterUserModal show={showRegisterModal} onHide={() => setShowRegisterModal(false)} />
            {
                users.length <= 0 ? <div>Couldn't find matches for "{debouncedQuery}"</div> : <>
                    <div className="mb-5" style={{minHeight: 642}}>
                        <Table hover className="border shadow rounded">
                            <thead>
                            <tr>
                                <td className="px-3 text-secondary bg-light">Name</td>
                                <td className="px-3 text-secondary bg-light">Role</td>
                                <td className="px-3 text-secondary bg-light">Status</td>
                                <td className="text-secondary bg-light col-1">Action</td>
                            </tr>
                            </thead>
                            <tbody>
                            {users.map((user, index) => (
                                <tr key={index}>
                                    <td className="p-3">{user.firstName} {user.lastName} {account.username === user.username && "(you)"}</td>
                                    <td className="p-3">{Capitalize(user.role)}</td>
                                    <td className="p-3">
                                            <span
                                                className="px-3 py-1 text-success rounded-pill border border-success"
                                            >{Capitalize(user.state)}</span>
                                    </td>
                                    <td className="p-3">
                                        <button onClick={() => openModal(user)} className="btn border py-0 px-2">...
                                        </button>
                                        {(user.username !== account.username && account.permissions.includes(config.permissions.DELETE_USER)) &&
                                            <Button onClick={() => handleDeleteUser(user)} variant="danger"
                                                    className="py-0 px-2 ms-2">X</Button>
                                        }
                                    </td>
                                </tr>))}
                            </tbody>
                        </Table>
                    </div>
                    <div className="d-flex justify-content-between">
                        <PageBar pageSize={pageSize} totalCount={userNumber} page={page} setPage={setPage}/>
                        <small className="text-secondary">Displaying {
                            (page - 1) * pageSize + 1}-{page * pageSize > userNumber ? userNumber : page * pageSize} of {userNumber}
                        </small>
                    </div>
                </>
            }
        </div>
    );
};

export default Employees;