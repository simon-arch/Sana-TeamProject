import {useEffect, useState} from 'react';
import {User} from "../../../store/slices/userSlice.ts";
import {useAppSelector} from "../../../hooks/redux.ts";
import config from "../../../../config.json";
import {Button, Dropdown, DropdownButton, Form, InputGroup} from "react-bootstrap";
import {BsArrowCounterclockwise} from "react-icons/bs";

export interface Settings {
    [name: string]: string[];
}

export interface Presets {
    [preset: string]: string[];
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
    const account = useAppSelector(state => state.accountInfo.user);
    const permissions = useAppSelector<string[]>(state => state.permissions.permissions);

    const [sourceCheckboxes, setSourceCheckboxes] = useState<Record<string, boolean>>({});
    const [preset, setPreset] = useState<string>('');

    useEffect(() => {
        if (props.user) {
            const target : Record<string, boolean> = {};
            permissions.forEach(perm => {
                target[perm] = props.user.permissions.includes(perm);
            });
            props.setPermissions(target);
            setSourceCheckboxes(target);
            props.setEdited(false);
        }
    }, [permissions, props.user]);

    useEffect(() => {
        if (preset) {
            const target: Record<string, boolean> = {};
            permissions.forEach(perm => {
                target[perm] = data.presets[preset].includes(perm);
            });
            props.setPermissions(target);
        }
    }, [permissions, preset]);

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
                    {(props.user.username !== account.username && account.permissions.includes(config.permissions.MANAGE_USER_PERMISSIONS)) && (
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
                    {permissions.map(perm => (
                        <tr key={perm}>
                            <td>
                                <input className="mx-2"
                                       type="checkbox"
                                       checked= {props.permissions[perm] || false}
                                       disabled={props.user.username == account.username || !account.permissions.includes(config.permissions.MANAGE_USER_ROLES) }
                                       name={perm}
                                       id={perm}
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