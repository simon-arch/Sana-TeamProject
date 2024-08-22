import {useEffect, useState} from 'react';
import {Button, Card} from "react-bootstrap";
import {GoClock} from "react-icons/go";
import {FaSquare} from "react-icons/fa";
import {FaArrowRightLong} from "react-icons/fa6";
import {BsFillTriangleFill} from "react-icons/bs";
import {useAppDispatch, useAppSelector} from "../../hooks/redux.ts";
import {workTimeCreate, workTimeLatestRequest, workTimeUpdate} from "../../store/slices/timeStampSlice.ts";
import TimeStamp from "../../models/TimeStamp.ts";

const formatTime = (date: Date): string =>
    date.toLocaleTimeString([], {hour: '2-digit', minute: '2-digit', second: "2-digit"});

const Stopwatch = () => {
    const dispatch = useAppDispatch();

    const username = useAppSelector<string>(state => state.accountInfo.user.username);
    const latestWorkTime = useAppSelector<TimeStamp | null>(state => state.timeStamps.TimeStamp);

    const [active, setActive] = useState(false);
    const [canSend, setCanSend] = useState(false);
    const [currentWorkTime, setCurrentWorkTime] = useState<TimeStamp | null>(null);

    useEffect(() => {
        dispatch(workTimeLatestRequest({username}));
    }, []);

    useEffect(() => {
        let workTime: TimeStamp | null = null;
        if (latestWorkTime){
            if (!latestWorkTime.timeEnd) {
                setActive(true);
            }
            workTime = {...latestWorkTime} as TimeStamp;
            workTime.timeStart = new Date(`${workTime.timeStart}+00:00`);
            workTime.timeEnd = workTime.timeEnd
                ? new Date(`${workTime.timeEnd}+00:00`)
                : new Date();
        }
        setCurrentWorkTime(workTime);
    }, [latestWorkTime]);

    useEffect(() => {
        if (active && canSend) {
            dispatch(workTimeCreate({
                username: username,
                timeStart: new Date().toISOString(),
                source: 'TIMER'
            }));
        }
        else if (canSend && currentWorkTime) {
            dispatch(workTimeUpdate({
                id: currentWorkTime.id,
                timeEnd: new Date().toISOString()
            }));
            setCanSend(false);
        }
    }, [active, canSend]);

    useEffect(() => {
        if (active && currentWorkTime) {
            const intervalId = setInterval(() => setCurrentWorkTime({...currentWorkTime, timeEnd: new Date()}), 1000);

            return () => clearInterval(intervalId);
        }
    }, [active, currentWorkTime]);

    const handleToggle = () => {
        setActive(!active);
        setCanSend(true);
    }

    const stopwatch = (stamp: TimeStamp) => {
        return (
            <div className="d-flex align-items-center gap-2 fs-5">
                <div className="text-secondary">{formatTime(stamp.timeStart)}</div>
                <FaArrowRightLong className="text-secondary pt-1"/>
                <div>{formatTime(stamp.timeEnd!)}</div>
            </div>
        );
    }

    return (
        <Card className="mb-4" border={active ? "danger" : "success"}>
            <Card.Body className="d-flex justify-content-between align-items-center">
                <h4>Ongoing session</h4>
                <div className="d-flex align-items-center gap-3">
                    {currentWorkTime ?
                        <>
                            <span className="rounded-pill bg-light py-1 px-3 d-flex align-items-center border">
                            <span className="me-2">Last check-in:</span>
                                {currentWorkTime.timeStart.toLocaleDateString()}
                                <GoClock className="ms-2"/>
                            </span>
                            {stopwatch(currentWorkTime)}
                        </> : "no data"
                    }
                    <Button variant={active ? "danger" : "success"} className="ms-4 rounded-circle"
                            style={{aspectRatio: 1}} onClick={handleToggle}>
                        {
                            active
                                ? <FaSquare className="mb-1"/>
                                : <BsFillTriangleFill className="mb-1" style={{transform: "rotate(90deg)"}}/>
                        }
                    </Button>
                </div>
            </Card.Body>
        </Card>
    );
};

export default Stopwatch;