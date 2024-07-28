import "../../assets/styles/tab-account.css";
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store/index.ts';
import Login from "./login.tsx";
import OffCanvas from "../offcanvas.tsx";
import AccountInfo from "./account-info.tsx";
import { Button } from "react-bootstrap";
import { setAccountInfo } from "../../store/slices/accountSlice.ts";

const AccountWindow: React.FC = () => {
    const dispatch = useDispatch();
    const { firstname } = useSelector((state: RootState) => state.accountInfo.user);
    const { isLoggedIn } = useSelector((state: RootState) => state.accountInfo);

    useEffect(() => {
        if (!isLoggedIn) {
            const token = localStorage.getItem('authToken');
            if (token != null)
                dispatch(setAccountInfo(token));
        }
    }, [dispatch]);

    return (
        <div className="account-container">
            {!isLoggedIn ? (
                <div id="login-container">
                    <Login />
                </div>
            ) : (
                <div id="welcome-container">
                    <OffCanvas title="Account Info Tab"
                                trigger={<span id="welcome-sign">Welcome,<br/>{firstname}!</span>}>
                        <AccountInfo/>
                    </OffCanvas>
                    <div id="control-container">
                        <Button variant='success' className="account-controls">placeholder1</Button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AccountWindow;
