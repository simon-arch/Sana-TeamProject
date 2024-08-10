import VacationManager from "../components/Vacation/VacationManager";
import { useAppSelector } from "../hooks/redux";
import config from "../../config.json";
import VacationForm from "../components/Vacation/VacationForm";

const Vacations = () => {
    const permissions = useAppSelector(state => state.accountInfo.user.permissions);

    return (
        <div className="p-3">
            <div className="mb-5">
                <h1>Vacations</h1>
                <p className="text-secondary">Vacation appeals manager</p>
            </div>
            { permissions && permissions.includes(config.permissions.REVIEW_VACATIONS) ? (
                    <VacationManager></VacationManager>
                ) : (
                    <VacationForm></VacationForm>
                )
            }
        </div>
    );
  };

export default Vacations;