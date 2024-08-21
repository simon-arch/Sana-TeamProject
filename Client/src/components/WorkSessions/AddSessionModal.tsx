import React, { useState } from 'react';
import {Button, Col, Container, Form, InputGroup, Modal, OverlayTrigger, Row, Tooltip} from "react-bootstrap";
import {worktimeCreate} from '../../store/slices/timeStampSlice';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import {BsArrowCounterclockwise, BsCheck2} from 'react-icons/bs';
import {useAppDispatch, useAppSelector} from '../../hooks/redux';

interface EditProps {
    show : boolean,
    setShow(prevState: boolean) : void,
}

const AddTimeModal = (props: EditProps) : React.JSX.Element => {
    const dispatch = useAppDispatch();

    const username = useAppSelector(state => state.accountInfo.user.username);
    const [startDate, setStartDate] = useState<Date>(new Date(Date.now()));
    const [endDate, setEndDate] = useState<Date>(new Date(Date.now()));
    const [error, setError] = useState('');

    const handleSubmit = () => {
        if (!startDate) { setError("Start date is missing"); return; }
        if (!endDate) { setError("End date is missing"); return; }
        if (startDate >= endDate) { setError("The end date cannot precede the start date"); return; }
        if (startDate >= new Date(Date.now())) { setError("The start date cannot precede current date"); return; }
        if (endDate >= new Date(Date.now())) { setError("The end date cannot precede current date"); return; }
        dispatch(worktimeCreate({
            username: username,
            timeStart: startDate!.toISOString(), 
            timeEnd: endDate!.toISOString(),
            source: 'USER',
            editor: username
        }));
        handleClose();
    };

    const handleClose = () => {
        props.setShow(false); 
        setStartDate(new Date(Date.now()));
        setEndDate(new Date(Date.now()));
        setError('');
    }

    return (
        <Modal show={props.show}
            onHide={handleClose}
            centered>
            <Modal.Header closeButton>
                <Modal.Title>Create Timestamp</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <InputGroup>
                    <InputGroup.Text className="col-6">Current Owner</InputGroup.Text>
                    <Form.Control className="text-center" 
                        name="owner"
                        readOnly type="text" value={username}/>
                </InputGroup>
                <InputGroup className="mt-2">
                    <InputGroup.Text className="col-6">Current Editor</InputGroup.Text>
                    <Form.Control className="text-center" 
                        name="editor"
                        readOnly type="text" value={username}/>
                </InputGroup>
                <Row className="d-flex justify-content-between my-2">
                    <Col md={5}>
                        <DatePicker
                        name="startdate"
                        selected={startDate}
                        onChange={(date) => setStartDate(date!)}
                        className="form-control rounded text-center"
                        dateFormat="MM/dd/yyyy h:mm aa"
                        todayButton="Today"
                        showTimeInput/>
                    </Col>_
                    <Col md={5}>
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