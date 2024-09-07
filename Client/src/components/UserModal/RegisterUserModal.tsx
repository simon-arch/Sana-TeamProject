import React, {useEffect, useState} from 'react';
import {Button, Dropdown, DropdownButton, Form, InputGroup, Modal, OverlayTrigger, Tooltip} from "react-bootstrap";
import {BsArrowCounterclockwise, BsCheck2, BsCheck2All} from "react-icons/bs";
import {dismissError, userCreate, setError} from "../../store/slices/userSlice.ts";
import {useAppDispatch, useAppSelector} from "../../hooks/redux.ts";
import {Permission, Role, UserLite, UserStatus, WorkType} from "../../models/User.ts";
import {Capitalize, Clamp} from "../../helpers/format.ts";
import config from "../../../config.json";
import {Config} from "./ModalComponents/PermissionSelect.tsx";
import {SliceError, SliceStatus} from "../../models/SliceState.ts";

interface ModalProps {
    show: boolean,

    setShow(prevState: boolean): void,

    setLocalStatus(prevState: SliceStatus): void
}

const data: Config = config as Config;

const RegisterUserModal = (props: ModalProps): React.JSX.Element => {
    const dispatch = useAppDispatch();
    const [username, setUsername] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState(Role.Developer);
    const [selectedPermissions, setSelectedPermissions] = useState<Permission[]>([]);
    const [preset, setPreset] = useState<string>('');

    const [workType, setWorkType] = useState(WorkType.PartTime);
    const [workTime, setWorkTime] = useState<number | null>(null);
    const [allowWorkTime, setAllowWorkTime] = useState(false);

    const users = useAppSelector<UserLite[]>(state => state.users.usersWithApprovalPermission);
    const error = useAppSelector<SliceError>(state => state.users.error);

    const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [showDrop, setShowDrop] = useState(false);


    const handleSelect = (user: UserLite) => {
        setSelectedUsers((prevSelectedUsers) =>
            prevSelectedUsers.includes(user.username)
                ? prevSelectedUsers.filter((username) => username !== user.username)
                : [...prevSelectedUsers, user.username]
        );
    };

    const handlePermissionChange = (perm: Permission) => {
        setSelectedPermissions(prev =>
            prev.includes(perm)
                ? prev.filter(p => p !== perm)
                : [...prev, perm]
        );
    };

    const handlePresetChange = (preset: string) => {
        setPreset(preset);
        if (preset) {
            const presetPermissions = data.presets[preset];
            setSelectedPermissions(presetPermissions);
        }
    };

    const handleWorkTypeChange = (workType: WorkType) => {
        if (workType == WorkType.PartTime) setWorkTime(null);
        else setWorkTime(8);
        setWorkType(workType);
        setAllowWorkTime(workType === WorkType.FullTime);
    };

    const workTimeChange = (workTime: number) => {
        if (!allowWorkTime) return;
        setWorkTime(Clamp(workTime, 1, 24));
    }

    const resetState = () => {
        setUsername('');
        setFirstName('');
        setLastName('');
        setPassword('');
        setRole(Role.Developer);
        setSelectedPermissions([]);
        setPreset('');
        setWorkType(WorkType.PartTime);
        setWorkTime(null);
        props.setShow(false);
        setAllowWorkTime(false);
        setSelectedUsers([]);
        dispatch(dismissError());
    }

    const handleRegister = (e: React.FormEvent) => {
        e.preventDefault();
        if (username && firstName && lastName && password && role) {
            dispatch(userCreate({
                firstName: firstName,
                lastName: lastName,
                password: password,
                permissions: selectedPermissions,
                role: role,
                state: UserStatus.Available,
                username: username,
                workTime: workTime,
                workType: workType,
                vacationApprovers: {approvedVacationsByUsers: selectedUsers}
            }));
            resetState();
            props.setLocalStatus('loading');
        } else {
            dispatch(setError('All fields are required.'));
        }
    };

    useEffect(() => {
        if (!props.show)
            resetState();
    }, [props.show])

    return (
        <Modal show={props.show}
               onHide={() => props.setShow(false)}
               centered
               fullscreen='lg-down'
               size="xl">
            <Modal.Header closeButton>
                <Modal.Title>Register New User</Modal.Title>
            </Modal.Header>
            <Modal.Body>

                <InputGroup className="my-1">
                    <InputGroup.Text className="col-2">First name</InputGroup.Text>
                    <Form.Control
                        type="text"
                        name="firstname"
                        value={firstName}
                        onChange={e => setFirstName(e.target.value)}
                        autoComplete="off"
                        required/>
                </InputGroup>

                <InputGroup className="my-1">
                    <InputGroup.Text className="col-2">Last name</InputGroup.Text>
                    <Form.Control
                        type="text"
                        name="lastname"
                        value={lastName}
                        onChange={e => setLastName(e.target.value)}
                        autoComplete="off"
                        required/>
                </InputGroup>

                <InputGroup className="my-1">
                    <InputGroup.Text className="col-2">Username</InputGroup.Text>
                    <Form.Control
                        type="text"
                        name="username"
                        value={username} onChange={e =>
                        setUsername(e.target.value)}
                        autoComplete="off"
                        required/>
                </InputGroup>

                <InputGroup className="my-1">
                    <InputGroup.Text className="col-2">Password</InputGroup.Text>
                    <Form.Control
                        type="password"
                        name="password"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        autoComplete="off"
                        required/>
                </InputGroup>

                <InputGroup className="mb-1">
                    <DropdownButton
                        variant="secondary col-2 text-start bg-light text-dark"
                        title="Work Type">
                        {Object.values(WorkType).map((workType, index) => (<Dropdown.Item key={index}
                                                                                          onClick={() => handleWorkTypeChange(workType)}>{Capitalize(workType)}</Dropdown.Item>))}
                    </DropdownButton>
                    <Form.Control
                        type="text"
                        name="worktype"
                        value={workType}
                        autoComplete="off"
                        readOnly/>
                </InputGroup>

                <InputGroup className="formHours mb-1">
                    <InputGroup.Text className="col-2">Work Hours</InputGroup.Text>
                    <Form.Control
                        disabled={!allowWorkTime}
                        name="worktime"
                        type="number"
                        step="0.5"
                        min="1"
                        max="24"
                        value={workTime || ''}
                        onChange={event => workTimeChange(Number(event.target.value))}
                    />
                </InputGroup>

                <InputGroup className="mb-1">
                    <DropdownButton
                        variant="secondary col-2 text-start bg-light text-dark"
                        title="Role">
                        {Object.values(Role).map((role, index) => (<Dropdown.Item key={index}
                                                                                  onClick={() => setRole(role)}>{Capitalize(role)}</Dropdown.Item>))}
                    </DropdownButton>
                    <Form.Control
                        type="text"
                        name="role"
                        value={role}
                        autoComplete="off"
                        readOnly/>
                </InputGroup>

                <InputGroup className="mb-1">
                    <DropdownButton
                        autoClose="outside"
                        title="Review Vacations By"
                        variant="secondary col-2 text-start bg-light text-dark"
                        onToggle={() => setShowDrop(!showDrop)}
                        show={showDrop}>
                        <div className="px-2">
                            <input
                                name="search"
                                type="text"
                                placeholder="Search..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}/>
                            <Button className="ms-1" variant="outline-dark"
                                    onClick={() => setSelectedUsers(users.map(user => user.username))}><BsCheck2All/></Button>
                            <Button className="ms-1" variant="outline-dark"
                                    onClick={() => setSelectedUsers([])}><BsArrowCounterclockwise/></Button>
                        </div>
                        <div style={{maxHeight: '200px', overflowY: 'auto'}}>
                            {
                                users.length > 0 ?
                                    (users
                                        .filter(user => user.state !== UserStatus.Fired)
                                        .map(user => (
                                        <Dropdown.Item
                                            as="button"
                                            key={user.username}
                                            eventKey={user.username}
                                            onClick={(e) => {
                                                e.preventDefault();
                                                handleSelect(user);
                                            }}>
                                            <input
                                                type="checkbox"
                                                checked={selectedUsers.includes(user.username)}
                                                onChange={() => handleSelect(user)}
                                                className="me-2"/>
                                            {`${user.firstName} ${user.lastName}`}
                                        </Dropdown.Item>
                                    ))) : <Dropdown.Item disabled>No users found</Dropdown.Item>
                            }
                        </div>
                    </DropdownButton>
                    <Form.Control
                        style={{textOverflow: "ellipsis"}}
                        type="text"
                        name="preset"
                        value={(selectedUsers.length > 0 ? selectedUsers.join(', ') : 'none')}
                        autoComplete="off"
                        readOnly/>
                </InputGroup>

                <InputGroup className="mb-1">
                    <DropdownButton
                        variant="secondary col-2 text-start bg-light text-dark"
                        title="Permissions">
                        {Object.keys(data.presets).map((preset, index) => (
                            <Dropdown.Item key={index}
                                           onClick={() => handlePresetChange(preset)}>{preset}</Dropdown.Item>
                        ))}
                    </DropdownButton>
                    <Form.Control
                        type="text"
                        name="preset"
                        value={preset}
                        autoComplete="off"
                        readOnly/>
                </InputGroup>


                <table className="table text-start table-bordered">
                    <tbody>
                    {Object.values(Permission).map((perm, index) => (
                        <tr key={index}>
                            <td>
                                <input className="mx-2"
                                       type="checkbox"
                                       id={perm}
                                       checked={selectedPermissions.includes(perm)}
                                       onChange={() => handlePermissionChange(perm)}/>
                                <label htmlFor={perm}>{perm}</label>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>

                <div className="text-end mt-4">
                    <OverlayTrigger
                        show={!!error}
                        delay={{show: 250, hide: 400}}
                        overlay={
                            <Tooltip>
                                <div>{error}</div>
                            </Tooltip>
                        }
                    >
                        <Button variant="success" onClick={handleRegister}><BsCheck2 className="me-1"/>Register</Button>
                    </OverlayTrigger>
                </div>
            </Modal.Body>
        </Modal>
    );
};

export default RegisterUserModal;
