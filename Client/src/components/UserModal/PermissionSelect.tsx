import React, {useEffect, useState} from 'react';
import {setUserPermissions, User} from "../../store/slices/userSlice.ts";
import {useAppDispatch, useAppSelector} from "../../hooks/redux.ts";
import config from "../../../config.json";
import {Button, Form, FormGroup, FormLabel} from "react-bootstrap";
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
    isConfirm: boolean,
    setConfirm(prevState: boolean) : void
}

const convertPayload = (rec: Record<string, boolean>): string[] => {
    return Object.entries(rec)
        .filter(([_, val]) => val)
        .map(([key]) => key);
};

const data: Config = config as Config;

const PermissionSelect = (props: Props) => {
    const dispatch = useAppDispatch();

    const account = useAppSelector(state => state.accountInfo.user);
    const permissions = useAppSelector<string[]>(state => state.permissions.permissions);

    const [targetCheckboxes, setTargetCheckboxes] = useState<Record<string, boolean>>({});
    const [sourceCheckboxes, setSourceCheckboxes] = useState<Record<string, boolean>>({});
    const [preset, setPreset] = useState<string>('');

    useEffect(() => {
        if (props.user) {
            const target : Record<string, boolean> = {};
            permissions.forEach(perm => {
                target[perm] = props.user.permissions.includes(perm);
            });
            setTargetCheckboxes(target);
            setSourceCheckboxes(target);
        }
    }, [permissions, props.user]);

    useEffect(() => {
        if (preset) {
            const target: Record<string, boolean> = {};
            permissions.forEach(perm => {
                target[perm] = data.presets[preset].includes(perm);
            });
            setTargetCheckboxes(target);
        }
    }, [permissions, preset]);

    const handlePresetChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setPreset(event.target.value);
    };

    const handleCheckboxChange = (perm: string) => {
        setTargetCheckboxes({ ...targetCheckboxes, [perm]: !targetCheckboxes[perm] })
    }

    useEffect(() => {
        props.setEdited(JSON.stringify(targetCheckboxes) !== JSON.stringify(sourceCheckboxes));
    }, [targetCheckboxes]);

    const handleReset = () => {
        setTargetCheckboxes(sourceCheckboxes);
        setPreset("");
        props.setEdited(false);
    }

    useEffect(() => {
        if (props.isConfirm && props.isEdited) {
            setSourceCheckboxes(targetCheckboxes);
            props.setEdited(false);
            props.setConfirm(false);
            dispatch(setUserPermissions({username: props.user.username, permissions: convertPayload(targetCheckboxes)}));
        }
    }, [dispatch, props]);

    return (
        <FormGroup className="mb-2">
            <FormLabel className="d-flex justify-content-between">
                <span>Permissions</span>
                <div className="w-50 d-flex gap-2">
                    {props.user.username !== account.username && (
                        <>
                            <Form.Select className="roleManager-select form-select-sm" value={preset} onChange={handlePresetChange}>
                                <option value="" disabled>Optional preset...</option>
                                {Object.keys(config.presets).map(preset => (
                                    <option key={preset} value={preset}>{preset}</option>
                                ))}
                            </Form.Select>
                            <Button variant="warning" disabled={!props.isEdited} onClick={handleReset}><BsArrowCounterclockwise/></Button>
                        </>
                    )}
                </div>
            </FormLabel>
            <div>
                <table className="table text-start table-bordered">
                    <tbody>
                    {permissions.map(perm => (
                        <tr key={perm}>
                            <td>
                                <input className="mx-2"
                                       type="checkbox"
                                       checked= {targetCheckboxes[perm] || false}
                                       disabled={props.user.username == account.username}
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
        </FormGroup>
    );
};

export default PermissionSelect;