import { useEffect } from "react";
import Stopwatch from "../components/Stopwatch/Stopwatch.tsx";
import WorkSessions from "../components/WorkSessions/WorkSessions.tsx";
import {useAppDispatch, useAppSelector} from "../hooks/redux.ts";
import {WorkType} from "../models/User.ts";
import { workTimeIntervalRequest } from "../store/slices/timeStampSlice.ts";
import { format, lastDayOfMonth } from "date-fns";
import TimeStamp from "../models/TimeStamp.ts";
import { getTimeByDifference } from "../helpers/calculate.ts";
import { Card } from "react-bootstrap";

const Dashboard = () => {
    const dispatch = useAppDispatch();

    const timeStamps = useAppSelector<TimeStamp[]>(state => state.timeStamps.monthStamps).filter(ts => ts.timeEnd);
    const {user} = useAppSelector(state => state.accountInfo);

    useEffect(() => {
        dispatch(workTimeIntervalRequest({
            username: user.username,
            dateStart: format(new Date(), 'yyyy-MM-01') + 'T00:00:00.000',
            dateEnd: format(lastDayOfMonth(new Date()), 'yyyy-MM-dd') + 'T23:59:59.900'
        }));
    }, [dispatch, user.username]);

    const getTotalTime = () => {
        let time = 0;
        timeStamps.map((ts) => {
            time += (new Date(ts.timeEnd!).getTime() - new Date(ts.timeStart).getTime())
        })
        return time;
    }

    const workType = useAppSelector<WorkType>(state => state.accountInfo.user.workType);
    return (
        <div className="p-2 mb-3">
            {workType === WorkType.PartTime && <Stopwatch/>}
            <Card className="col-3 mb-2" border="info">
            <Card.Body>
                <Card.Title>Monthly Work Progress</Card.Title>
                <Card.Text style={{ fontSize: 18, fontWeight: 'bold' }}>
                {getTimeByDifference(getTotalTime())}
                </Card.Text>
            </Card.Body>
            </Card>
            <WorkSessions/>
        </div>
    );
};

export default Dashboard;