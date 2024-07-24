import React, {useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {getAccountInfo, setError} from '../../hooks/accountSlice.ts';
import {RootState} from "../../store";

const Login = () => {
    const dispatch = useDispatch();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const error = useSelector((state: RootState) => state.accountInfo.error);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (username && password) {
            // @ts-ignore
            dispatch(getAccountInfo({usrn: username, psw: password}));
            console.log('Login successful')
        } else {
            dispatch(setError('Заповніть усі поля'));
        }
    };

    return (
        <div>
            <div>
                <input type="text" value={username} placeholder={'Login'}
                       onChange={(e) => setUsername(e.target.value)}/>
            </div>
            <div>
                <input type="password" value={password} placeholder={'Password'}
                       onChange={(e) => setPassword(e.target.value)}/>
            </div>
            <button type="button" onClick={handleSubmit}>Login</button>

            {error && <div style={{color: 'red'}}>{error}</div>}
        </div>
    );
};

export default Login;
