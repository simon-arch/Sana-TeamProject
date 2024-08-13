import {useEffect, useState} from 'react';
import {Button, Dropdown, DropdownButton, Form, InputGroup} from "react-bootstrap";
import {useAppSelector} from "../../../hooks/redux.ts";
import {User} from "../../../store/slices/userSlice.ts";
import {BsArrowCounterclockwise} from "react-icons/bs";
import {Capitalize} from "../../../helpers/format.ts";
import config from '../../../../config.json';

interface RoleFieldProps {
    user: User,
    isEdited: boolean,
    setEdited(prevState: boolean): void,
    setRole(prevState: string) : void,
    role: string
}

const RoleField = (props : RoleFieldProps) => {
    const account = useAppSelector<User>(state => state.accountInfo.user);
    const availableRoles = useAppSelector<string[]>(state => state.roles.roles);

    const [sourceRole, setSourceRole] = useState('');

    useEffect(() => {
        if (props.user) {
            props.setRole(props.user.role);
            setSourceRole(props.user.role);
            props.setEdited(false);
        }
    }, [props.user]);

    const handleChange = (role: string) => {
        const newRole = role;
        if (sourceRole !== newRole) {
            props.setEdited(true);
        }
        props.setRole(newRole);
    }

    const handleReset = () => {
        props.setRole(sourceRole);
        props.setEdited(false);
    }

    return (
        <InputGroup className="mb-1">
            {props.user.username === account.username || !account.permissions.includes(config.permissions.MANAGE_USER_ROLES) 
                ?
                <Form.Control name="role" type="text" value={props.user.role} readOnly/>
                :
                <>
                    <DropdownButton
                        variant="secondary col-2 text-start bg-light text-dark"
                        title="Role">
                        {availableRoles.map((role, index) => (
                            <Dropdown.Item key={index} onClick={() => handleChange(role)}>{Capitalize(role)}</Dropdown.Item>
                        ))}
                    </DropdownButton>
                    <Form.Control name="role" type="text" value={props.role} readOnly/>
                    <Button variant="warning" disabled={!props.isEdited} onClick={handleReset}>
                        <BsArrowCounterclockwise/>
                    </Button>
                </>
            }
        </InputGroup>
    );
};

export default RoleField;