import React, {useEffect, useState} from 'react';
import {Button, Dropdown, DropdownButton, Form, InputGroup, Modal} from "react-bootstrap";
import {BsCheck2} from "react-icons/bs";
import {registerRequest, setError} from "../../store/slices/userSlice.ts";
import {useAppDispatch} from "../../hooks/redux.ts";

import {getPermissions} from "../../store/slices/permissionSlice.ts";
import {getRoles} from "../../store/slices/roleSlice.ts";
import {RootState} from "../../store";
import {useSelector} from "react-redux";
import config from "../../../config.json";
import {Config} from "./ModalComponents/PermissionSelect.tsx";
import {getWorkTypes} from "../../store/slices/workTypeSlice.ts";
import {Status} from '../../helpers/types.ts';
import { Capitalize, Clamp } from '../../helpers/format.ts';

interface ModalProps {
    show: boolean,
    setShow(prevState: boolean): void,
    setLocalStatus(prevState: Status): void
}

const data: Config = config as Config;

const RegisterUserModal = (props: ModalProps): React.JSX.Element => {
    const dispatch = useAppDispatch();
    const [username, setUsername] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('');
    const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
    const [preset, setPreset] = useState<string>('');

    const [workType, setWorkType] = useState('');
    const [workTime, setWorkTime] = useState<number | null>(null);
    const [allowWorkTime, setAllowWorkTime] = useState(false);

    const roles: string[] = useSelector((state: RootState) => state.roles.roles);
    const permissions: string[] = useSelector((state: RootState) => state.permissions.permissions);
    const workTypes: string[] = useSelector((state: RootState) => state.workTypes.workTypes);

    useEffect(() => {
        dispatch(getRoles());
        dispatch(getPermissions());
        dispatch(getWorkTypes());
    }, [dispatch]);

    const handlePermissionChange = (perm: string) => {
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

    const handleWorkTypeChange = (workType: string) => {
        if (workType == config.workType.PART_TIME) setWorkTime(null);
        else setWorkTime(8);
        setWorkType(workType);
        setAllowWorkTime(workType === config.workType.FULL_TIME);
    };

    const workTimeChange = (workTime: number) => {
        if (!allowWorkTime) return;
        setWorkTime(Clamp(workTime, 1, 24));
    }

    const handleRegister = (e: React.FormEvent) => {
        e.preventDefault();
        if (username && firstName && lastName && password && role) {
            dispatch(registerRequest({
                username: username,
                firstName: firstName,
                lastName: lastName,
                password: password,
                role: role,
                permissions: selectedPermissions,
                state: config.userStatuses.AVAILABLE,
                workType: workType,
                workTime: workTime
            }));
            setUsername('');
            setFirstName('');
            setLastName('');
            setPassword('');
            setRole('');
            setSelectedPermissions([]);
            setPreset('');
            setWorkType('');
            setWorkTime(null);
            props.setShow(false);
            setAllowWorkTime(false);
            props.setLocalStatus('loading');
        } else {
            dispatch(setError('All fields are required.'));
        }
    };

    return (
        <Modal show={props.show}
                onHide={() => props.setShow(false)}
               centered
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
                        {workTypes.map((workType, index) => (<Dropdown.Item key={index} onClick={() => handleWorkTypeChange(workType)}>{Capitalize(workType)}</Dropdown.Item>))}
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
                        {roles.map((role, index) => (<Dropdown.Item key={index} onClick={() => setRole(role)}>{Capitalize(role)}</Dropdown.Item>))}
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
                        variant="secondary col-2 text-start bg-light text-dark"
                        title="Permissions">
                            {Object.keys(data.presets).map((preset, index) => (
                                <Dropdown.Item key={index} onClick={() => handlePresetChange(preset)}>{preset}</Dropdown.Item>
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
                    {permissions.map((perm, index) => (
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
                    <Button variant="success"
                            onClick={handleRegister}><BsCheck2 className="me-1"/>Register</Button>
                </div>
            </Modal.Body>
        </Modal>
    );
};

export default RegisterUserModal;
