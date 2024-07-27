import "../../assets/styles/tab-roles.css";
import { Form, Badge, Button } from 'react-bootstrap';
import { BsArrowCounterclockwise, BsCheck2 } from "react-icons/bs";
import { useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import { User } from "../../store/slices/userSlice";

interface Props {
    user: User
    avaliableRoles: string[];
}

function UserCard(props: Props) {
    const [isEdited, setEdited] = useState<boolean>(false);
    const [role, setRole] = useState<string>(props.user.role);
    const oldRole = props.user.role;

    const permissions = useSelector((state: RootState) => state.accountInfo.user.permissions);
    const canManageRoles = permissions.includes('ManageUserRoles');

    const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const newRole = event.target.value;
        if (oldRole !== newRole) setEdited(true);
        else setEdited(false);
        setRole(newRole);
    }

    const handleConfirm = () => {
        console.log("API Request to change user role."); // change it when API will be ready.
    }

    const handleReset = () => {
        setRole(oldRole);
        setEdited(false);
    }

    return (
        <>
            <tr>
                <td scope="row">{props.user.firstname} {canManageRoles && (<br/>)}{props.user.lastname}</td>
                {canManageRoles && (
                    <>
                        <td>
                            <Form.Select name={props.user.firstname} value={role} className="roleMenu-select form-select-sm" style={{ margin: "auto" }} onChange={handleChange}>
                                {props.avaliableRoles.map((value, key) => (
                                    <option key={key} value={value}>
                                        {value}
                                    </option>
                                ))}
                            </Form.Select>
                        </td>
                        <td>
                            <Button variant="success" className="roleMenu-button-edit" disabled={!isEdited} onClick={handleConfirm}><BsCheck2 /></Button>
                            <Button variant="warning" className="roleMenu-button-edit" disabled={!isEdited} onClick={handleReset}><BsArrowCounterclockwise /></Button>
                        </td>
                    </>
                )}
                {!canManageRoles && (
                    <>
                        <td>
                            <Badge pill className={"roleMenu-badge roleMenu-color" + props.user.role.replace(" ","-")}>
                                {props.user.role}
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