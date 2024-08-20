import Calendar from "../components/Calendar/Calendar.tsx";
import Stopwatch from "../components/Stopwatch/Stopwatch.tsx";

const Dashboard = () => {
    return (
        <div className="p-2 mb-3">
            <Stopwatch/>
            <Calendar/>
        </div>
    );
};

export default Dashboard;