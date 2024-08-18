import React, { useState } from 'react';
import {Button, Col, Container, Form, InputGroup, Modal, OverlayTrigger, Row, Tooltip} from "react-bootstrap";
import DatePicker from 'react-datepicker';
import {BsArrowCounterclockwise, BsCheck2} from 'react-icons/bs';
import {useAppDispatch, useAppSelector} from '../../hooks/redux';
import { planCreate } from '../../store/slices/planSlice';
import { ErrorType } from '../../helpers/types';
import 'react-datepicker/dist/react-datepicker.css';

interface EditProps {
    show : boolean,
    setShow(prevState: boolean) : void,
}

const AddTimeModal = (props: EditProps) : React.JSX.Element => {
    const dispatch = useAppDispatch();

    const username = useAppSelector(state => state.accountInfo.user.username);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState<string | null>('');
    const [startDate, setStartDate] = useState<Date>(new Date(Date.now()));
    const [endDate, setEndDate] = useState<Date>(new Date(Date.now()));
    const [error, setError] = useState<ErrorType>(null);

    const handleSubmit = () => {
        if (!title) { setError("Title is missing"); return; }
        if (!startDate) { setError("Start date is missing"); return; }
        if (!endDate) { setError("End date is missing"); return; }
        if (startDate >= endDate) { setError("The end date cannot precede the start date"); return; }
        dispatch(planCreate({
            title: title,
            description: description,
            timeStart: startDate!.toISOString(), 
            timeEnd: endDate!.toISOString(),
            username: username
        }));
        handleClose();
    };

    const handleClose = () => {
        setTitle('');
        setDescription('');
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
                <InputGroup>
                    <InputGroup.Text className="col-6">Title</InputGroup.Text>
                    <Form.Control className="text-center" 
                        onChange={e => setTitle(e.target.value)}
                        type="text"
                        placeholder="Plan title..."
                        value={title}/>
                </InputGroup>
                <InputGroup className="mt-2" style={{height:150}}>
                    <InputGroup.Text className="col-6">Description</InputGroup.Text>
                    <Form.Control className="text-center" 
                        style={{resize: 'none'}}
                        onChange={e => setDescription(e.target.value)}
                        as="textarea"
                        placeholder="Plan description..."
                        value={description || ""}/>
                </InputGroup>
                <Row className="d-flex justify-content-between my-2">
                    <Col md={5}>
                        <DatePicker
                        selected={startDate}
                        onChange={(date) => setStartDate(date!)}
                        className="form-control rounded text-center"
                        dateFormat="MM/dd/yyyy h:mm aa"
                        todayButton="Today"
                        showTimeInput/>
                    </Col>_
                    <Col md={5}>
                        <DatePicker
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