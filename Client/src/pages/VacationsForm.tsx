import VacationForm from "../components/Vacation/VacationForm";

const VacationsForm = () => {

    return (
        <div className="p-3">
            <div className="mb-5">
                <h1>Vacations Form</h1>
                <p className="text-secondary">Send and review your appeals here</p>
            </div>
                <VacationForm/>
        </div>
    );
  };

export default VacationsForm;