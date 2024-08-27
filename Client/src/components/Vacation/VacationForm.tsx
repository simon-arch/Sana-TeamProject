import {useEffect, useState} from "react";
import {Alert, Button, Col, Form, InputGroup, OverlayTrigger, Row, Tooltip} from "react-bootstrap";
import {sendRequest} from "../../store/epics/helpers/sendRequest.ts";
import {useAppSelector} from "../../hooks/redux";
import {Capitalize} from "../../helpers/format";
import {BsJustify, BsType} from "react-icons/bs";
import DatePicker from "react-datepicker";
import 'react-datepicker/dist/react-datepicker.css';
import VacationCard from "./VacationCard";
import User from "../../models/User.ts";
import Vacation from "../../models/Vacation.ts";

const VacationForm = () => {
    const account = useAppSelector<User>(state => state.accountInfo.user);

    const [vacations, setVacations] = useState<Vacation[]>([]);

    useEffect(() => {
        getVacations();
    }, []);

    const getVacations = () => {
        sendRequest(`query { vacation { byUsername(username:"${account.username}") { id, description, startDate, endDate, status } } } `)
        .then(vacations => setVacations(vacations.data.vacation.byUsername.reverse()));
    }

    const [description, setDescription] = useState('');
    const [startDate, setStartDate] = useState<Date>(new Date());
    const [endDate, setEndDate] = useState<Date>(new Date());
    const [error, setError] = useState<string | null>(null);
    const [submit, setSubmit] = useState(false);

    const handleSubmit = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        event.preventDefault();
        if (!startDate) { setError("Start date is missing"); return; }
        if (!endDate) { setError("End date is missing"); return; }
        if (startDate >= endDate) { setError("The end date cannot precede the start date"); return; }
        sendRequest(`mutation { 
                        vacation { 
                            add(vacation: { 
                            description: """${description}""" , 
                            startDate: "${startDate!.toISOString()}", 
                            endDate: "${endDate!.toISOString()}", 
                            sender: "${account.username}" }) 
                        { id } 
                    } }`)
            .then(() => {
        setDescription('');
        setStartDate(new Date());
        setEndDate(new Date());
        setError(null);
        setSubmit(true);
        getVacations();
        }).catch(error => setError(Capitalize(error.message)!));
    };

    return (
        <Row>
            <Col md={4}>
                <InputGroup className="my-3">
                    <InputGroup.Text className="col-4"><BsType className="me-2"/>Description</InputGroup.Text>
                        <Form.Control
                        className="rounded-0"
                        as="textarea"
                        name="description"
                        rows={4}
                        placeholder="Details about your appeal..."
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        autoComplete="off"/>
                </InputGroup>

                <InputGroup className="my-3">
                    <InputGroup.Text className="col-4"><BsJustify className="me-2"/>Start Date</InputGroup.Text>
                    <Form.Group>
                        <DatePicker
                            name="startDate"
                            selected={startDate}
                            onChange={(date) => setStartDate(date!)}
                            className="form-control rounded-0"
                            dateFormat="MMMM d, yyyy"
                        />
                    </Form.Group>
                </InputGroup>

                <InputGroup className="my-3">
                    <InputGroup.Text className="col-4"><BsJustify className="me-2"/>End Date</InputGroup.Text>
                    <Form.Group>
                        <DatePicker
                            name="endDate"
                            selected={endDate}
                            onChange={(date) => setEndDate(date!)}
                            className="form-control rounded-0"
                            dateFormat="MMMM d, yyyy"
                        />
                    </Form.Group>
                </InputGroup>

                <OverlayTrigger
                        show={!!error}
                        placement="right"
                        overlay={
                            <Tooltip className="mx-2">
                                <div>{error}</div>
                            </Tooltip>
                        }>
                    <Button variant="success" type="submit" onClick={(e) => handleSubmit(e)}>
                        Send
                    </Button>
                </OverlayTrigger>

                <Alert show={submit} variant="success" className="my-3">
                    <p>Your appeal has been sent. Wait for approval.</p>
                    <div className="d-flex justify-content-end">
                    <Button onClick={() => setSubmit(false)} variant="success">
                        Got it
                    </Button>
                    </div>
                </Alert>
            </Col>
            <Col style={{overflowY: "scroll", height: "84vh"}} className="d-flex justify-content-center">
                <div className="w-100">
                    { vacations.map((vacation, index) => (
                        <VacationCard key={index} vacation={vacation}></VacationCard>
                    )) }
                </div>
            </Col>
        </Row>
    );
};

export default VacationForm;