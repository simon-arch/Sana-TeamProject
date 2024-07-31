import "../../assets/styles/tab-rolemanager.css";
import { Button, Form } from "react-bootstrap";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store";
import { User, getUsers } from "../../store/slices/userSlice";
import { getPermissions } from "../../store/slices/permissionSlice";
import { BsArrowCounterclockwise, BsCheck2 } from "react-icons/bs";
import config from "../../../config.json"

export interface Settings {
    [name: string]: string[];
}

export interface Presets {
    [preset: string]: string[];
}

export interface Config {
    presets: Presets;
}

const data: Config = config as Config;

function RoleManager() {
    const dispatch = useDispatch();
    const users = useSelector((state: RootState) => state.users.users);
    const permissions = useSelector((state: RootState) => state.permissions);
    const [selectedUser, setSelectedUser] = useState<User>();
    const [targetCheckboxes, setTargetCheckboxes] = useState<Record<string, boolean>>({});
    const [sourceCheckboxes, setSourceCheckboxes] = useState<Record<string, boolean>>({});
    const [preset, setPreset] = useState<string>('');

    useEffect(() => {
        dispatch(getPermissions());
        dispatch(getUsers());
    }, [dispatch]);

    useEffect(() => {
        if (users.length > 0) {
            const initialUser = users[0];
            setSelectedUser(initialUser);
            const target: Record<string, boolean> = {};
            initialUser.permissions.forEach(perm => {
                target[perm] = initialUser.permissions.includes(perm);
            });
            setTargetCheckboxes(target);
            setSourceCheckboxes(target);
        }
    }, [users]);

    useEffect(() => {
        if (preset) {
            const target: Record<string, boolean> = {};
            permissions.forEach(perm => {
                target[perm] = data.presets[preset].includes(perm);
            });
            setTargetCheckboxes(target);
        }
    }, [preset]);

    const handleSetUser = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const id = Number(event.target.value);
        const user = users.find(user => user.id === id);
        setSelectedUser(user);

        const target: Record<string, boolean> = {};
        user?.permissions.forEach(perm => {
            target[perm] = user.permissions.includes(perm);
        });

        setTargetCheckboxes(target);
        setSourceCheckboxes(target);
        setPreset("");
    };

    const handleCheckboxChange = (perm: string) => {
        setTargetCheckboxes(source => ({ ...source, [perm]: !source[perm] }));
    };

    const handleConfirm = () => {
        console.log('API Payload:', targetCheckboxes); // Implement future API here
        setSourceCheckboxes(targetCheckboxes);
    };

    const handleReset = () => {
        setTargetCheckboxes(sourceCheckboxes);
        setPreset("");
    };

    const handlePresetChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setPreset(event.target.value);
    };

    const isChanged = () => {
        return JSON.stringify(targetCheckboxes) !== JSON.stringify(sourceCheckboxes);
    };

    return (
        <>
            <hr/>
            <div className="roleManager-container row my-1">
                <div className="container-form">
                    <Form.Select className="roleManager-select form-select-sm"
                        value={selectedUser?.id}
                        onChange={handleSetUser}>
                        {users.map(user => (
                            <option key={user.id} value={user.id}>
                                {user.firstname} {user.lastname}
                            </option>
                        ))}
                    </Form.Select>
                </div>
                <div className="container-preset">
                    <Form.Select className="roleManager-select form-select-sm" value={preset} onChange={handlePresetChange}>
                        <option value="" disabled>Optional preset...</option>
                        {Object.keys(config.presets).map(preset => (
                            <option key={preset} value={preset}>{preset}</option>
                        ))}
                    </Form.Select>
                </div>
                <div className="container-buttons text-center">
                    <Button className="roleManager-button"
                        variant="success"
                        disabled={!isChanged()}
                        onClick={handleConfirm}>
                        <BsCheck2 />
                    </Button>
                    <Button className="roleManager-button"
                        variant="warning"
                        disabled={!isChanged()}
                        onClick={handleReset}>
                        <BsArrowCounterclockwise />
                    </Button>
                </div>
            </div>
            <hr />
            <div className="roleManager-container-table">
                <table className="table text-start table-bordered">
                    <tbody>
                        {permissions.map(perm => (
                            <tr key={perm} className={targetCheckboxes[perm] ? "table-success" : "table-danger"}>
                                <td>
                                    <input type="checkbox"
                                        checked={targetCheckboxes[perm] || false}
                                        name={perm}
                                        id={perm}
                                        onChange={() => handleCheckboxChange(perm)} />
                                    <label htmlFor={perm}>{perm}</label>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </>
    );
}

export default RoleManager;