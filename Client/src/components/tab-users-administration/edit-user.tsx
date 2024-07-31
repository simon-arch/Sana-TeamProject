import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Form, InputGroup, Button, FormGroup, FormCheck } from "react-bootstrap";
import { RootState } from "../../store";
import { getRoles } from "../../store/slices/roleSlice";
import { getPermissions } from "../../store/slices/permissionSlice";
import { updateUserRequest } from "../../store/slices/userSlice";
import config from "../../../config.json"; // Assuming this is where your presets are defined

export interface Config {
    presets: {
        [preset: string]: string[];
    };
}

const data: Config = config as Config;

function EditUser() {
    const dispatch = useDispatch();
    const selectedUser = useSelector((state: RootState) => state.users.selectedUser);
    const roles = useSelector((state: RootState) => state.roles);
    const permissions = useSelector((state: RootState) => state.permissions);

    const [username, setUsername] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('');
    const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
    const [preset, setPreset] = useState<string>('');

    useEffect(() => {
        dispatch(getRoles());
        dispatch(getPermissions());
    }, [dispatch]);

    useEffect(() => {
        if (selectedUser) {
            setUsername(selectedUser.username);
            setFirstName(selectedUser.firstname);
            setLastName(selectedUser.lastname);
            setPassword(selectedUser.password);
            setRole(selectedUser.role);
            setSelectedPermissions(selectedUser.permissions);
        }
    }, [selectedUser]);

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
        } else {
            setSelectedPermissions([]);
        }
    };

    const handleUpdateUser = (e: React.FormEvent) => {
        e.preventDefault();
        if (username && firstName && lastName && password && role) {
            if (selectedUser) {
                dispatch(updateUserRequest({
                    ...selectedUser,
                    username,
                    firstname: firstName,
                    lastname: lastName,
                    password,
                    role,
                    permissions: selectedPermissions
                }));
            }
        } else {
            // Handle validation errors
            console.log('Please fill in all required fields');
        }
    };

    if (!selectedUser) {
        return <div>No user selected</div>;
    }

    return (
        <div>
            <h5>Edit User</h5>
            <InputGroup className="mb-3">
                <InputGroup.Text>Username</InputGroup.Text>
                <Form.Control
                    value={username}
                    type="text"
                    onChange={(e) => setUsername(e.target.value)}
                    required
                />
            </InputGroup>
            <InputGroup className="mb-3">
                <InputGroup.Text>First Name</InputGroup.Text>
                <Form.Control
                    value={firstName}
                    type="text"
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                />
            </InputGroup>
            <InputGroup className="mb-3">
                <InputGroup.Text>Last Name</InputGroup.Text>
                <Form.Control
                    value={lastName}
                    type="text"
                    onChange={(e) => setLastName(e.target.value)}
                    required
                />
            </InputGroup>
            <InputGroup className="mb-3">
                <InputGroup.Text>Password</InputGroup.Text>
                <Form.Control
                    value={password}
                    type="password"
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
            <Button type="button" onClick={handleUpdateUser}>Update</Button>
        </div>
    );
}

export default EditUser;
