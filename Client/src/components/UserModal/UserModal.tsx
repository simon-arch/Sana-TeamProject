import React, {useState} from 'react';
import {User} from "../../store/slices/userSlice.ts";
import {Button, FormControl, FormGroup, FormLabel, Modal} from "react-bootstrap";
import {useAppSelector} from "../../hooks/redux.ts";
import {BsCheck2} from "react-icons/bs";
import RoleField from "./RoleField.tsx";
import PermissionSelect from "./PermissionSelect.tsx";
import config from '../../../config.json';

interface ModalProps {
    show: boolean;
    onHide() : void
    user: User,
}

const UserModal = (props : ModalProps) : React.JSX.Element => {
    const account = useAppSelector<User>(state => state.accountInfo.user);

    const [roleEdited, setRoleEdited] = useState(false);
    const [permissionsEdited, setPermissionsEdited] = useState(false);

    const [isConfirm, setConfirm] = useState(false);

    return (
        <Modal show={props.show}
               onHide={props.onHide}
               centered
               size="xl">
            <Modal.Header closeButton>
                <Modal.Title>Details</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {props.user && (
                    <>
                        <FormGroup className="mb-2">
                            <FormLabel>First name</FormLabel>
                            <FormControl type="text" readOnly value={props.user.firstName}/>
                        </FormGroup>
                        <FormGroup className="mb-2">
                            <FormLabel>Last name</FormLabel>
                            <FormControl type="text" readOnly value={props.user.lastName}/>
                        </FormGroup>
                        <FormGroup className="mb-2">
                            <FormLabel>Username</FormLabel>
                            <FormControl type="text" readOnly value={props.user.username}/>
                        </FormGroup>
                        <RoleField user={props.user} setEdited={setRoleEdited} isConfirm={isConfirm} setConfirm={setConfirm}  isEdited={roleEdited}/>
                        <PermissionSelect user={props.user} setEdited={setPermissionsEdited} isConfirm={isConfirm} setConfirm={setConfirm} isEdited={permissionsEdited}/>
                        {(props.user.username !== account.username 
                            && (account.permissions.includes(config.permissions.MANAGE_USER_ROLES) 
                            || account.permissions.includes(config.permissions.MANAGE_USER_PERMISSIONS)))
                            &&
                            <div className="text-end mt-4">
                                <Button variant="success"
                                        disabled={!(roleEdited || permissionsEdited)}
                                        onClick={() => setConfirm(true)}><BsCheck2 className="me-1"/>Confirm</Button>
                            </div>
                        }
                    </>
                )}
            </Modal.Body>
        </Modal>
    );
};

export default UserModal;