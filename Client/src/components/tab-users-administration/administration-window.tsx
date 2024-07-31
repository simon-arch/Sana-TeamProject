import UsersList from "./users-list.tsx";
import RegisterUser from "./register-user.tsx";

const AdministrationWindow: React.FC = () => {

    return (
        <>
            <UsersList/>
            <RegisterUser/>
        </>
    );
}

export default AdministrationWindow;