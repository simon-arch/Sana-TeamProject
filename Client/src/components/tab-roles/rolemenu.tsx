import "../../assets/styles/tab-roles.css";
import UserCard from "./usercard";

function RoleMenu() {
    return (
      <>
        <table className="table table-striped table-bordered border">
            <thead>
                <tr>
                <th scope="col">Credentials</th>
                <th scope="col">Lorem</th>
                <th scope="col">Role</th>
                </tr>
            </thead>
            <tbody>
                <UserCard name="John Doe" role="Director" placeholder1="lorem"></UserCard>
                <UserCard name="John Doe" role="Accountant" placeholder1="lorem" canEdit isEdited></UserCard>
                <UserCard name="John Doe" role="Accountant" placeholder1="lorem" canEdit></UserCard>
                <UserCard name="John Doe" role="Director" placeholder1="lorem" canEdit></UserCard>
                <UserCard name="John Doe" role="Director" placeholder1="lorem"></UserCard>
                <UserCard name="John Doe" role="Developer" placeholder1="lorem" canEdit isEdited></UserCard>
                <UserCard name="John Doe" role="Developer" placeholder1="lorem"></UserCard>
                <UserCard name="John Doe" role="Accountant" placeholder1="lorem"></UserCard>
            </tbody>
        </table>
      </>
    );
  }
  
  export default RoleMenu;