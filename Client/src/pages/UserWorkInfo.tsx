import WorkInfo from "../components/WorkInfo/WorkInfo";

const UserWorkInfo = () => {
    return (
        <div className="p-3 pb-0">
            <div>
                <h1>Statistics</h1>
                <p className="text-secondary">Employee productivity chart</p>
            </div>
            <WorkInfo/>
        </div>
    );
};

export default UserWorkInfo;