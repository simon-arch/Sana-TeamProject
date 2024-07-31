import "../../assets/styles/tab-rolemanager.css";
import { Alert, Button, Form, Spinner } from "react-bootstrap";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store";
import { User, getUsers, setUserPermissions } from "../../store/slices/userSlice";
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

const convertPayload = (rec: Record<string, boolean>): string[] => {
    return Object.entries(rec)
      .filter(([_, val]) => val)
      .map(([key]) => key);
  };

const data: Config = config as Config;

function RoleManager() {
    const dispatch = useDispatch();
    const userId = useSelector((state: RootState) => state.accountInfo.user.id);

    const usersState = useSelector((state: RootState) => state.users);
    const uStatus = usersState.status;
    const users = usersState.users;

    const permissionsState = useSelector((state: RootState) => state.permissions);
    const pStatus = permissionsState.status;
    const permissions = permissionsState.permissions;

    const [selectedUser, setSelectedUser] = useState<User>();
    const [targetCheckboxes, setTargetCheckboxes] = useState<Record<string, boolean>>({});
    const [sourceCheckboxes, setSourceCheckboxes] = useState<Record<string, boolean>>({});
    const [preset, setPreset] = useState<string>('');

    useEffect(() => {
        dispatch(getPermissions());
        dispatch(getUsers());
    }, [dispatch]);

    useEffect(() => {
        if (users.length > 0 && !selectedUser) {
            const initialUser = users[0];
            setSelectedUser(initialUser);
            const target: Record<string, boolean> = {};
            permissions.forEach(perm => {
                target[perm] = initialUser.permissions.includes(perm);
            });
            setTargetCheckboxes(target);
            setSourceCheckboxes(target);
        }
    }, [users, selectedUser, permissions]);

    useEffect(() => {
        if (preset) {
            const target: Record<string, boolean> = {};
            permissions.forEach(perm => {
                target[perm] = data.presets[preset].includes(perm);
            });
            setTargetCheckboxes(target);
        }
    }, [preset]);

    if (uStatus == 'loading' || pStatus == 'loading')
        return <Spinner className="roleManager-spinner" animation="border" role="status"></Spinner>;

    if (uStatus == 'error' || pStatus == 'error')
        return (<Alert variant='danger' className="text-center mx-2">Error fetching data.</Alert>)

    const handleSetUser = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const id = Number(event.target.value);
        dispatch(getUsers());
        const user = users.find(user => user.id === id);
    
        if (user) {
            setSelectedUser(user);
            const target: Record<string, boolean> = {};
            permissions.forEach(perm => {
                target[perm] = user.permissions.includes(perm);
            });
            setTargetCheckboxes(target);
            setSourceCheckboxes(target);
            setPreset("");
        }
    };

    const handleCheckboxChange = (perm: string) => {
        setTargetCheckboxes(source => ({ ...source, [perm]: !source[perm] }));
    };

    const handleConfirm = () => {
        dispatch(setUserPermissions({id: selectedUser!.id, permissions: convertPayload(targetCheckboxes)}));
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
                {
                        selectedUser?.id == userId ? 
                        (
                            <>
                                <div className="container-preset">
                                    <Form.Select className="roleManager-select form-select-sm" value={preset} onChange={handlePresetChange} disabled>
                                        <option value="" disabled>Optional preset...</option>
                                    </Form.Select>
                                </div>
                                <div className="container-buttons text-center">
                                    <Button className="roleManager-button"
                                        variant="success"
                                        disabled>
                                        <BsCheck2 />
                                    </Button>
                                    <Button className="roleManager-button"
                                        variant="warning"
                                        disabled>
                                        <BsArrowCounterclockwise />
                                    </Button>
                                </div>
                            </>
                        ) : (
                            <>
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
                            </>
                        )
                }

            </div>
            <hr />
            <div className="roleManager-container-table">
                <table className="table text-start table-bordered">
                    <tbody>
                        {permissions.map(perm => (
                            <tr key={perm} className={targetCheckboxes[perm] ? "table-success" : "table-danger"}>
                                <td>
                                    <input className="mx-2" 
                                        type="checkbox"
                                        checked={targetCheckboxes[perm] || false}
                                        disabled={selectedUser?.id == userId}
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