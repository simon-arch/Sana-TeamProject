import {useEffect, useState} from 'react';
import {Button, Form, InputGroup} from "react-bootstrap";
import {useAppSelector} from "../../../hooks/redux.ts";
import {User} from "../../../store/slices/userSlice.ts";
import {BsArrowCounterclockwise} from "react-icons/bs";
import config from '../../../../config.json';

interface FirstNameFieldProps {
    user: User,
    isEdited: boolean,
    setEdited(prevState: boolean): void,
    setFirstName(prevState: string) : void,
    firstName: string
}

const FirstNameField = (props : FirstNameFieldProps) => {
    const account = useAppSelector<User>(state => state.accountInfo.user);

    const [sourceFirstName, setSourceFirstName] = useState('');

    useEffect(() => {
        if (props.user) {
            props.setFirstName(props.user.firstName);
            setSourceFirstName(props.user.firstName);
            props.setEdited(false);
        }
    }, [props.user]);

    const handleChange = (firstName: string) => {
        const newFirstName = firstName;
        if (sourceFirstName !== newFirstName) {
            props.setEdited(true);
        }
        props.setFirstName(newFirstName);
    }

    const handleReset = () => {
        props.setFirstName(sourceFirstName);
        props.setEdited(false);
    }

    return (
        <InputGroup className="mb-1">
            <InputGroup.Text className="col-2">First name</InputGroup.Text>
            {props.user.username === account.username || !account.permissions.includes(config.permissions.MANAGE_USER_ROLES) 
                ?
                <Form.Control name="firstname" type="text" value={props.user.firstName} readOnly/>
                :
                <>
                    <Form.Control
                        autoComplete="off"
                        type="text"
                        name="firstname"
                        value={props.firstName}
                        onChange={e => handleChange(e.target.value)}/>
                    <Button variant="warning" disabled={!props.isEdited} onClick={handleReset}>
                        <BsArrowCounterclockwise/>
                    </Button>
                </>
            }
        </InputGroup>
    );
};

export default FirstNameField;