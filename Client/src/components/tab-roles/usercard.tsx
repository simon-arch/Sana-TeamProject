import "../../assets/styles/tab-roles.css";
import { Form, Badge, Button } from 'react-bootstrap';
import { BsArrowCounterclockwise, BsCheck2 } from "react-icons/bs";

interface Props {
    name: string;
    role: string;
    placeholder1?: string;
    placeholder2?: string;
    canEdit?: boolean;
    isEdited?: boolean;
}

function UserCard(props: Props) {
  return (
    <>
        <tr>
            <td scope="row">{props.name}</td>
            <td>{props.placeholder1}</td>
            {props.canEdit ? (
                <>
                    <td>
                        <Form.Select defaultValue={props.role} className="roleMenu-select form-select-sm" style={{margin:"auto"}}>
                            <option value="Admin">Admin</option>
                            <option value="Accountant">Accountant</option>
                            <option value="Developer">Developer</option>
                        </Form.Select>
                    </td>
                    <td>
                        <Button variant="success" className="roleMenu-button-edit" disabled={!props.isEdited}><BsCheck2/></Button>
                        <Button variant="warning" className="roleMenu-button-edit" disabled={!props.isEdited}><BsArrowCounterclockwise/></Button>
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