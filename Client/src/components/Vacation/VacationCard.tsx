import { Accordion, Badge, Card } from "react-bootstrap"
import { Capitalize } from "../../helpers/format"

export interface Vacation {
    id: Number,
    title: string,
    description: string | null,
    status: 'PENDING' | 'APPROVED' | 'REJECTED',
    sender: string,
    startDate: Date,
    endDate: Date,
}

interface Props {
    vacation: Vacation
    children?: React.ReactNode;
}

const VacationCard = (props: Props) => {
    return (
        <Card bg="light"
            key={String(props.vacation.id)}
            text="black"
            className="mb-2"
            border={props.vacation.status == 'APPROVED' 
                ? 'success' : props.vacation.status == 'PENDING' 
                    ? 'warning' : 'danger'}>
            <Card.Header className="d-flex gap-1">
                <Badge style={{fontWeight: "500"}} text={props.vacation.status == 'PENDING' ? 'dark' : 'white'} 
                    bg={props.vacation.status == 'APPROVED' 
                        ? 'success' : props.vacation.status == 'PENDING' 
                            ? 'warning' : 'danger'}>
                    {Capitalize(props.vacation.status)}
                </Badge>
            </Card.Header>
            <Card.Body>
                <Card.Title>{props.vacation.title}</Card.Title>
                    <Accordion>
                    <Accordion.Item eventKey="0">
                        <Accordion.Header>Description</Accordion.Header>
                        <Accordion.Body>
                            {(props.vacation.description) ? (props.vacation.description) : ("No description provided.")}
                        </Accordion.Body>
                    </Accordion.Item>
                </Accordion>
                From: {props.vacation.startDate.toString().split("T")[0]}<br/>
                To: {props.vacation.endDate.toString().split("T")[0]}
                {props.children}
            </Card.Body>
        </Card>
    )
}

export default VacationCard