import { useState } from "react";
import Stopwatch from "../components/Stopwatch/Stopwatch.tsx";
import WorkSessions from "../components/WorkSessions/WorkSessions.tsx";
import { Status } from "../helpers/types.ts";

const Dashboard = () => {
    const [status, setStatus] = useState<Status>('idle');

    return (
        <div className="p-2 mb-3">
            <Stopwatch setStatus={setStatus}/>
            <WorkSessions status={status}/>
        </div>
    );
};

export default Dashboard;