import { useState } from "react";
import Calendar from "../components/Calendar/Calendar.tsx";
import Stopwatch from "../components/Stopwatch/Stopwatch.tsx";

const Dashboard = () => {
    const [status, setStatus] = useState<'loading' | 'idle' | 'error'>('idle');

    return (
        <div className="p-2 mb-3">
            <Stopwatch setStatus={setStatus}/>
            <Calendar status={status}/>
        </div>
    );
};

export default Dashboard;