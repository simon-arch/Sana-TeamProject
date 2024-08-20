import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import {useAppDispatch, useAppSelector} from '../../hooks/redux';
import {useEffect, useState} from 'react';
import EditTimeModal from './EditPlanModal';
import AddTimeModal from './AddPlanModal';
import {Plan, planRequest} from '../../store/slices/planSlice';
import {Localize} from '../../helpers/format';
import {getContrast, stringToHex} from '../../helpers/calculate';
import {Dropdown, DropdownButton} from 'react-bootstrap';
import {User, getUsers} from '../../store/slices/userSlice';
import {Status} from "../../helpers/types.ts";
import {sendRequest} from "../../store/epics/helpers/request.ts";

const Planner = () => {
    const [showEdit, setShowEdit] = useState(false);
    const [showAdd, setShowAdd] = useState(false);
    const [showDrop, setShowDrop] = useState(false);

    const username = useAppSelector<string>(state => state.accountInfo.user.username);
    const status = useAppSelector<Status>(state => state.plans.status);
    const plans = useAppSelector<Plan[]>(state => state.plans.plans);

    const [events, setEvents] = useState([{}]);
    const [slotMinutes, setSlotMinutes] = useState(60);
    const [editedPlan, setEditedPlan] = useState<Plan>();
    const [selectedUsers, setSelectedUsers] = useState<string[]>([username]);
    const [searchQuery, setSearchQuery] = useState('');

    const users = useAppSelector<User[]>(state => state.users.users);

    const dispatch = useAppDispatch();

    useEffect(() => {
        dispatch(planRequest(selectedUsers));
    }, [selectedUsers]);

    useEffect(() => {
        dispatch(getUsers({fields: `username`}));
    }, [])

    useEffect(() => {
        if (status == 'idle' && plans) {
            const newEvents = plans.map(plan => (
                {
                    title: `${plan.owner}: ${plan.title}`,
                    start: Localize(plan.timeStart),
                    end: Localize(plan.timeEnd),
                    backgroundColor: `#${stringToHex(plan.owner)}`,
                    textColor: `#${getContrast(stringToHex(plan.owner))}`,
                    relation: plan
                }
            ))
        setEvents(newEvents);}
    }, [status, plans, showEdit, showAdd]);

    const handleEventClick = context => {
        setEditedPlan(context.event.extendedProps.relation);
        setShowEdit(true); 
    }

    const addButton = { text: 'Add +', click: () => setShowAdd(true) };
    const posZoom = { text: '+', click: () => setSlotMinutes(Math.max(15, slotMinutes - 15)) };
    const negZoom = { text: '-', click: () => setSlotMinutes(Math.min(60, slotMinutes + 15)) };

    const handleSelect = (user: User) => {
        setSelectedUsers((prevSelectedUsers) =>
            prevSelectedUsers.includes(user.username)
                ? prevSelectedUsers.filter((username) => username !== user.username)
                : [...prevSelectedUsers, user.username]
        );
      };

    const filteredUsers = users.filter((user) => user.username.includes(searchQuery));

    return (
        <div>
            <DropdownButton
                className="pb-1"
                autoClose="outside"
                title={ `Selected (${selectedUsers.length}): `+(selectedUsers.length > 0 ?
                        selectedUsers.length > 3 ? 
                            `${selectedUsers.slice(0, 3).join(', ')}, ...`
                            : selectedUsers.join(', ') 
                        : 'none') }
                variant="secondary"
                onToggle={() => setShowDrop(!showDrop)}
                show={showDrop}>
                <div className="px-2">
                    <input
                    type="text"
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}/>
                </div>
                <div style={{ maxHeight: '200px', overflowY: 'auto'}}>
                    {
                        filteredUsers.length > 0 ?
                        (filteredUsers.map((user, index) => (
                            <Dropdown.Item
                            as="button"
                            key={index}
                            eventKey={index}
                            onClick={(e) => {
                                e.preventDefault();
                                handleSelect(user);
                        }}><input
                                type="checkbox"
                                checked={selectedUsers.includes(user.username)}
                                readOnly
                                className="me-2"/>
                            {user.username} {user.username === username && "(you)"}
                        </Dropdown.Item>
                        ))) : <Dropdown.Item disabled>No users found</Dropdown.Item>
                    }
                </div>
            </DropdownButton>
            <FullCalendar
                headerToolbar={{
                    left: 'today prev,next addButton',
                    center: 'title',
                    right: 'negZoom,posZoom dayGridMonth,timeGridWeek,timeGridDay'
                  }}
                customButtons={{
                    addButton: addButton,
                    posZoom: posZoom,
                    negZoom: negZoom
                }}
                allDayText=''
                buttonIcons={false}
                height={"80vh"}
                plugins={[dayGridPlugin, timeGridPlugin]}
                initialView="dayGridMonth"
                events={events}
                eventBorderColor="#212529"
                slotDuration={`00:${slotMinutes}:00`}
                nowIndicator={true}
                eventClick={handleEventClick}/>
            <EditTimeModal plan={editedPlan!} setShow={setShowEdit} show={showEdit} isGuest={editedPlan?.owner != username}/>
            <AddTimeModal setShow={setShowAdd} show={showAdd}/>
        </div>
    );
};

export default Planner;