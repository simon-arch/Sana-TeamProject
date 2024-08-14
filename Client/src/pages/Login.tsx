import React, {useState} from 'react';
import {useAppDispatch, useAppSelector} from "../hooks/redux.ts";
import {getAccessToken, setError} from "../store/slices/accountSlice.ts";
import {Button, Form, InputGroup, OverlayTrigger, Tooltip} from "react-bootstrap";
import {BsFillKeyFill, BsFillPersonFill} from "react-icons/bs";

const Login = () : React.JSX.Element => {
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
        <div className="d-flex justify-content-center align-items-center bg-light" style={{minHeight: "100vh"}}>
            <div className={"w-25 d-flex justify-content-center align-items-center bg-white py-3 shadow rounded"} style={{minWidth: 300}}>
                <Form className={"w-75"}>
                    <div className={"mt-5 mb-4 text-center"}>
                        <h2>Greetings!</h2>
                        <p>Enter your account details below.</p>
                    </div>
                    <InputGroup className="mb-2">
                        <InputGroup.Text><BsFillPersonFill/></InputGroup.Text>
                        <Form.Control
                            name="username"
                            value={username}
                            type="text"
                            placeholder="Username"
                            autoComplete="off"
                            onChange={(e) => setUsername(e.target.value)}/>
                    </InputGroup>
                    <InputGroup>
                        <InputGroup.Text><BsFillKeyFill/></InputGroup.Text>
                        <Form.Control
                            name="password"
                            value={password}
                            type="password"
                            placeholder="Password"
                            onChange={(e) => setPassword(e.target.value)}/>
                    </InputGroup>
                    <OverlayTrigger
                        show={!!error}
                        placement="bottom"
                        delay={{show: 250, hide: 400}}
                        overlay={
                            <Tooltip>
                                <div>{error}</div>
                            </Tooltip>
                        }
                    >
                        <div className={"mt-4 mb-5 d-flex justify-content-center"}>
                            <Button className={"w-100"} variant="success" type="button" onClick={handleSubmit}>Login</Button>
                        </div>
                    </OverlayTrigger>
                </Form>
            </div>
        </div>
    );
};

export default Login;