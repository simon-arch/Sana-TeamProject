import {useEffect, useMemo, useState} from 'react';
import {useAppDispatch, useAppSelector} from "../hooks/redux.ts";
import {usersRequest, getUsersWithApproveVacationsPermission} from "../store/slices/userSlice.ts";
import {Badge, Button, FormControl, FormGroup, FormLabel, FormSelect, InputGroup, Spinner, Table} from "react-bootstrap";
import {HiMagnifyingGlass} from "react-icons/hi2";
import UserModal from "../components/UserModal/UserModal.tsx";
import {Capitalize} from "../helpers/format.ts";
import RegisterUserModal from "../components/UserModal/RegisterUserModal.tsx";
import PageBar from "../components/PageBar/PageBar.tsx";
import {debounceTime, distinctUntilChanged, map, Subject} from "rxjs";
import styles from "./styles/employees.module.css";
import User, {Permission, Sort} from "../models/User.ts";
import {SliceStatus} from "../models/SliceState.ts";


const Employees = () => {
    const dispatch = useAppDispatch();
    const users = useAppSelector<User[]>(state => state.users.users);
    const userNumber = useAppSelector<number>(state => state.users.totalCount);
    const account = useAppSelector<User>(state => state.accountInfo.user);
    
    const status = useAppSelector<SliceStatus>(state => state.users.status);
    const [localStatus, setLocalStatus] = useState<SliceStatus>('loading');

    const [page, setPage] = useState(1);
    const pageSize = 10;

    const [show, setShow] = useState(false);
    const [user, setUser] = useState<User>(null!);
    const [showRegisterModal, setShowRegisterModal] = useState(false);
    const [sort, setSort] = useState(Sort.FullName);
    const [showFired, setShowFired] = useState(false);

    const [query, setQuery] = useState("");
    const [debouncedQuery, setDebouncedQuery] = useState("");
    const [onSearch$] = useState(new Subject());

    const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) =>  {
        setQuery(event.target.value);
        onSearch$.next(event.target.value);
    };

    const openModal = (user: User) => {
        setShow(true);
        setUser(user);
    }

    useMemo(() => {
        setPage(1);
    }, [debouncedQuery]);

    useEffect(() => {
        const totalPages = Math.max(1, Math.ceil(userNumber / pageSize));
        if (page > totalPages) setPage(totalPages);
    }, [userNumber]);

    useEffect(() => {
        const subscription = onSearch$.pipe(
            map(prompt => (prompt as string).trim()),
            debounceTime(400),
            distinctUntilChanged()
        ).subscribe(setDebouncedQuery);

        return () => subscription.unsubscribe();
    }, [onSearch$]);

    useEffect(() => {
        if (status == 'idle')
            setLocalStatus('idle')
    }, [status]);

    useEffect(() => {
        if (localStatus == 'idle') {
            dispatch(usersRequest({
                pageNumber: page,
                pageSize: pageSize,
                query: debouncedQuery,
                sort: sort,
                includeFired: showFired
            }));
        }
        else setLocalStatus('loading')
    }, [dispatch, page, debouncedQuery, localStatus, sort, showFired]);

    useEffect(() => {
        dispatch(getUsersWithApproveVacationsPermission());
    }, [dispatch]);

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
                        <FormControl name="search" type="text" placeholder="Quick search..." value={query}
                                     onChange={handleSearch}/>
                    </InputGroup>
                    <FormGroup className="w-25 d-flex align-items-center">
                        <FormLabel htmlFor="sort" className="text-secondary my-0 me-2" column='sm' sm='auto'>Sort by</FormLabel>
                        <FormSelect id="sort" className="w-75" value={sort} onChange={e => setSort(e.target.value as Sort)}>
                            {Object.values(Sort).map((sort, index) =>
                                <option key={index} value={sort}>{Capitalize(sort)}</option>
                            )}
                        </FormSelect>
                    </FormGroup>
                    <FormLabel className="text-secondary my-0 align-content-end" column='sm' sm='auto'>
                        <input type="checkbox"
                               name="showFired"
                               checked={showFired}
                               onChange={e => setShowFired(e.target.checked)}
                               className="me-1"
                        />
                        Show fired
                    </FormLabel>
                </div>
                {account.permissions &&
                    (account.permissions.includes(Permission.RegisterUser)) &&
                        <Button onClick={() => setShowRegisterModal(true)}>Add +</Button>}
            </div>
            <UserModal show={show} user={user} setShow = {setShow} setLocalStatus={setLocalStatus}/>
            <RegisterUserModal show={showRegisterModal} setShow = {setShowRegisterModal} setLocalStatus={setLocalStatus} />
            {
                users.length <= 0 ? <div>Couldn't find matches for "{debouncedQuery}"</div> : <>
                    <div style={{minHeight: 642}}>
                        {
                            localStatus == 'idle' ?
                                <Table hover className="border shadow rounded">
                                    <thead>
                                    <tr className={styles["table-header"]}>
                                        <td className="col-md-4">{Capitalize(Sort.FullName)}</td>
                                        <td className="col-md-3">{Capitalize(Sort.Role)}</td>
                                        <td className="col-md-2">{Capitalize(Sort.State)}</td>
                                        <td className="col-1">Action</td>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {users.map((user, index) => (
                                        <tr key={index}>
                                            <td className="p-3">
                                                {user.firstName} {user.lastName} {user.username == account.username && <Badge>You</Badge>}
                                            </td>
                                            <td className="p-3">
                                                {Capitalize(user.role)}
                                            </td>
                                            <td className="p-3">
                                                <span className={`${styles["badge"]} ${styles[`badge-${user.state?.toLowerCase()}`]}`}>{Capitalize(user.state)}</span>
                                            </td>
                                            <td className="p-3 pb-2">
                                                <button onClick={() => openModal(user)} className="btn border py-0 px-2">...</button>
                                            </td>
                                        </tr>))}
                                    </tbody>
                                </Table> :
                                <div className="text-center">
                                    <Spinner variant="primary" animation="grow"></Spinner>
                                </div>
                        }
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