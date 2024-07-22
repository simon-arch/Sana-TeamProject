import "../../assets/styles/tab-roles.css";
import { Form, Badge, Button } from 'react-bootstrap';
import { BsArrowCounterclockwise, BsCheck2 } from "react-icons/bs";
import { useState } from "react";

interface Props {
    name: string;
    role: string;
    placeholder1?: string;
    placeholder2?: string;
    canEdit?: boolean;
    avaliableRoles: string[];
}

function UserCard(props: Props) {
    const [isEdited, setEdited] = useState<boolean>(false);
	
    const [role, setRole] = useState<string>(props.role);
    const oldRole = props.role;

    const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const newRole = event.target.value;
        if (oldRole != newRole) setEdited(true);
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
            <td scope="row">{props.name}</td>
            <td>{props.placeholder1}</td>
            {props.canEdit ? (
                <>
                    <td>
                        <Form.Select value={role} className="roleMenu-select form-select-sm" style={{margin:"auto"}} onChange={handleChange}>
                        {props.avaliableRoles.map((value, key) => (
                            <option key={key} value={value}>
                                {value}
                            </option>
                        ))}
                        </Form.Select>
                    </td>
                    <td>
                        <Button variant="success" className="roleMenu-button-edit" disabled={!isEdited} onClick={handleConfirm}><BsCheck2/></Button>
                        <Button variant="warning" className="roleMenu-button-edit" disabled={!isEdited} onClick={handleReset}><BsArrowCounterclockwise/></Button>
                    </td>
                </>
                    ) : (
                <>
                    <td>
                        <Badge pill className={"roleMenu-badge roleMenu-color" + props.role}>
                            {props.role}
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