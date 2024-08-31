import React, { useState } from 'react';
import {Button, Col, Container, Modal, OverlayTrigger, Row, Tooltip} from "react-bootstrap";
import DatePicker from 'react-datepicker';
import {BsArrowCounterclockwise, BsCheck2} from 'react-icons/bs';
import {useAppDispatch, useAppSelector} from '../../hooks/redux';
import { planCreate } from '../../store/slices/planSlice';
import 'react-datepicker/dist/react-datepicker.css';
import {SliceError} from "../../models/SliceState.ts";
import { isSameDay } from 'date-fns';

interface EditProps {
    show : boolean,
    setShow(prevState: boolean) : void,
}

const AddTimeModal = (props: EditProps) : React.JSX.Element => {
    const dispatch = useAppDispatch();

    const username = useAppSelector(state => state.accountInfo.user.username);
    const [startDate, setStartDate] = useState<Date>(new Date(Date.now()));
    const [endDate, setEndDate] = useState<Date>(new Date(Date.now()));
    const [error, setError] = useState<SliceError>(null);

    const handleSubmit = () => {
        if (!startDate) { setError("Start date is missing"); return; }
        if (!endDate) { setError("End date is missing"); return; }
        if (startDate >= endDate) { setError("The end date cannot precede the start date"); return; }
        if (!isSameDay(startDate, endDate)) { setError("The dates should take time on the same day"); return; }
        dispatch(planCreate({
            timeStart: startDate!.toISOString(), 
            timeEnd: endDate!.toISOString(),
            username: username
        }));
        handleClose();
    };

    const handleClose = () => {
        setStartDate(new Date());
        setEndDate(new Date());
        setError(null);
        props.setShow(false); 
    }

    return (
        <Modal show={props.show}
            onHide={handleClose}
            centered>
            <Modal.Header closeButton>
                <Modal.Title>Create Plan</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Row className="mb-3">
                    <Col>Start Date:</Col>
                    <Col>
                        <DatePicker
                        selected={startDate}
                        name="startdate"
                        onChange={(date) => setStartDate(date!)}
                        className="form-control rounded text-center"
                        dateFormat="MM/dd/yyyy h:mm aa"
                        todayButton="Today"
                        showTimeInput/>
                    </Col>
                </Row>
                <Row className="mb-3">
                    <Col>End Date:</Col>
                    <Col>
                        <DatePicker
                        name="enddate"
                        selected={endDate}
                        onChange={(date) => setEndDate(date!)}
                        className="form-control rounded text-center"
                        dateFormat="MM/dd/yyyy h:mm aa"
                        todayButton="Today"
                        showTimeInput/>
                    </Col>
                </Row>
                <Container className="d-flex justify-content-between p-0">
                    <Button variant="secondary" onClick={handleClose}><BsArrowCounterclockwise className="me-1"/>Cancel</Button>
                    <OverlayTrigger
                        show={!!error}
                        placement="bottom"
                        overlay={
                            <Tooltip className="mx-2">
                                <div>{error}</div>
                            </Tooltip>
                        }><Button variant="success" onClick={() => handleSubmit()}><BsCheck2 className="me-1"/>Confirm</Button>
                        </OverlayTrigger>
                </Container>
            </Modal.Body>
        </Modal>
    );
};

export default AddTimeModal;