import "../../assets/styles/tab-account.css";
import React, { useState } from 'react';
import { useDispatch, useSelector} from 'react-redux';
import { getAccountInfo, setError} from '../../store/slices/accountSlice.ts';
import { RootState } from "../../store";
import { Button, Form, InputGroup } from "react-bootstrap";
import { BsFillPersonFill, BsFillKeyFill } from "react-icons/bs";

const Login = () => {
    const dispatch = useDispatch();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const error = useSelector((state: RootState) => state.accountInfo.error);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (username && password) {
            dispatch(getAccountInfo({username: username, password: password}));
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
            <Button id="login-button" variant="success" type="button" onClick={handleSubmit}>Login</Button>

            {error && <div style={{color: 'red'}}>{error}</div>}
        </div>
    );
};

export default Login;
