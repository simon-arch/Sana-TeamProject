import {useEffect, useState} from 'react';
import {Button, Form, InputGroup} from "react-bootstrap";
import {useAppSelector} from "../../../hooks/redux.ts";
import {User} from "../../../store/slices/userSlice.ts";
import {BsArrowCounterclockwise} from "react-icons/bs";
import config from '../../../../config.json';

interface LastNameFieldProps {
    user: User,
    isEdited: boolean,
    setEdited(prevState: boolean): void,
    setLastName(prevState: string) : void,
    lastName: string
}

const LastNameField = (props : LastNameFieldProps) => {
    const account = useAppSelector<User>(state => state.accountInfo.user);

    const [sourceLastName, setSourceLastName] = useState('');

    useEffect(() => {
        if (props.user) {
            props.setLastName(props.user.lastName);
            setSourceLastName(props.user.lastName);
            props.setEdited(false);
        }
    }, [props.user]);

    const handleChange = (lastName: string) => {
        const newLastName = lastName;
        if (sourceLastName !== newLastName) {
            props.setEdited(true);
        }
        props.setLastName(newLastName);
    }

    const handleReset = () => {
        props.setLastName(sourceLastName);
        props.setEdited(false);
    }

    return (
        <InputGroup className="mb-1">
            <InputGroup.Text className="col-2">Last name</InputGroup.Text>
            {props.user.username === account.username || !account.permissions.includes(config.permissions.MANAGE_USER_ROLES) 
                ?
                <Form.Control name="lastname" type="text" value={props.user.lastName} readOnly/>
                :
                <>
                    <Form.Control
                        type="text"
                        name="lastname"
                        value={props.lastName}
                        autoComplete="off"
                        onChange={e => handleChange(e.target.value)}/>
                    <Button variant="warning" disabled={!props.isEdited} onClick={handleReset}>
                        <BsArrowCounterclockwise/>
                    </Button>
                </>
            }
        </InputGroup>
    );
};

export default LastNameField;