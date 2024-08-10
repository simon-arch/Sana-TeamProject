import {FC, useEffect} from 'react';
import {BsDoorOpenFill, BsEnvelopeFill, BsFillPersonLinesFill, BsPeopleFill, BsQuestionOctagon, BsUiChecksGrid} from "react-icons/bs";
import {useAppDispatch, useAppSelector} from "../../hooks/redux.ts";
import {Link} from "react-router-dom";
import {getAccountInfo, logout} from "../../store/slices/accountSlice.ts";
import {Capitalize} from '../../helpers/format.ts';
import {Badge} from 'react-bootstrap';

const Sidebar : FC = () => {
    const dispatch = useAppDispatch();
    const handleLogout = () => {
        dispatch(logout())
    }

    const {status, user} = useAppSelector(state => state.accountInfo);

    useEffect(() => {
        dispatch(getAccountInfo(user.username));
    }, [dispatch, user.username]);

    return (
        <div className="h-100 border">
            {status != 'loading' &&
                <div className="py-2 ps-3">
                    <h5 className="m-0">{user.firstName} {user.lastName}</h5>
                    <p className="m-0 text-secondary text-capitalize"><Badge>{Capitalize(user.role)}</Badge></p>
                </div>
            }
            <hr className="m-0"/>
            <ul className="list-unstyled">
                <div className="p-3">
                    <li className="my-1">
                        <BsUiChecksGrid className="me-1"/>
                        <Link to="/dashboard" className="text-decoration-none text-black">Dashboard</Link>
                    </li>
                    <li className="my-1">
                        <BsQuestionOctagon className="me-1"/>
                        <Link to="/home" className="text-decoration-none text-black">Placeholder</Link>
                    </li>
                </div>
                <hr className="mx-3 my-0"/>
                <div className="p-3">
                    <li className="mb-2">
                        <small className="text-uppercase text-secondary" style={{fontSize: "0.7rem"}}>Main Menu</small>
                    </li>
                    <li className="my-1">
                        <BsPeopleFill className="me-1"/>
                        <Link to="/employees" className="text-decoration-none text-black">Employees</Link>
                    </li>
                    <li className="my-1">
                        <BsEnvelopeFill className="me-1"/>
                        <Link to="/vacations" className="text-decoration-none text-black">Vacations</Link>
                    </li>
                </div>
                <hr className="mx-3 my-0"/>
                <div className="p-3">
                    <li className="mb-2">
                        <small className="text-uppercase text-secondary" style={{fontSize: "0.7rem"}}>Account</small>
                    </li>
                    <li className="my-1">
                        <BsFillPersonLinesFill className="me-1"/>
                        <Link to="/" className="text-decoration-none text-black">About</Link>
                    </li>
                    <li className="my-1" onClick={handleLogout}>
                        <BsDoorOpenFill className="me-1 text-danger"/>
                        <Link to="/login" className="text-decoration-none text-danger">Logout</Link>
                    </li>
                </div>
            </ul>
        </div>
    );
};

export default Sidebar;