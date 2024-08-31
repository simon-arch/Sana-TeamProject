import React, { useEffect, useState } from 'react';
import {Button, Col, Container, Form, InputGroup, Modal, OverlayTrigger, Row, Tooltip} from "react-bootstrap";
import DatePicker from 'react-datepicker';
import { BsArrowCounterclockwise, BsCheck2, BsXLg } from 'react-icons/bs';
import { useAppDispatch } from '../../hooks/redux';
import { planDelete, planUpdate } from '../../store/slices/planSlice';
import { Localize } from '../../helpers/format';
import 'react-datepicker/dist/react-datepicker.css';
import Plan from "../../models/Plan.ts";
import {SliceError} from "../../models/SliceState.ts";
import { isSameDay } from 'date-fns';

interface EditProps {
    show : boolean,
    setShow(prevState: boolean) : void,
    plan: Plan,
    isGuest: boolean
}

const EditTimeModal = (props: EditProps) : React.JSX.Element => {
    const dispatch = useAppDispatch();

    const [startDate, setStartDate] = useState<Date>();
    const [endDate, setEndDate] = useState<Date>();
    const [error, setError] = useState<SliceError>(null);

    const handleConfirm = () => {
        if (confirm) {
            dispatch(planDelete(props.plan.id));
            handleClose();
        } else setConfirm(true);
    }
    const [confirm, setConfirm] = useState(false);
    
    useEffect(() => {
        if (props.plan) {
            setStartDate(Localize(props.plan.timeStart)!);
            setEndDate(Localize(props.plan.timeEnd)!);
        }
    }, [props.show, props.plan]);

    const handleSubmit = () => {
        if (!startDate) { setError("Start date is missing"); return; }
        if (!endDate) { setError("End date is missing"); return; }
        if (startDate >= endDate) { setError("The end date cannot precede the start date"); return; }
        if (!isSameDay(startDate, endDate)) { setError("The dates should take time on the same day"); return; }
        dispatch(planUpdate({
            id: props.plan.id,
            timeStart: startDate!.toISOString(), 
            timeEnd: endDate!.toISOString()
        }));
        handleClose();
    };

    const handleClose = () => {
        setStartDate(new Date());
        setEndDate(new Date());
        setError(null);
        setConfirm(false); 
        props.setShow(false); 
    }

    return (
        props.plan &&
            <Modal show={props.show}
                onHide={handleClose}
                centered>
                <Modal.Header closeButton>
                    <Modal.Title>Plan Info<span className="ms-1" style={{fontSize: 12}}>#{props.plan.id}</span></Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <InputGroup>
                        <InputGroup.Text className="col-6">Owner</InputGroup.Text>
                        <Form.Control className="text-center" 
                            type="text"
                            name="owner"
                            defaultValue={props.plan.owner}
                            readOnly={true}/>
                    </InputGroup>
                    <Row className="d-flex justify-content-between my-2">
                        <Col md={5}>
                            <DatePicker
                            selected={startDate}
                            name="startdate"
                            todayButton="Today"
                            onChange={(date) => setStartDate(date!)}
                            className="form-control rounded text-center"
                            dateFormat="MM/dd/yyyy h:mm aa"
                            showTimeInput
                            readOnly={props.isGuest}/>
                        </Col>_
                        <Col md={5}>
                            <DatePicker
                            name="enddate"
                            selected={endDate}
                            todayButton="Today"
                            onChange={(date) => setEndDate(date!)}
                            className="form-control rounded text-center"
                            dateFormat="MM/dd/yyyy h:mm aa"
                            showTimeInput
                            readOnly={props.isGuest}/>
                        </Col>
                    </Row>
                    <Container className="d-flex justify-content-between p-0">
                        <Button variant="secondary" onClick={handleClose}><BsArrowCounterclockwise className="me-1"/>Close</Button>
                        { !props.isGuest && <>
                                <Button onClick={() => handleConfirm()} variant="danger"><BsXLg className="me-1"/>{confirm ? "Sure?" : "Delete"}</Button>
                                <OverlayTrigger
                                show={!!error}
                                placement="bottom"
                                overlay={
                                    <Tooltip className="mx-2">
                                        <div>{error}</div>
                                    </Tooltip>
                                }><Button variant="success" onClick={() => handleSubmit()}><BsCheck2 className="me-1"/>Confirm</Button>
                                </OverlayTrigger>
                        </>}
                    </Container>
                </Modal.Body>
            </Modal>
    );
};

export default EditTimeModal;