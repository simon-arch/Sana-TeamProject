import React, {useState} from 'react';
import {User, deleteUser} from "../../store/slices/userSlice.ts";
import {Button, Form, InputGroup, Modal} from "react-bootstrap";
import {useAppDispatch, useAppSelector} from "../../hooks/redux.ts";
import {BsCheck2, BsXLg} from "react-icons/bs";
import RoleField from "./ModalComponents/RoleField.tsx";
import PermissionSelect from "./ModalComponents/PermissionSelect.tsx";
import config from '../../../config.json';
import FirstNameField from './ModalComponents/FirstNameField.tsx';
import LastNameField from './ModalComponents/LastNameField.tsx';
import { sendRequest } from '../../store/epics/helpers/request.ts';

interface ModalProps {
    show: boolean;
    setShow(prevState : boolean) : void
    user: User,
}

const convertPayload = (rec: Record<string, boolean>): string[] => {
    return Object.entries(rec)
        .filter(([_, val]) => val)
        .map(([key]) => key);
};

const UserModal = (props : ModalProps) : React.JSX.Element => {
    const dispatch = useAppDispatch();
    const account = useAppSelector<User>(state => state.accountInfo.user);

    const handleConfirmDelete = () => {
        dispatch(deleteUser({ username: props.user.username }));
        props.setShow(false);
    };

    const handleConfirmFiring = () => {
        setState(config.userStatuses.FIRED);
        handleUpdate();
        props.setShow(false);
    };

    const [showConfirm, setShowConfirm] = useState(false);
    const handleClose = () => setShowConfirm(false);
    const handleShowConfirm = () => setShowConfirm(true);

    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [role, setRole] = useState('');
    const [permissions, setPermissions] = useState<Record<string, boolean>>({});
    const [state, setState] = useState('');

    const [firstNameEdited, setFirstNameEdited] = useState(false);
    const [lastNameEdited, setLastNameEdited] = useState(false);
    const [roleEdited, setRoleEdited] = useState(false);
    const [permissionsEdited, setPermissionsEdited] = useState(false);

    const handleUpdate = () => {
        sendRequest(`mutation {
                user {
                    update_user(
                        user: {
                            username: "${props.user.username}"
                            firstName: "${firstName}"
                            lastName: "${lastName}"
                            role: ${role}
                            permissions: [${convertPayload(permissions)}]
                            state: ${state}
                        } ) { username } } }`);
        props.setShow(false);
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

                                {(props.user.username !== account.username &&
                                        (props.user.state.includes(config.userStatuses.FIRED) && account.permissions.includes(config.permissions.DELETE_USER))) &&
                                <>
                                    <Button onClick={() => handleShowConfirm()} variant="danger"><BsXLg className="me-1"/>Delete</Button>
                                    <Modal show={showConfirm} onHide={handleClose} centered>
                                        <Modal.Header closeButton>
                                            <Modal.Title>User Deletion</Modal.Title>
                                        </Modal.Header>
                                        <Modal.Body>Are you sure you want to delete @{props.user.username}?</Modal.Body>
                                        <Modal.Footer>
                                            <Button variant="danger" onClick={handleConfirmDelete}>
                                                Yes, I am sure
                                            </Button>
                                            <Button variant="secondary" onClick={handleClose}>
                                                Cancel
                                            </Button>
                                        </Modal.Footer>
                                    </Modal>
                                </>
                            }
                                {(props.user.username !== account.username &&
                                        (!props.user.state.includes(config.userStatuses.FIRED) && account.permissions.includes(config.permissions.FIRING_USERS))) &&
                                    <>
                                        <Button onClick={() => handleShowConfirm()} variant="warning"><BsXLg className="me-1"/>Fire</Button>
                                        <Modal show={showConfirm} onHide={handleClose} centered>
                                            <Modal.Header closeButton>
                                                <Modal.Title>User Firing</Modal.Title>
                                            </Modal.Header>
                                            <Modal.Body>Are you sure you want to fire @{props.user.username}?</Modal.Body>
                                            <Modal.Footer>
                                                <Button variant="danger" onClick={handleConfirmFiring}>
                                                    Yes, I am sure
                                                </Button>
                                                <Button variant="secondary" onClick={handleClose}>
                                                    Cancel
                                                </Button>
                                            </Modal.Footer>
                                        </Modal>
                                    </>
                                }

                            </div>
                        }
                    </>
                )}
            </Modal.Body>
        </Modal>
    );
};

export default UserModal;