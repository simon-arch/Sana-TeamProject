import UsersList from "./users-list.tsx";
import RegisterUser from "./register-user.tsx";
import OffCanvas from "../offcanvas.tsx";
import {Button} from "react-bootstrap";
import {useSelector} from "react-redux";
import {RootState} from "../../store";
import {hasPermission} from "../../store/helper.ts";

const AdministrationWindow: React.FC = () => {
    const permissions= useSelector((state: RootState) => state.accountInfo.user.permissions);
    const canAddUsers = hasPermission(permissions, "CreateUsers");

    return (
        <>
            {canAddUsers &&
                <div className="d-flex justify-content-end">
                    <OffCanvas title="Register User" placement="end"
                               trigger={<span className="menu-entry"><Button>Add +</Button></span>}>
                        <RegisterUser/>
                    </OffCanvas>
                </div>
            }

            <UsersList/>
        </>
    );
}

export default AdministrationWindow;