import { Table } from "react-bootstrap";
import { useAppSelector } from "../hooks/redux";
import { Capitalize } from "../helpers/format";

const About = () => {
    const account = useAppSelector(state => state.accountInfo.user);

    return (
        <div className="p-3 col-3">
            <div className="mb-5">
                <h1>About</h1>
                <p className="text-secondary">Info about your account</p>
            </div>
            
            <Table hover className="border">
                <tbody>
                    <tr>
                        <td>Username:</td>
                        <td>{account.username}</td>
                    </tr>
                    <tr>
                        <td>First Name:</td>
                        <td>{account.firstName}</td>
                    </tr>
                    <tr>
                        <td>Last Name:</td>
                        <td>{account.lastName}</td>
                    </tr>
                    <tr>
                        <td>Role:</td>
                        <td>{Capitalize(account.role)}</td>
                    </tr>
                    <tr>
                        <td>Permissions:</td>
                        <td>
                            <ul className="m-0 p-0">
                                {account.permissions && account.permissions.map((permission, index) => (
                                    <li key={index} className="list-group-item">{permission}</li>
                                ))}
                            </ul>    
                        </td>
                    </tr>
                    <tr>
                        <td>Work Type:</td>
                        <td>{Capitalize(account.workType)}</td>
                    </tr>
                    <tr>
                        <td>Work Time:</td>
                        <td>{account.workTime || "Not specified"}</td>
                    </tr>
                    <tr>
                        <td>Status:</td>
                        <td>{Capitalize(account.state)}</td>
                    </tr>
                </tbody>
            </Table>
        </div>
    );
};

export default About;