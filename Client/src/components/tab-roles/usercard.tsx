import "../../assets/styles/tab-roles.css";
import { Form, Badge, Button } from 'react-bootstrap';
import { BsArrowCounterclockwise, BsCheck2 } from "react-icons/bs";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store";
import { User, setUserRole } from "../../store/slices/userSlice";
import config from "../../../config.json"

interface Props {
    user: User
    avaliableRoles: string[];
}

export function Capitalize(value: string) {
    return value.toLowerCase().replace('_', ' ').replace(/\b\w/g, c => c.toUpperCase())
}

function UserCard(props: Props) {
    const dispatch = useDispatch();
    const username = useSelector((state: RootState) => state.accountInfo.user.username);

    const [isEdited, setEdited] = useState<boolean>(false);
    const [role, setRole] = useState<string>(props.user.role);
    const [sourceRole, setSource] = useState<string>(props.user.role);

    const permissions = useSelector((state: RootState) => state.accountInfo.user.permissions);
    const canManageRoles = permissions.includes(config.permissions["MANAGE_USER_ROLES"]);

    const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const newRole = event.target.value;
        if (sourceRole !== newRole) setEdited(true);
        else setEdited(false);
        setRole(newRole);
    }

    const handleConfirm = () => {
        setSource(role);
        setEdited(false);
        dispatch(setUserRole({id: props.user.username, role: role}));
    }

    const handleReset = () => {
        setRole(sourceRole);
        setEdited(false);
    }

    return (
        <>
            <tr>
                <td scope="row">{props.user.firstname} {canManageRoles && (<br/>)}{props.user.lastname}</td>
                {canManageRoles && (
                    <>
                        <td>
                            <Form.Select name={props.user.firstname} value={role} disabled={props.user.username === username} className="roleMenu-select form-select-sm" style={{ margin: "auto" }} onChange={handleChange}>
                                {props.avaliableRoles.map((value, key) => (
                                    <option key={key} value={value}>
                                        {Capitalize(value)}
                                    </option>
                                ))}
                            </Form.Select>
                        </td>
                        <td>
                            {
                                props.user.username !== username && (
                                <>
                                    <Button variant="success" className="roleMenu-button-edit" disabled={!isEdited} onClick={handleConfirm}><BsCheck2 /></Button>
                                    <Button variant="warning" className="roleMenu-button-edit" disabled={!isEdited} onClick={handleReset}><BsArrowCounterclockwise /></Button>
                                </>)
                            }
                        </td>
                    </>
                )}
                {!canManageRoles && (
                    <>
                        <td>
                            <Badge pill className={"roleMenu-badge roleMenu-color" + props.user.role.replace(" ","-")}>
                                {Capitalize(props.user.role)}
                            </Badge>
                        </td>
                        <td>
                        </td>
                    </>
                )}
            </tr>
        </>
    );
}

export default UserCard;