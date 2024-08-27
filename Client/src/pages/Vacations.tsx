import VacationManager from "../components/Vacation/VacationManager";
import VacationForm from "../components/Vacation/VacationForm";

const Vacations = () => {

    return (
        <div style={{overflowY: "scroll", height: "100vh"}} className="p-3 pb-0">
            <div className="mb-5">
                <h1>Vacations</h1>
                <p className="text-secondary">Vacation appeals manager</p>
            </div>
            <VacationForm/>
            <VacationManager/>
        </div>
    );
  };

export default Vacations;