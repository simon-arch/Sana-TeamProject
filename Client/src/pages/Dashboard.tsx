import Stopwatch from "../components/Stopwatch/Stopwatch.tsx";
import WorkSessions from "../components/WorkSessions/WorkSessions.tsx";

const Dashboard = () => {
    return (
        <div className="p-2 mb-3">
            <Stopwatch/>
            <WorkSessions/>
        </div>
    );
};

export default Dashboard;