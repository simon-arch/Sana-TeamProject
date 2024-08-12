import React, {useEffect, useState} from 'react';
import {Button, FormCheck, FormControl, FormGroup, FormLabel, FormSelect, Modal} from "react-bootstrap";
import {BsCheck2} from "react-icons/bs";
import {registerRequest, setError} from "../../store/slices/userSlice.ts";
import {useAppDispatch} from "../../hooks/redux.ts";

import {getPermissions} from "../../store/slices/permissionSlice.ts";
import {getRoles} from "../../store/slices/roleSlice.ts";
import {RootState} from "../../store";
import {useSelector} from "react-redux";
import config from "../../../config.json";
import {Config} from "./PermissionSelect.tsx";


interface ModalProps {
    show: boolean,

    onHide(): void,
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

    const roles: string[] = useSelector((state: RootState) => state.roles.roles);
    const permissions: string[] = useSelector((state: RootState) => state.permissions.permissions);

    useEffect(() => {
        dispatch(getRoles());
        dispatch(getPermissions());
    }, [dispatch]);

    const handlePermissionChange = (perm: string) => {
        setSelectedPermissions(prev =>
            prev.includes(perm)
                ? prev.filter(p => p !== perm)
                : [...prev, perm]
        );
    };

    const handlePresetChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedPreset = event.target.value;
        setPreset(selectedPreset);
        if (selectedPreset) {
            const presetPermissions = data.presets[selectedPreset];
            setSelectedPermissions(presetPermissions);
        }
    };

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
                state: 'AVALIABLE'
            }));
            setUsername('');
            setFirstName('');
            setLastName('');
            setPassword('');
            setRole('');
            setSelectedPermissions([]);
            setPreset('');
            props.onHide();
        } else {
            dispatch(setError('All fields are required.'));
        }
    };

    return (
        <Modal show={props.show}
               onHide={props.onHide}
               centered
               size="xl">
            <Modal.Header closeButton>
                <Modal.Title>Register New User</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <FormGroup className="mb-2">
                    <FormLabel>First name</FormLabel>
                    <FormControl
                        type="text"
                        name="firstname"
                        value={firstName}
                        onChange={e => setFirstName(e.target.value)}
                        required
                    />
                </FormGroup>
                <FormGroup className="mb-2">
                    <FormLabel>Last name</FormLabel>
                    <FormControl
                        type="text"
                        name="lastname"
                        value={lastName}
                        onChange={e => setLastName(e.target.value)}
                        required
                    />
                </FormGroup>
                <FormGroup className="mb-2">
                    <FormLabel>Username</FormLabel>
                    <FormControl
                        type="text"
                        name="username"
                        value={username} onChange={e =>
                        setUsername(e.target.value)}
                        required
                    />
                </FormGroup>
                <FormGroup className="mb-2">
                    <FormLabel>Password</FormLabel>
                    <FormControl
                        type="password"
                        name="password"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        required
                    />
                </FormGroup>
                <FormGroup className="mb-2">
                    <FormLabel>Role</FormLabel>
                    <FormControl
                        as="select"
                        value={role}
                        onChange={e => setRole(e.target.value)}
                        required
                    >
                        <option value="">Select a role...</option>
                        {roles.map(role => (
                            <option key={role} value={role}>{role}</option>
                        ))}
                    </FormControl>
                </FormGroup>
                <FormGroup className="mb-3">
                    <FormLabel>Permissions</FormLabel>
                    <div className="container-preset">
                        <FormSelect className="roleManager-select form-select-sm" value={preset}
                                    onChange={handlePresetChange}>
                            <option value="" disabled>Optional preset...</option>
                            {Object.keys(data.presets).map(preset => (
                                <option key={preset} value={preset}>{preset}</option>
                            ))}
                        </FormSelect>
                    </div>
                    {permissions.map(perm => (
                        <FormCheck
                            key={perm}
                            type="checkbox"
                            label={perm}
                            checked={selectedPermissions.includes(perm)}
                            onChange={() => handlePermissionChange(perm)}
                        />
                    ))}
                </FormGroup>
                <div className="text-end mt-4">
                    <Button variant="success"
                            onClick={handleRegister}><BsCheck2 className="me-1"/>Register</Button>
                </div>
            </Modal.Body>
        </Modal>
    );
};

export default RegisterUserModal;
