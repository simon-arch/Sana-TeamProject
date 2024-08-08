import {useEffect, useState} from "react";
import {Accordion, Alert, Badge, Button, Card, Col, Form, InputGroup, OverlayTrigger, Row, Tooltip} from "react-bootstrap";
import {sendRequest} from "../store/epics/helpers/request";
import {User} from "../store/slices/userSlice";
import {useAppSelector} from "../hooks/redux";
import {Capitalize} from "../helpers/format";
import {BsJustify, BsType} from "react-icons/bs";

interface Appeal {
    id: Number,
    title: string,
    description: string | null,
    type: 'HOSPITAL' | 'VACATION' | 'PROPOSAL' | 'DISCHARGE',
    status: 'PENDING' | 'APPROVED' | 'REJECTED'
}

const Appeals = () => {
    const account = useAppSelector<User>(state => state.accountInfo.user);

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [type, setType] = useState('PROPOSAL');
    const [error, setError] = useState<string | null>(null);
    const [submit, setSubmit] = useState(false);
    const [appeals, setAppeals] = useState<Appeal[]>([]);

    useEffect(() => {
        getAppeals();
    }, []);

    const getAppeals = () => {
        sendRequest(`query { appeal { get_by_username(username:"${account.username}") { id, title, description, type, status } } } `)
        .then(appeals => setAppeals(appeals.data.appeal.get_by_username.reverse()));
    }

    const handleSubmit = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        event.preventDefault();
        sendRequest(`mutation { appeal { add(appeal: { title: "${title}", description: """${description}""" , type: ${type}, sender: "${account.username}" }) { id } } }`)
        .then(() => {
            setTitle('');
            setDescription('');
            setType('PROPOSAL');
            setError(null);
            setSubmit(true);
            getAppeals();
        }).catch(error => setError(Capitalize(error.message)!));
    };

    return (
        <div className="p-3">
            <div className="mb-5">
                <h1>Appeals</h1>
                <p className="text-secondary">Submit your suggestions and appeals here</p>
            </div>
            <Row>
                <Col md={4}>
                    <InputGroup>
                        <InputGroup.Text className="col-4"><BsType className="me-2"/>Title</InputGroup.Text>
                        <Form.Control
                            type="text"
                            name="title"
                            placeholder="Title of your appeal"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            autoComplete="off"/>
                    </InputGroup>

                    <InputGroup className="my-3">
                        <InputGroup.Text className="col-4"><BsType className="me-2"/>Description</InputGroup.Text>
                            <Form.Control
                            as="textarea"
                            name="description"
                            rows={4}
                            placeholder="Details about your appeal..."
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            autoComplete="off"/>
                    </InputGroup>
            
                    <InputGroup className="my-3">
                        <InputGroup.Text className="col-4"><BsJustify className="me-2"/>Type</InputGroup.Text>
                            <Form.Control
                            as="select"
                            name="type"
                            value={type}
                            onChange={(e) => setType(e.target.value)}>
                            <option value="PROPOSAL">Proposal</option>
                            <option value="HOSPITAL">Hospital</option>
                            <option value="VACATION">Vacation</option>
                            <option value="DISCHARGE">Discharge</option>
                            </Form.Control>
                    </InputGroup>

                    <OverlayTrigger
                            show={!!error}
                            placement="right"
                            overlay={
                                <Tooltip className="mx-2">
                                    <div>{error}</div>
                                </Tooltip>
                            }>
                        <Button variant="primary" type="submit" onClick={(e) => handleSubmit(e)}>
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

                <Col style={{overflowY: "scroll", height: "80vh"}} className="d-flex justify-content-center">
                    <div className="w-75">
                        { appeals.map((appeal, index) => (
                                <Card bg="light"
                                    key={appeals.length - index}
                                    text="black"
                                    className="mb-2">
                                    <Card.Header className="d-flex gap-1">
                                        <Badge style={{fontWeight: "500"}} bg='secondary'>#{appeals.length - index}</Badge>
                                        <Badge style={{fontWeight: "500"}} text={appeal.status == 'PENDING' ? 'dark' : 'white'} 
                                            bg={appeal.status == 'APPROVED' 
                                                ? 'success' : appeal.status == 'PENDING' 
                                                    ? 'warning' : 'danger'}>
                                            {Capitalize(appeal.status)}
                                        </Badge>
                                    </Card.Header>
                                    <Card.Body>
                                        <Card.Title>
                                            <div className="d-flex justify-content-between">
                                                <span className="ms-3">{appeal.title}</span>
                                                <span className="me-4">{Capitalize(appeal.type)}</span>
                                            </div>
                                        </Card.Title>
                                        <Accordion>
                                            <Accordion.Item eventKey="0">
                                                <Accordion.Header>Description</Accordion.Header>
                                                <Accordion.Body>
                                                {appeal.description}
                                                </Accordion.Body>
                                            </Accordion.Item>
                                        </Accordion>
                                    </Card.Body>
                                </Card>
                            )) }
                    </div>
                </Col>
            </Row>
        </div>
    );
  };

export default Appeals;