import { Card, Col, Row, Table } from "react-bootstrap"
import { Capitalize } from "../../helpers/format"

import styles from "./vacation.module.css";

export interface Vacation {
    id: number,
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
            className="mb-2">
            <Card.Header>
                <span className={`${styles["badge"]} ${styles[`badge-${props.vacation.status.toLowerCase()}`]}`}>
                    {Capitalize(props.vacation.status)}
                </span>
            </Card.Header>
            <Card.Body>
                <Row>
                    <Col md={4}>
                        <Table hover className="border rounded">
                            <tbody>
                                <tr>
                                    <td>Title:</td>
                                    <td>{props.vacation.title}</td>
                                </tr>
                                <tr>
                                    <td>Start Date:</td>
                                    <td>{props.vacation.startDate.toString().split("T")[0]}</td>
                                </tr>
                                <tr>
                                    <td>End Date:</td>
                                    <td>{props.vacation.endDate.toString().split("T")[0]}</td>
                                </tr>
                            </tbody>
                        </Table>
                    </Col>
                    <Col style={{overflowY: "scroll", maxHeight: 125}} className="bg-white me-4 border rounded pt-2 mb-3">
                        {(props.vacation.description) ? (props.vacation.description) : ("No description provided.")}
                    </Col>
                </Row>
                {props.children}
            </Card.Body>
        </Card>
    )
}

export default VacationCard