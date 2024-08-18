import Planner from "../components/Planner/Planner.tsx";

const Organizer = () => {
    return (
        <div className="p-3 pb-0">
            <div>
                <h1>Organizer</h1>
                <p className="text-secondary">Share your future plans with others</p>
            </div>
            <Planner/>
        </div>
    );
};

export default Organizer;