import { Button, ButtonGroup, Card, Col, ListGroup, Row, Table, ToggleButton } from "react-bootstrap";
import { useAppDispatch, useAppSelector } from "../../hooks/redux";
import TimeStamp from "../../models/TimeStamp";
import React, { useEffect, useState } from "react";
import { format, lastDayOfMonth } from "date-fns";
import { workTimeIntervalRequest } from "../../store/slices/timeStampSlice";
import { getTimeByDifference } from "../../helpers/calculate";
import { Clamp, Localize } from "../../helpers/format";
import { usersRequest } from "../../store/slices/userSlice";
import User from "../../models/User";

const WorkInfo = () => {
    const dispatch = useAppDispatch();

    const timeStamps = useAppSelector<TimeStamp[]>(state => state.timeStamps.monthStamps).filter(ts => ts.timeEnd);

    const users = useAppSelector<User[]>(state => state.users.users);
    const [userIndex, setUserIndex] = useState(0);

    const [month, setMonth] = useState<number>(new Date().getMonth());
    const [year, setYear] = useState<number>(new Date().getFullYear());

    useEffect(() => {
        dispatch(usersRequest({fields: `username firstName lastName`}));
    }, [])

    useEffect(() => {
        const strMonth = month.toString().padStart(2, '0');
        users[userIndex] &&
        dispatch(workTimeIntervalRequest({
            username: users[userIndex].username,
            dateStart: format(new Date(), `${year}-${strMonth}-01`) + 'T00:00:00.000',
            dateEnd: format(lastDayOfMonth(new Date()), `${year}-${strMonth}-dd`) + 'T23:59:59.900'
        }));
    }, [dispatch, users, userIndex, year, month]);

    
    const getTotalTime = () => {
        let time = 0;
        timeStamps.map((ts) => {
            time += (new Date(ts.timeEnd!).getTime() - new Date(ts.timeStart).getTime())
        })
        return time;
    }

    return (
        <div className="p-2 mb-3">
            <Row>
                <Col md={3}>
                    <Card>
                        <Card.Body>
                            <h6>Date: {month.toString().padStart(2, '0')}/{year}</h6>
                            <div className="text-center">
                                <div className="mb-1">
                                    <span className="fs-5"><span className="fw-bold">Month Total:</span> {getTimeByDifference(getTotalTime())}</span>
                                </div>
                                <ButtonGroup className="me-1">
                                    <Button variant="outline-dark" onClick={() => setYear(Clamp(year-1, 1, 3000)!)}>{"<<"}</Button>
                                    <Button variant="outline-dark" disabled>Year</Button>
                                    <Button variant="outline-dark" onClick={() => setYear(Clamp(year+1, 1, 3000)!)}>{">>"}</Button>
                                </ButtonGroup>
                                <ButtonGroup>
                                    <Button variant="outline-dark" onClick={() => setMonth(Clamp(month-1, 1, 12)!)}>{"<<"}</Button>
                                    <Button variant="outline-dark" disabled>Month</Button>
                                    <Button variant="outline-dark" onClick={() => setMonth(Clamp(month+1, 1, 12)!)}>{">>"}</Button>
                                </ButtonGroup>
                            </div>
                        </Card.Body>
                        <ListGroup className="list-group-flush" style={{overflowY: "scroll", maxHeight: "69vh"}}>
                                {
                                    users.map((us, index) => 
                                        <ToggleButton
                                            style={{borderRadius: 0}}
                                            key={index}
                                            id={`radio-${index}`}
                                            type="radio"
                                            variant="light"
                                            name="radio"
                                            value={us.username}
                                            checked={userIndex === index}
                                            onChange={() => setUserIndex(index)}>
                                                {`${us.firstName} ${us.lastName} (${us.username})`}
                                        </ToggleButton>
                                    )
                                }
                        </ListGroup>
                    </Card>
                </Col>
                <Col style={{overflowY: "scroll", maxHeight: "83vh"}}>
                    <Table hover className="border text-center m-0">
                        <thead>
                            <tr>
                                <th className="w-25">Start</th>
                                <th className="w-25">Finish</th>
                                <th className="w-25">Worktime</th>
                                <th className="w-25">Source</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                timeStamps.map((ts, index) => {
                                    const current = new Date(ts.timeStart).toISOString().split('T')[0];
                                    const previous = index > 0 ? new Date(timeStamps[index - 1].timeStart).toISOString().split('T')[0] : null;
                                        return (
                                            <React.Fragment key={index}>
                                                                            {current !== previous && (
                                                    <tr>
                                                        <td colSpan={6} className="bg-light font-weight-bold">
                                                            {Localize(ts.timeStart)!.toLocaleDateString()}
                                                        </td>
                                                    </tr>
                                                    )}
                                                <tr>
                                                    <td>{Localize(ts.timeStart)!.toLocaleTimeString()}</td>
                                                    <td>{Localize(ts.timeEnd)!.toLocaleTimeString()}</td>
                                                    <td>{getTimeByDifference(new Date(ts.timeEnd!).getTime() - new Date(ts.timeStart).getTime())}</td>
                                                    <td>{ts.source}</td>
                                                </tr>
                                            </React.Fragment>
                                        )
                                    }
                                )
                            }
                        </tbody>
                    </Table>
                </Col>
            </Row>
        </div>
    );
};

export default WorkInfo;