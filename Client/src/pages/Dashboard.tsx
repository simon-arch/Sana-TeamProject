import Stopwatch from "../components/Stopwatch/Stopwatch.tsx";
import WorkSessions from "../components/WorkSessions/WorkSessions.tsx";
import {useAppSelector} from "../hooks/redux.ts";
import {WorkType} from "../models/User.ts";

const Dashboard = () => {
    const workType = useAppSelector<WorkType>(state => state.accountInfo.user.workType);
    return (
        <div className="p-2 mb-3">
            {workType === WorkType.PartTime && <Stopwatch/>}
            <WorkSessions/>
        </div>
    );
};

export default Dashboard;