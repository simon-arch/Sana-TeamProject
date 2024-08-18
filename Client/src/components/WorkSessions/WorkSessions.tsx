import { worktimeRequest } from '../../store/slices/timeStampSlice';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { useEffect, useState } from 'react';
import { TimeStamp } from '../../store/slices/timeStampSlice';
import EditTimeModal from './EditSessionModal';
import AddTimeModal from './AddSessionModal';
import { Button, Table } from 'react-bootstrap';
import { Localize } from '../../helpers/format';
import { getTimeDifference } from '../../helpers/calculate';
import { Status } from '../../helpers/types';

interface Props {
    status: Status
}

const WorkSessions = (props: Props) => {
    const [showEdit, setShowEdit] = useState(false);
    const [showAdd, setShowAdd] = useState(false);

    const username = useAppSelector(state => state.accountInfo.user.username);
    const status = useAppSelector(state => state.timeStamps.status);
    const timeStamps = useAppSelector<TimeStamp[]>(state => state.timeStamps.timeStamps);

    const [editStamp, setEditStamp] = useState<TimeStamp>();
    const [events, setEvents] = useState<TimeStamp[]>([]);

    const dispatch = useAppDispatch();
    
    useEffect(() => {
        if (props.status == 'idle') {
            dispatch(worktimeRequest(username));
        }
    }, [props.status, showEdit, showAdd])

    useEffect(() => {
        if (status == 'idle' && timeStamps) {
            setEvents([...timeStamps].sort(
                (b, a) => new Date(a.timeStart).getTime() - new Date(b.timeStart).getTime()
            ))
        }
    }, [status, timeStamps]);

    const handleEdit = (event: TimeStamp) => {
        if (event.timeEnd) {
            setEditStamp(event); 
            setShowEdit(true);
        }
    }

    return (
        <div>
            <Button className="mb-2" onClick={() => setShowAdd(true)}>Add +</Button>
            <div style={{overflowY: "scroll", height: "80vh"}}>
                <Table hover className="border text-center">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Start</th>
                            <th>Finish</th>
                            <th>Worktime</th>
                            <th>Source</th>
                            <th>Editor</th>
                        </tr>
                    </thead>
                    <tbody>
                    {events.map((event, index) => {
                        const current = new Date(event.timeStart).toISOString().split('T')[0];
                        const previous = index > 0 ? new Date(events[index - 1].timeStart).toISOString().split('T')[0] : null;

                        return (
                        <>
                            {current !== previous && (
                            <tr>
                                <td colSpan={6} className="bg-light font-weight-bold">
                                    {Localize(event.timeStart)!.toLocaleDateString()}
                                </td>
                            </tr>
                            )}
                            <tr onClick={() => { handleEdit(event) }}>
                                <td>{events.length - index}</td>
                                <td>{Localize(event.timeStart)!.toLocaleTimeString()}</td>
                                { event.timeEnd ? 
                                    <td>{Localize(event.timeEnd)!.toLocaleTimeString()}</td> :
                                    <td className="fst-italic text-primary">in progress</td> }
                                { event.timeEnd ? 
                                    <td>{getTimeDifference(new Date(event.timeStart), new Date(event.timeEnd))}</td> :
                                    <td className="fst-italic text-primary">in progress</td> }
                                <td>{event.source}</td>
                                <td>{event.editor || "none"}</td>
                            </tr>
                        </>
                        );
                    })}
                    </tbody>
                    <EditTimeModal timeStamp={editStamp!} setShow={setShowEdit} show={showEdit}/>
                    <AddTimeModal setShow={setShowAdd} show={showAdd}/>
                </Table>
            </div>
        </div>
    );
};

export default WorkSessions;