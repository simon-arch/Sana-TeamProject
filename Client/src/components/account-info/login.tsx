import "../../assets/styles/tab-account.css";
import React, {useState} from 'react';
import { getAccessToken, setError} from '../../store/slices/accountSlice.ts';
import { Button, Form, InputGroup, OverlayTrigger, Tooltip } from "react-bootstrap";
import { BsFillPersonFill, BsFillKeyFill } from "react-icons/bs";
import {useAppDispatch, useAppSelector} from "../../hooks/redux.ts";

const Login = () => {
    const dispatch = useAppDispatch();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const error = useAppSelector(state => state.accountInfo.error);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (username && password) {
            dispatch(getAccessToken(({username: username, password: password})));
        } else {
            dispatch(setError('All fields are required.'));
        }
    };

    return (
        <div className="account-login">
            <div>
                <InputGroup className="mb-1">
                    <InputGroup.Text><BsFillPersonFill /></InputGroup.Text>
                    <Form.Control
                    value={username}
                    type="text"
                    placeholder="Username"
                    onChange={(e) => setUsername(e.target.value)}/>
                </InputGroup>
            </div>
            <div>
                <InputGroup>
                    <InputGroup.Text><BsFillKeyFill /></InputGroup.Text>
                    <Form.Control
                    value={password}
                    type="password"
                    placeholder="Password"
                    onChange={(e) => setPassword(e.target.value)}/>
                </InputGroup>
            </div>
            <OverlayTrigger
            show={!!error}
            placement="right"
            delay={{ show: 250, hide: 400 }}
            overlay={
                <Tooltip id="login-tooltip">
                    <div>{error}</div>
                </Tooltip>
            }
            >
            <Button id="login-button" variant="success" type="button" onClick={handleSubmit}>Login</Button>
            </OverlayTrigger>
        </div>
    );
};

export default Login;
