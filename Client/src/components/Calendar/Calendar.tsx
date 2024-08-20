import {worktimeListClear, worktimeListRequest} from '../../store/slices/timeStampSlice';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import React, {useEffect, useRef, useState} from 'react';
import { TimeStamp } from '../../store/slices/timeStampSlice';
import EditTimeModal from './EditTimeModal';
import AddTimeModal from './AddTimeModal';
import { Button, Table } from 'react-bootstrap';
import { Localize } from '../../helpers/format';
import { getTimeDifference } from '../../helpers/calculate';
import {endOfWeek, startOfWeek, subWeeks} from "date-fns";
import useInView from "../../hooks/useInView.ts";

const Calendar = () => {
    const [showEdit, setShowEdit] = useState(false);
    const [showAdd, setShowAdd] = useState(false);

    const username = useAppSelector(state => state.accountInfo.user.username);
    const timeStamps = useAppSelector<TimeStamp[]>(state => state.timeStamps.timeStamps);
    const status = useAppSelector<'loading' | 'idle' | 'error'>(state => state.timeStamps.status);
    const totalCount = useAppSelector<'loading' | 'idle' | 'error'>(state => state.timeStamps.totalCount);

    const [editStamp, setEditStamp] = useState<TimeStamp>();
    const [events, setEvents] = useState<TimeStamp[]>([]);

    const [page, setPage] = useState(1);
    const pageSize = 10;

    const tableBottomRef = useRef<HTMLDivElement | null>(null);
    const inView = useInView(tableBottomRef, {threshold: 0});
    const [inViewDebounced, setInViewDebounced] = useState(false);

    const dispatch = useAppDispatch();

    useEffect(() => {
        if (page === 1) {
            dispatch(worktimeListClear());
        }
        dispatch(worktimeListRequest({username, pageSize, pageNumber: page}));
    }, [page]);

    useEffect(() => {
        setInViewDebounced(inView);
    }, [inView]);

    useEffect(() => {
        if (inViewDebounced && status === 'idle') {
            setInViewDebounced(false);
            if (page <  totalCount / pageSize) {
                setPage(page + 1);
            }
        }
    }, [inViewDebounced, status]);

    useEffect(() => {
        setEvents([...timeStamps].sort(
            (b, a) => new Date(a.timeStart).getTime() - new Date(b.timeStart).getTime()
        ))
    }, [timeStamps]);

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
                        <React.Fragment key={index}>
                            {current !== previous && (
                            <tr>
                                <td colSpan={6} className="bg-light font-weight-bold">
                                    {Localize(event.timeStart, "date")}
                                </td>
                            </tr>
                            )}
                            <tr onClick={() => { handleEdit(event) }}>
                                <td>{events.length - index}</td>
                                <td>{Localize(event.timeStart, "time")}</td>
                                { event.timeEnd ? 
                                    <td>{Localize(event.timeEnd, "time")}</td> :
                                    <td className="fst-italic text-primary">in progress</td> }
                                { event.timeEnd ? 
                                    <td>{getTimeDifference(new Date(event.timeStart), new Date(event.timeEnd))}</td> :
                                    <td className="fst-italic text-primary">in progress</td> }
                                <td>{event.source}</td>
                                <td>{event.editor || "none"}</td>
                            </tr>
                        </React.Fragment>
                        );
                    })}
                    </tbody>
                    <EditTimeModal timeStamp={editStamp!} setShow={setShowEdit} show={showEdit}/>
                    <AddTimeModal setShow={setShowAdd} show={showAdd}/>
                </Table>
                <div ref={tableBottomRef} style={{height: 1}}/>
            </div>
        </div>
    );
};

export default Calendar;