import React, {useEffect, useState} from 'react';
import {Button, FormControl, FormGroup, FormLabel, FormSelect} from "react-bootstrap";
import {useAppDispatch, useAppSelector} from "../../hooks/redux.ts";
import {setUserRole, User} from "../../store/slices/userSlice.ts";
import {BsArrowCounterclockwise} from "react-icons/bs";
import {Capitalize} from "../../helpers/format.ts";

interface RoleFieldProps {
    user: User,
    isEdited: boolean,
    setEdited(prevState: boolean): void,
    isConfirm: boolean,
    setConfirm(prevState: boolean) : void
}

const RoleField = (props : RoleFieldProps) => {
    const dispatch = useAppDispatch();

    const account = useAppSelector<User>(state => state.accountInfo.user);
    const availableRoles = useAppSelector<string[]>(state => state.roles.roles);

    const [role, setRole] = useState('');
    const [sourceRole, setSourceRole] = useState('');

    useEffect(() => {
        if (props.user) {
            setRole(props.user.role);
            setSourceRole(props.user.role);
        }
    }, [props.user]);

    const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const newRole = event.target.value;
        if (sourceRole !== newRole) {
            props.setEdited(true);
        }
        setRole(newRole);
    }

    const handleReset = () => {
        setRole(sourceRole);
        props.setEdited(false);
    }

    useEffect(() => {
        if (props.isConfirm && props.isEdited) {
            setSourceRole(role);
            props.setEdited(false);
            props.setConfirm(false);
            dispatch(setUserRole({username: props.user.username, role: role}));
        }
    }, [dispatch, props]);

    return (
        <FormGroup className="mb-2">
            <FormLabel>Role</FormLabel>
            {props.user.username === account.username
                ?
                <FormControl name="role" type="text" value={Capitalize(account.role)} readOnly/>
                :
                <div className="d-flex gap-2">
                    <FormSelect value={role} onChange={handleChange}>
                        {availableRoles.map((value, index) => (
                            <option key={index} value={value}>{Capitalize(value)}</option>
                        ))}
                    </FormSelect>
                    <Button variant="warning" disabled={!props.isEdited} onClick={handleReset}><BsArrowCounterclockwise/></Button>
                </div>
            }
        </FormGroup>
    );
};

export default RoleField;