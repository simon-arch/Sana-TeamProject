import {useEffect, useState} from "react";
import {sendRequest} from "../../store/epics/helpers/sendRequest.ts";
import VacationCard from "./VacationCard";
import { Button, ToggleButton, ToggleButtonGroup } from "react-bootstrap";
import Vacation, {VacationStatus} from "../../models/Vacation.ts";

const VacationManager = () => {
    const [vacations, setVacations] = useState<Vacation[]>([]);
    const [filter, setFilter] = useState([2]);
    const statuses = [VacationStatus.Approved, VacationStatus.Pending, VacationStatus.Rejected];

    useEffect(() => {
        getAllVacations();
    }, []);

    const getAllVacations = () => {
        sendRequest(`query { vacation { vacations { id, title, description, startDate, endDate, status, sender } } } `)
        .then(vacations => setVacations(vacations.data.vacation["vacations"].reverse()));
    }

    const setVacationStatus = (id: number, status: 'APPROVED' | 'REJECTED') => {
        sendRequest(`mutation { vacation { setStatus(id: ${id}, status: ${status}) { id } } } `)
        .then(() => getAllVacations());
    }

    const handleChangeFilter = (val : React.SetStateAction<number[]>) => setFilter(val);

    return (
        <div>
            <div className="col-8">
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
                                Sent by <span style={{fontStyle: "italic"}}>{appeal.sender}</span>
                                {
                                    appeal.status == 'PENDING' && (
                                        <div className="mt-3">
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