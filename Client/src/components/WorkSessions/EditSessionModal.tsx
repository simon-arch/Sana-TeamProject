import React, { useEffect, useState } from 'react';
import {Button, Col, Container, Form, InputGroup, Modal, OverlayTrigger, Row, Tooltip} from "react-bootstrap";
import { TimeStamp, worktimeDelete, worktimeUpdate } from '../../store/slices/timeStampSlice';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { BsArrowCounterclockwise, BsCheck2, BsXLg } from 'react-icons/bs';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';

interface EditProps {
    show : boolean,
    setShow(prevState: boolean) : void,
    timeStamp: TimeStamp
}

const EditTimeModal = (props: EditProps) : React.JSX.Element => {
    const dispatch = useAppDispatch();

    const username = useAppSelector(state => state.accountInfo.user.username);
    const [startDate, setStartDate] = useState<Date>();
    const [endDate, setEndDate] = useState<Date>();
    const [error, setError] = useState('');

    const handleConfirm = () => {
        if (confirm) {
            dispatch(worktimeDelete(props.timeStamp.id));
            handleClose();
        } else setConfirm(true);
    }
    const [confirm, setConfirm] = useState(false);
    
    useEffect(() => {
        if (props.timeStamp) {
            setStartDate(new Date(props.timeStamp.timeStart+"+00:00"));
            setEndDate(new Date(props.timeStamp.timeEnd+"+00:00"));
        }
    }, [props.show, props.timeStamp]);

    const handleSubmit = () => {
        if (!startDate) { setError("Start date is missing"); return; }
        if (!endDate) { setError("End date is missing"); return; }
        if (startDate >= endDate) { setError("The end date cannot precede the start date"); return; }
        if (startDate >= new Date(Date.now())) { setError("The start date cannot precede current date"); return; }
        if (endDate >= new Date(Date.now())) { setError("The end date cannot precede current date"); return; }
        dispatch(worktimeUpdate({
            id: props.timeStamp.id, 
            timeStart: startDate!.toISOString(), 
            timeEnd: endDate!.toISOString(), 
            editor: username
        }));
        handleClose();
    };

    const handleClose = () => {
        setConfirm(false); 
        props.setShow(false); 
        setError('');
    }

    return (
        props.timeStamp &&
            <Modal show={props.show}
                onHide={handleClose}
                centered>
                <Modal.Header closeButton>
                    <Modal.Title>Edit Timestamp<span className="ms-1" style={{fontSize: 12}}>#{props.timeStamp.id}</span></Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <InputGroup>
                        <InputGroup.Text className="col-6">Current Owner</InputGroup.Text>
                        <Form.Control className="text-center" name="owner"
                            readOnly type="text" value={props.timeStamp.username}/>
                    </InputGroup>
                    <InputGroup className="mt-2">
                        <InputGroup.Text className="col-6">Current Editor</InputGroup.Text>
                        <Form.Control className="text-center" name="editor" readOnly type="text" value={
                            props.timeStamp.source == "USER" 
                            ? props.timeStamp.editor! : props.timeStamp.source
                        }/>
                    </InputGroup>
                    <Row className="d-flex justify-content-between my-2">
                        <Col md={5}>
                            <DatePicker
                            name="startdate"
                            selected={startDate}
                            todayButton="Today"
                            onChange={(date) => setStartDate(date!)}
                            className="form-control rounded text-center"
                            dateFormat="MM/dd/yyyy h:mm aa"
                            showTimeInput/>
                        </Col>_
                        <Col md={5}>
                            <DatePicker
                            name="enddate"
                            selected={endDate}
                            todayButton="Today"
                            onChange={(date) => setEndDate(date!)}
                            className="form-control rounded text-center"
                            dateFormat="MM/dd/yyyy h:mm aa"
                            showTimeInput/>
                        </Col>
                    </Row>
                    <Container className="d-flex justify-content-between p-0">
                        <Button variant="secondary" onClick={handleClose}><BsArrowCounterclockwise className="me-1"/>Cancel</Button>
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
                    </Container>
                </Modal.Body>
            </Modal>
    );
};

export default EditTimeModal;