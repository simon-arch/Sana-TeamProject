import { useEffect, useState } from "react";
import { sendRequest } from "../../store/epics/helpers/sendRequest.ts";
import VacationCard from "./VacationCard";
import { Button, ToggleButton, ToggleButtonGroup } from "react-bootstrap";
import Vacation, { VacationStatus } from "../../models/Vacation.ts";
import User from "../../models/User.ts";
import { useAppSelector } from "../../hooks/redux.ts";

const VacationManager = () => {
    const [vacations, setVacations] = useState<Vacation[]>([]);
    const [filter, setFilter] = useState([2]);
    const statuses = Object.values(VacationStatus) as VacationStatus[];

    const account = useAppSelector<User>(state => state.accountInfo.user);

    useEffect(() => {
        getAllVacations();
    }, []);

    const getAllVacations = () => {
        sendRequest(`query { vacation { vacations { id, title, description, startDate, endDate, status, sender } } } `)
            .then(response => {
                const allVacations = response.data.vacation.vacations.reverse();
                const filteredVacations = allVacations.filter((vacation: Vacation) => {
                    const { sender } = vacation;
                    const isCurrentUser = sender === account.username;
                    const isApprovedUser = account.approveVacationsForUsers?.includes(sender) || false;
                    return !isCurrentUser && isApprovedUser;
                });

                setVacations(filteredVacations);
            });
    }

    const setVacationStatus = (id: number, status: VacationStatus) => {
        sendRequest(`mutation { vacation { setStatus(id: ${id}, status: ${status}) { id } } } `)
            .then(() => getAllVacations());
    }

    const handleChangeFilter = (val: React.SetStateAction<number[]>) => setFilter(val);

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
                {vacations.map((vacation, index) => {
                    const isApprovedUser = account.approveVacationsForUsers?.includes(vacation.sender) || false;

                    return filter.includes(statuses.indexOf(vacation.status) + 1) && (
                        <VacationCard key={index} vacation={vacation}>
                            Sent by <span style={{ fontStyle: "italic" }}>{vacation.sender}</span>
                            {vacation.status === VacationStatus.Pending && isApprovedUser && (
                                <div className="mt-3">
                                    <Button variant="success" onClick={() => setVacationStatus(vacation.id, VacationStatus.Approved)}>Approve</Button>
                                    <Button className="ms-2" variant="danger" onClick={() => setVacationStatus(vacation.id, VacationStatus.Rejected)}>Reject</Button>
                                </div>
                            )}
                        </VacationCard>
                    );
                })}
            </div>
        </div>
    );
};

export default VacationManager;
