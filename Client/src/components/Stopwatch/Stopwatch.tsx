import React, {useEffect, useState} from 'react';
import {Button, Card} from "react-bootstrap";
import {GoClock} from "react-icons/go";
import {FaSquare} from "react-icons/fa";
import {FaArrowRightLong} from "react-icons/fa6";
import {BsFillTriangleFill} from "react-icons/bs";
import {sendRequest} from "../../store/epics/helpers/request.ts";
import {useAppSelector} from "../../hooks/redux.ts";

interface TimeStamp {
    id: number,
    timeStart: string,
    timeEnd: string | null
}

const formatTime = (date : Date): string =>
    date.toLocaleTimeString([], {hour: '2-digit', minute: '2-digit', second: "2-digit"});

const getCurrentTime = (): string => formatTime(new Date());

const Stopwatch = () => {
    const username = useAppSelector(state => state.accountInfo.user.username);

    const [active, setActive] = useState(false);
    const [canSend, setCanSend] = useState(false);

    const [lastCheckin, setLastCheckin] = useState('');
    const [prevStamp, setPrevStamp] = useState<TimeStamp>({id: 0, timeEnd: null, timeStart: ""});
    const [currentStamp, setCurrentStamp] = useState<TimeStamp>({id: 0, timeEnd: null, timeStart: ""});

    const getLatest = async () => {
        let response;
        try {
            response = await sendRequest(
                `query { timeStamp { get_latest(username: "${username}") { id timeStart timeEnd } } }`);
        } catch (e) {
            console.log(e.message);
            return;
        }
        const stamp = response.data.timeStamp.get_latest as TimeStamp;

        if (!stamp) return;

        const start = new Date(stamp.timeStart+"+00:00");
        stamp.timeStart = formatTime(start);

        if(stamp.timeEnd) {
            stamp.timeEnd = getCurrentTime();
            setLastCheckin(new Date().toLocaleDateString());
            setCurrentStamp(stamp);
            setActive(true);
        }
        else {
            setLastCheckin(start.toLocaleDateString());
            stamp.timeEnd = formatTime(new Date(stamp.timeEnd+"+00:00"));
            setPrevStamp(stamp);
        }
    }

    useEffect(() => {
        getLatest().then();
    }, []);

    const startNewStamp = async () => {
        const start = new Date();

        let responce;
        try {
            responce = await sendRequest(
                `mutation { timeStamp { add(timeStamp: { username: "${username}", timeStart: "${start.toISOString()}", source: SYSTEM }) { id } } }`);
        } catch (e) {
            console.log(e.message);
            setCurrentStamp({id: 0, timeStart: formatTime(start), timeEnd: formatTime(start)});
            return;
        }
        const id = responce.data.timeStamp.add.id;
        setCurrentStamp({id, timeStart: formatTime(start), timeEnd: formatTime(start)});
    }
    const finishCurrent = async () => {
        try {
            await sendRequest(`mutation { timeStamp { set_time(id: ${currentStamp.id}, timeEnd: "${new Date().toISOString()}") } }`);
        } catch (e) {
            console.log(e.message);
            return;
        }
    }

    useEffect(() => {
        if (active) {
            if (currentStamp.timeStart === '') {
                startNewStamp().then();
            }
            const timer = setInterval(() => setCurrentStamp({...currentStamp, timeEnd: getCurrentTime()}), 1000);
            return () => clearInterval(timer);
        }
        else if (canSend) {
            finishCurrent().then();
            setPrevStamp(currentStamp);
            setCurrentStamp({id: 0, timeEnd: null, timeStart: ""});
            setCanSend(false);
        }
    }, [active, currentStamp]);

    const handleToggle = () => {
        setActive(!active);
        setCanSend(true);
    }

    const stopwatch = (stamp: TimeStamp) => {
        return (
            <div className="d-flex align-items-center gap-2 fs-5">
                <div className="text-secondary">{stamp.timeStart}</div>
                <FaArrowRightLong className="text-secondary pt-1"/>
                <div>{stamp.timeEnd}</div>
            </div>
        );
    }

    return (
        <Card border={active ? "danger" : "success"}>
            <Card.Body className="d-flex justify-content-between align-items-center">
                <h4>Ongoing session</h4>
                <div className="d-flex align-items-center gap-3">
                    <span className="rounded-pill bg-light py-1 px-3 d-flex align-items-center border">
                        <span className="me-2">Last check-in:</span>
                        {lastCheckin}
                        <GoClock className="ms-2"/>
                    </span>
                    {currentStamp.timeStart !== ''
                        ? stopwatch(currentStamp)
                        : prevStamp.timeStart !== ''
                            ? stopwatch(prevStamp)
                            : "no data"
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