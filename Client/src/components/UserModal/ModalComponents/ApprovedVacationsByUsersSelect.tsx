import {useEffect, useState} from 'react';
import {useAppSelector} from '../../../hooks/redux';
import User, {UserLite, UserStatus} from '../../../models/User';
import {Button, Dropdown, DropdownButton, Form, InputGroup} from 'react-bootstrap';
import {BsArrowCounterclockwise, BsCheck2All} from 'react-icons/bs';

interface Props {
    user: User;
    isEdited: boolean;
    setEdited(prevState: boolean): void;
    setApprovers(prevState: string[]): void;
    approvers: string[];
}

const ApprovedVacationsByUsersSelect = (props: Props) => {
    const [users, setUsers] = useState<UserLite[]>([]);
    const allUsers = useAppSelector<UserLite[]>(state => state.users.usersWithApprovalPermission);

    useEffect(() => {
        setUsers(allUsers.filter(user => user.username != props.user.username));
    }, [allUsers])

    const [sourceCheckboxes, setSourceCheckboxes] = useState<string[]>([]);

    useEffect(() => {
        if (props.user && Array.isArray(props.user.vacationApprovers.approvedVacationsByUsers) && users.length > 0) {
            const target: string[] = [];
            users.forEach(user => {
                if (props.user.vacationApprovers.approvedVacationsByUsers.includes(user.username)) {
                    target.push(user.username);
                }
            });
            props.setApprovers(target);
            setSourceCheckboxes(target);
            props.setEdited(false);
        }
    }, [users, props.user, props.setApprovers, props.setEdited]);

    const handleCheckboxChange = (username: string) => {
        const updatedApprovers = props.approvers.includes(username)
            ? props.approvers.filter(approver => approver !== username)
            : [...props.approvers, username];
        props.setApprovers(updatedApprovers);
    };

    useEffect(() => {
        props.setEdited(props.approvers !== sourceCheckboxes);
    }, [props.approvers]);

    const handleReset = () => {
        props.setApprovers(sourceCheckboxes);
        props.setEdited(false);
    }

    const [searchQuery, setSearchQuery] = useState('');
    const [showDrop, setShowDrop] = useState(false);

    return (
        <InputGroup className="mb-1">
            <DropdownButton
                autoClose="outside"
                title="Review Vacations By"
                variant="secondary col-2 text-start bg-light text-dark"
                onToggle={() => setShowDrop(!showDrop)}
                show={showDrop}>
                <div className="px-2">
                    <input
                        name="search"
                        type="text"
                        placeholder="Search..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}/>
                    <Button className="ms-1" variant="outline-dark"
                            onClick={() => props.setApprovers(users.map(user => user.username))}><BsCheck2All/></Button>
                </div>
                <div style={{maxHeight: '200px', overflowY: 'auto'}}>
                    {
                        users.length > 0 ?
                            (users
                                .filter(user => user.state !== UserStatus.Fired)
                                .map(user => (
                                    <Dropdown.Item
                                        as="button"
                                        key={user.username}
                                        eventKey={user.username}
                                        onClick={(e) => {
                                            e.preventDefault();
                                            handleCheckboxChange(user.username);
                                        }}><input
                                        type="checkbox"
                                        checked={props.approvers.includes(user.username)}
                                        onChange={() => {props.setEdited(true)}}
                                        className="me-2"/>
                                        {`${user.firstName} ${user.lastName}`}
                                    </Dropdown.Item>
                                ))) : <Dropdown.Item disabled>No users found</Dropdown.Item>
                    }
                </div>
            </DropdownButton>
            <Form.Control
                style={{textOverflow: "ellipsis"}}
                type="text"
                name="preset"
                value={(props.approvers.length > 0 ? props.approvers.sort().join(', ') : 'none')}
                autoComplete="off"
                readOnly/>
            <Button variant="warning" disabled={!props.isEdited} onClick={handleReset}>
                <BsArrowCounterclockwise/>
            </Button>
        </InputGroup>
    );
};

export default ApprovedVacationsByUsersSelect;
