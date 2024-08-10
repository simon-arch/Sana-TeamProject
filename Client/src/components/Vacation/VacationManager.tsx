import {useEffect, useState} from "react";
import {sendRequest} from "../../store/epics/helpers/request";
import VacationCard, { Vacation } from "./VacationCard";
import { Button, ToggleButton, ToggleButtonGroup } from "react-bootstrap";

const VacationManager = () => {
    const [vacations, setVacations] = useState<Vacation[]>([]);
    const [filter, setFilter] = useState([2]);
    const statuses = ['APPROVED', 'PENDING', 'REJECTED'];

    useEffect(() => {
        getAllVacations();
    }, []);

    const getAllVacations = () => {
        sendRequest(`query { vacation { get_all { id, title, description, startDate, endDate, status, sender } } } `)
        .then(vacations => setVacations(vacations.data.vacation.get_all.reverse()));
    }

    const setVacationStatus = (id: Number, status: 'APPROVED' | 'REJECTED') => {
        sendRequest(`mutation { vacation { set_status(id: ${id}, status: ${status}) { id } } } `)
        .then(() => getAllVacations());
    }

    const handleChangeFilter = (val : React.SetStateAction<number[]>) => setFilter(val);

    return (
        <div>
            <div className="w-75">
            <ToggleButtonGroup type="checkbox" defaultValue={filter} onChange={handleChangeFilter} className="mb-2">
                <ToggleButton variant="outline-success" id="tbg-check-1" value={1}>
                    Approved
                </ToggleButton>
                <ToggleButton variant="outline-warning" id="tbg-check-2" value={2}>
                    Pending
                </ToggleButton>
                <ToggleButton variant="outline-danger" id="tbg-check-3" value={3}>
                    Rejected
                </ToggleButton>
            </ToggleButtonGroup>
                { vacations.map((appeal, index) => (
                    filter.includes(statuses.indexOf(appeal.status) + 1) && (
                            <VacationCard key={index} vacation={appeal}>
                                {
                                    appeal.status == 'PENDING' && (
                                        <div className="mt-3">
                                            <h6>Sender: <span>{appeal.sender}</span></h6>
                                            <Button variant="success" onClick={() => setVacationStatus(appeal.id, 'APPROVED')}>Approve</Button>
                                            <Button className="ms-2" variant="danger" onClick={() => setVacationStatus(appeal.id, 'REJECTED')}>Reject</Button>
                                        </div>
                                    )
                                }
                            </VacationCard>
                    ))) 
                }
            </div>
       </div>
    );
  };

export default VacationManager;