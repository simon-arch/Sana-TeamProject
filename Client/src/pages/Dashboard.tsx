import Stopwatch from "../components/Stopwatch/Stopwatch.tsx";
import WorkSessions from "../components/WorkSessions/WorkSessions.tsx";
import {useAppSelector} from "../hooks/redux.ts";

const Dashboard = () => {
    const workType = useAppSelector<string>(state => state.accountInfo.user.workType);
    return (
        <div className="p-2 mb-3">
            {workType === "PART_TIME" && <Stopwatch/>}
            <WorkSessions/>
        </div>
    );
};

export default Dashboard;