import React, {useState} from 'react';
import {User, deleteUser, updateRequest} from "../../store/slices/userSlice.ts";
import {Button, Form, InputGroup, Modal} from "react-bootstrap";
import {useAppDispatch, useAppSelector} from "../../hooks/redux.ts";
import {BsCheck2, BsXLg} from "react-icons/bs";
import RoleField from "./ModalComponents/RoleField.tsx";
import PermissionSelect from "./ModalComponents/PermissionSelect.tsx";
import config from '../../../config.json';
import FirstNameField from './ModalComponents/FirstNameField.tsx';
import LastNameField from './ModalComponents/LastNameField.tsx';

interface ModalProps {
    show: boolean;
    setShow(prevState : boolean) : void
    user: User,
    setLocalStatus(prevState: 'idle' | 'loading' | 'error'): void
}

const convertPayload = (rec: Record<string, boolean>): string[] => {
    return Object.entries(rec)
        .filter(([_, val]) => val)
        .map(([key]) => key);
};

const UserModal = (props : ModalProps) : React.JSX.Element => {
    const dispatch = useAppDispatch();
    const account = useAppSelector<User>(state => state.accountInfo.user);

    const handleRequest = () => {
        dispatch(deleteUser({username: props.user.username}));
        setConfirm(false);
        props.setShow(false);
    }

    const handleConfirm = () => setConfirm(true);

    const [confirm, setConfirm] = useState(false);

    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [role, setRole] = useState('');
    const [permissions, setPermissions] = useState<Record<string, boolean>>({});

    const [firstNameEdited, setFirstNameEdited] = useState(false);
    const [lastNameEdited, setLastNameEdited] = useState(false);
    const [roleEdited, setRoleEdited] = useState(false);
    const [permissionsEdited, setPermissionsEdited] = useState(false);

    const handleUpdate = () => {
        dispatch(updateRequest(
            {
                username: props.user.username,
                password: '',
                firstName: firstName,
                lastName: lastName,
                role: role,
                permissions: convertPayload(permissions),
                state: 'AVALIABLE'
            }
        ));
        props.setShow(false);
        props.setLocalStatus('loading');
    }

    return (
        <Modal show={props.show}
               onHide={() => props.setShow(false)}
               centered
               size="xl">
            <Modal.Header closeButton>
                <Modal.Title>Details</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {props.user && (
                    <>
                        <InputGroup className="mb-1">
                            <InputGroup.Text className="col-2">Username</InputGroup.Text>
                            <Form.Control name="lastname" type="text" value={props.user.username} readOnly/>
                        </InputGroup>

                        <FirstNameField setFirstName={setFirstName} firstName={firstName} user={props.user} setEdited={setFirstNameEdited} isEdited={firstNameEdited}/>
                        <LastNameField setLastName={setLastName} lastName={lastName} user={props.user} setEdited={setLastNameEdited} isEdited={lastNameEdited}/>
                        <RoleField setRole={setRole} role={role} user={props.user} setEdited={setRoleEdited} isEdited={roleEdited}/>
                        <PermissionSelect setPermissions={setPermissions} permissions={permissions} user={props.user} setEdited={setPermissionsEdited} isEdited={permissionsEdited}/>

                        {(props.user.username !== account.username 
                            && (account.permissions.includes(config.permissions.MANAGE_USER_ROLES) 
                            || account.permissions.includes(config.permissions.MANAGE_USER_PERMISSIONS)))
                            &&
                            <div className="mt-4 d-flex justify-content-between">
                                <Button variant="success"
                                        disabled={!(firstNameEdited || lastNameEdited || roleEdited || permissionsEdited)}
                                        onClick={handleUpdate}><BsCheck2 className="me-1"/>Confirm</Button>

                            {(props.user.username !== account.username && account.permissions.includes(config.permissions.DELETE_USER)) &&
                                
                                confirm
                                    ? <Button onClick={() => handleRequest()} variant="danger"><BsXLg className="me-1"/>Are you sure?</Button>
                                    : <Button onClick={() => handleConfirm()} variant="danger"><BsXLg className="me-1"/>Delete</Button>
                                    
                            }</div>
                        }
                    </>
                )}
            </Modal.Body>
        </Modal>
    );
};

export default UserModal;