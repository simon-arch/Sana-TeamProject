import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import { worktimeRequest } from '../../store/slices/timeStampSlice';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { useEffect, useState } from 'react';
import { TimeStamp } from '../../store/slices/timeStampSlice';
import EditTimeModal from './EditTimeModal';
import AddTimeModal from './AddTimeModal';

interface Props {
    status: 'loading' | 'idle' | 'error'
}

const Calendar = (props: Props) => {
    const [showEdit, setShowEdit] = useState(false);
    const [showAdd, setShowAdd] = useState(false);

    const username = useAppSelector(state => state.accountInfo.user.username);
    const status = useAppSelector(state => state.timeStamps.status);
    const timeStamps = useAppSelector<TimeStamp[]>(state => state.timeStamps.timeStamps);

    const [events, setEvents] = useState([{}]);
    const [slotMinutes, setSlotMinutes] = useState(60);
    const [editedStamp, setEditedStamp] = useState<TimeStamp>();

    const dispatch = useAppDispatch();
    
    useEffect(() => {
        //dispatch(getUsers({pageNumber: 1, pageSize: 100}));
        if (props.status == 'idle') {
            dispatch(worktimeRequest(username));
        }
    }, [props.status, showEdit, showAdd])


    useEffect(() => {
        if (status == 'idle' && timeStamps) {
            const newEvents = timeStamps.map(timeStamp => (
                {
                    title: `${timeStamp.username}${timeStamp.username == username && " (you)"}`,
                    start: new Date(timeStamp.timeStart+"+00:00"),
                    end: timeStamp.timeEnd ? new Date(timeStamp.timeEnd+"+00:00") : Date.now(),
                    editor: timeStamp.editor,
                    source: timeStamp.source,
                    backgroundColor: timeStamp.source == "SYSTEM" ? "#6610f2" : "#dc3545",
                    timeStamp: timeStamp
                }
            ))
        setEvents(newEvents);}
    }, [status, timeStamps]);

    const handleEventClick = (context: any) => { 
        setEditedStamp(context.event.extendedProps.timeStamp);
        setShowEdit(true); 
    }

    const addButton = {
        text: 'Add +',
        click: () => setShowAdd(true)
      };

    const posZoom = {
        text: '+',
        click: () => setSlotMinutes(Math.max(15, slotMinutes - 15))
      };

    const negZoom = {
        text: '-',
        click: () => setSlotMinutes(Math.min(60, slotMinutes + 15))
      };

    return (
        <div>
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
                initialView="timeGridWeek"
                events={events}
                eventBorderColor="#212529"
                slotDuration={`00:${slotMinutes}:00`}
                nowIndicator={true}
                eventClick={handleEventClick}/>
            <EditTimeModal timeStamp={editedStamp!} setShow={setShowEdit} show={showEdit}/>
            <AddTimeModal setShow={setShowAdd} show={showAdd}/>
        </div>
    );
};

export default Calendar;