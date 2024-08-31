import {useEffect} from 'react';
import {BsCalendar3Range, BsDoorOpenFill, BsEnvelopeFill, BsFillFileBarGraphFill, BsFillPersonLinesFill,
        BsMenuButtonWide, BsPeopleFill, BsUiChecksGrid} from "react-icons/bs";
import {useAppDispatch, useAppSelector} from "../../hooks/redux.ts";
import {Link} from "react-router-dom";
import {accountInfoRequest, logout} from "../../store/slices/accountSlice.ts";
import {Capitalize} from '../../helpers/format.ts';
import {Badge} from 'react-bootstrap';
import { Permission } from '../../models/User.ts';

const Sidebar = () => {
    const dispatch = useAppDispatch();
    const {status, user} = useAppSelector(state => state.accountInfo);

    useEffect(() => {
        dispatch(accountInfoRequest(user.username));
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
                    <li className="mb-2">
                        <small className="text-uppercase text-secondary" style={{fontSize: "0.7rem"}}>Main Menu</small>
                    </li>
                    <li className="my-1">
                        <BsUiChecksGrid className="me-1"/>
                        <Link to="/dashboard" className="text-decoration-none text-black">Dashboard</Link>
                    </li>
                    <li className="my-1">
                        <BsCalendar3Range className="me-1"/>
                        <Link to="/organizer" className="text-decoration-none text-black">Organizer</Link>
                    </li>
                    <li className="my-1">
                        <BsPeopleFill className="me-1"/>
                        <Link to="/employees" className="text-decoration-none text-black">Employees</Link>
                    </li>
                    {
                        user.permissions?.includes(Permission.ViewStatistics) &&
                    <li className="my-1">
                        <BsFillFileBarGraphFill className="me-1"/>
                        <Link to="/workInfo" className="text-decoration-none text-black">Statistics</Link>
                    </li>
                    }
                </div>
                <hr className="mx-3 my-0"/>
                <div className="p-3">
                    <li className="mb-2">
                        <small className="text-uppercase text-secondary" style={{fontSize: "0.7rem"}}>Vacations</small>
                    </li>
                    <li className="my-1">
                        <BsEnvelopeFill className="me-1"/>
                        <Link to="/vacationsForm" className="text-decoration-none text-black">Form</Link>
                    </li>
                    {
                        user.permissions?.includes(Permission.ApproveVacations) &&
                            <li className="my-1">
                                <BsMenuButtonWide className="me-1"/>
                                <Link to="/vacationsManager" className="text-decoration-none text-black">Manager</Link>
                            </li>
                    }
                </div>
                <hr className="mx-3 my-0"/>
                <div className="p-3">
                    <li className="mb-2">
                        <small className="text-uppercase text-secondary" style={{fontSize: "0.7rem"}}>Account</small>
                    </li>
                    <li className="my-1">
                        <BsFillPersonLinesFill className="me-1"/>
                        <Link to="/about" className="text-decoration-none text-black">About</Link>
                    </li>
                    <li className="my-1" onClick={() => dispatch(logout())}>
                        <BsDoorOpenFill className="me-1 text-danger"/>
                        <Link to="/login" className="text-decoration-none text-danger">Logout</Link>
                    </li>
                </div>
            </ul>
        </div>
    );
};

export default Sidebar;