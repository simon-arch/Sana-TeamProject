import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Form, InputGroup, Button, FormGroup, FormCheck } from "react-bootstrap";
import { BsFillKeyFill, BsFillPersonFill } from "react-icons/bs";
import { RootState } from "../../store";
import { getRoles } from "../../store/slices/roleSlice";
import { getPermissions } from "../../store/slices/permissionSlice";
import { setError } from "../../store/slices/accountSlice";
import { registerRequest } from "../../store/slices/userSlice";
import config from "../../../config.json"; // Assuming this is where your presets are defined

export interface Config {
    presets: {
        [preset: string]: string[];
    };
}

const data: Config = config as Config;

function RegisterUser() {
    const dispatch = useDispatch();
    const [username, setUsername] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('');
    const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
    const [preset, setPreset] = useState<string>('');

    const roles = useSelector((state: RootState) => state.roles);
    const permissions = useSelector((state: RootState) => state.permissions);

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

    const handleAddUser = (e: React.FormEvent) => {
        e.preventDefault();
        if (username && firstName && lastName && password && role) {
            dispatch(registerRequest({
                id: 0,
                username,
                firstname: firstName,
                lastname: lastName,
                password,
                role,
                permissions: selectedPermissions
            }));
            setUsername('');
            setFirstName('');
            setLastName('');
            setPassword('');
            setRole('');
            setSelectedPermissions([]);
            setPreset('');
        } else {
            dispatch(setError('All fields are required.'));
        }
    };

    return (
        <div>
            <InputGroup className="mb-3">
                <InputGroup.Text><BsFillPersonFill /></InputGroup.Text>
                <Form.Control
                    value={username}
                    type="text"
                    placeholder="Username"
                    onChange={(e) => setUsername(e.target.value)}
                    required
                />
            </InputGroup>
            <InputGroup className="mb-3">
                <InputGroup.Text><BsFillPersonFill /></InputGroup.Text>
                <Form.Control
                    value={firstName}
                    type="text"
                    placeholder="First Name"
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                />
            </InputGroup>
            <InputGroup className="mb-3">
                <InputGroup.Text><BsFillPersonFill /></InputGroup.Text>
                <Form.Control
                    value={lastName}
                    type="text"
                    placeholder="Last Name"
                    onChange={(e) => setLastName(e.target.value)}
                    required
                />
            </InputGroup>
            <InputGroup className="mb-3">
                <InputGroup.Text><BsFillKeyFill /></InputGroup.Text>
                <Form.Control
                    value={password}
                    type="password"
                    placeholder="Password"
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
            </InputGroup>
            <FormGroup className="mb-3">
                <Form.Label>Role</Form.Label>
                <Form.Control as="select" value={role} onChange={(e) => setRole(e.target.value)} required>
                    <option value="">Select a role...</option>
                    {roles.map(r => (
                        <option key={r} value={r}>{r}</option>
                    ))}
                </Form.Control>
            </FormGroup>
            <FormGroup className="mb-3">
                <Form.Label>Permissions</Form.Label>
                <div className="container-preset">
                    <Form.Select className="roleManager-select form-select-sm" value={preset} onChange={handlePresetChange}>
                        <option value="" disabled>Optional preset...</option>
                        {Object.keys(data.presets).map(preset => (
                            <option key={preset} value={preset}>{preset}</option>
                        ))}
                    </Form.Select>
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
            <Button type="button" onClick={handleAddUser}>Register</Button>
        </div>
    );
}

export default RegisterUser;
