import {useEffect, useState} from 'react';
import {useAppSelector} from "../../../hooks/redux.ts";
import config from "../../../../config.json";
import {Button, Dropdown, DropdownButton, Form, InputGroup} from "react-bootstrap";
import {BsArrowCounterclockwise} from "react-icons/bs";
import User, {Permission} from "../../../models/User.ts";

export interface Settings {
    [name: string]: string[];
}

export interface Presets {
    [preset: string]: Permission[];
}

export interface Config {
    presets: Presets;
}

interface Props {
    user: User,
    isEdited: boolean,
    setEdited(prevState: boolean): void,
    setPermissions(prevState: Record<string, boolean>): void,
    permissions: Record<string, boolean>
}

const data: Config = config as Config;

const PermissionSelect = (props: Props) => {
    const account = useAppSelector<User>(state => state.accountInfo.user);

    const [sourceCheckboxes, setSourceCheckboxes] = useState<Record<string, boolean>>({});
    const [preset, setPreset] = useState<string>('');

    useEffect(() => {
        if (props.user) {
            const target : Record<string, boolean> = {};
            Object.values(Permission).forEach(perm => {
                target[perm] = props.user.permissions.includes(perm);
            });
            props.setPermissions(target);
            setSourceCheckboxes(target);
            props.setEdited(false);
        }
    }, [props.user]);

    useEffect(() => {
        if (preset) {
            const target: Record<string, boolean> = {};
            Object.values(Permission).forEach(perm => {
                target[perm] = data.presets[preset].includes(perm);
            });
            props.setPermissions(target);
        }
    }, [preset]);

    const handlePresetChange = (preset: string) => {
        setPreset(preset);
    };

    const handleCheckboxChange = (perm: string) => {
        props.setPermissions({ ...props.permissions, [perm]: !props.permissions[perm] })
    }

    useEffect(() => {
        props.setEdited(JSON.stringify(props.permissions) !== JSON.stringify(sourceCheckboxes));
    }, [props.permissions]);

    const handleReset = () => {
        props.setPermissions(sourceCheckboxes);
        setPreset("");
        props.setEdited(false);
    }

    return (
        <div>
            <div>
                    {(props.user.username !== account.username && account.permissions.includes(Permission.ManageUserPermissions)) && (
                        <InputGroup className="mb-1">
                            <DropdownButton
                                variant="secondary text-start bg-light text-dark col-2"
                                title="Permissions">
                                    {Object.keys(config.presets).map(preset => (
                                        <Dropdown.Item key={preset} onClick={() => handlePresetChange(preset)}>{preset}</Dropdown.Item>
                                    ))}
                            </DropdownButton>
                            <Form.Control
                                    placeholder={"Select custom preset..."}
                                    type="text"
                                    name="preset"
                                    value={preset}
                                    autoComplete="off"
                                    readOnly/>
                            <Button variant="warning" disabled={!props.isEdited} onClick={handleReset}><BsArrowCounterclockwise/></Button>
                        </InputGroup>
                    )}
            </div>
            <div>
                <table className="table text-start table-bordered">
                    <tbody>
                    {Object.values(Permission).map(perm => (
                        <tr key={perm}>
                            <td>
                                <input className="mx-2"
                                    id={perm}
                                    name={perm}
                                    type="checkbox"
                                    checked= {props.permissions[perm] || false}
                                    disabled={props.user.username == account.username || !account.permissions.includes(Permission.ManageUserRoles) }
                                    onChange={() => handleCheckboxChange(perm)}/>
                                <label htmlFor={perm}>{perm}</label>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default PermissionSelect;