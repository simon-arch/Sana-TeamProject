import VacationManager from "../components/Vacation/VacationManager";
import { useAppSelector } from "../hooks/redux";
import config from "../../config.json";
import VacationForm from "../components/Vacation/VacationForm";

const Vacations = () => {
    const permissions = useAppSelector(state => state.accountInfo.user.permissions);

    return (
        <div style={{overflowY: "scroll", height: "100vh"}} className="p-3 pb-0">
            <div className="mb-5">
                <h1>Vacations</h1>
                <p className="text-secondary">Vacation appeals manager</p>
            </div>
            { permissions && permissions.includes(config.permissions.REVIEW_VACATIONS) ? <VacationManager/> : <VacationForm/> }
        </div>
    );
  };

export default Vacations;