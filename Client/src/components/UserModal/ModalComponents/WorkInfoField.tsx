import {useEffect, useState} from 'react';
import {Button, Dropdown, DropdownButton, Form, InputGroup} from "react-bootstrap";
import {useAppSelector} from "../../../hooks/redux.ts";
import {BsArrowCounterclockwise} from "react-icons/bs";
import {Capitalize, Clamp} from "../../../helpers/format.ts";
import User, {Permission, WorkType} from "../../../models/User.ts";

interface WorkInfoFieldProps {
    user: User,
    isWorkTypeEdited: boolean,
    setWorkTypeEdited(prevState: boolean): void,
    setWorkType(prevState: WorkType) : void,

    isWorkTimeEdited: boolean,
    setWorkTimeEdited(prevState: boolean): void,
    setWorkTime(prevState: number | null) : void,

    workType: WorkType,
    workTime: number | null
}

const WorkInfoField = (props : WorkInfoFieldProps) => {
    const account = useAppSelector<User>(state => state.accountInfo.user);

    const [sourceWorkType, setSourceWorkType] = useState<WorkType>(WorkType.FullTime);
    const [sourceWorkTime, setSourceWorkTime] = useState<number | null>(null);

    const [allowWorkTime, setAllowWorkTime] = useState(true);

    useEffect(() => {
        if (props.user) {
            setAllowWorkTime(props.user.workType === WorkType.FullTime);

            props.setWorkType(props.user.workType);
            setSourceWorkType(props.user.workType);
            props.setWorkTypeEdited(false);

            props.setWorkTime(props.user.workTime);
            setSourceWorkTime(props.user.workTime);
            props.setWorkTimeEdited(false);
        }
    }, [props.user]);

    const handleWorkTypeChange = (workType: WorkType) => {
        const newWorkType = workType;
        if (sourceWorkType !== newWorkType) {
            props.setWorkTypeEdited(true);
        }
        props.setWorkType(newWorkType);
        setShowTime(newWorkType);
    }

    const handleWorkTypeReset = () => {
        props.setWorkType(sourceWorkType);
        props.setWorkTypeEdited(false);
        setShowTime(sourceWorkType)
    }

    const handleWorkTimeChange = (workTime: number | null) => {
        const newWorkTime = workTime;
        if (sourceWorkTime !== newWorkTime) {
            props.setWorkTimeEdited(true);
        }
        props.setWorkTime(Clamp(newWorkTime, 1, 24) || 1);
    }

    const handleWorkTimeReset = () => {
        props.setWorkTime(sourceWorkTime);
        props.setWorkTimeEdited(false);
    }

    const setShowTime = (workType: string) => {
        setAllowWorkTime(workType === WorkType.FullTime);
        if (workType === WorkType.FullTime) props.setWorkTime(sourceWorkTime);
        else props.setWorkTime(null);
    }

    return (
        <>
            <InputGroup className="mb-1">
                {props.user.username === account.username || !account.permissions.includes(Permission.ManageUserWorkInfo)
                    ?
                    <>
                        <InputGroup.Text className="col-2">Work Type</InputGroup.Text>
                        <Form.Control name="worktype" type="text" value={props.user.workType} readOnly/>
                    </>
                    :
                    <>
                        <DropdownButton
                            variant="secondary col-2 text-start bg-light text-dark"
                            title="Work Type">
                            {Object.values(WorkType).map((type, index) => (
                                <Dropdown.Item key={index} onClick={() => handleWorkTypeChange(type)}>{Capitalize(type)}</Dropdown.Item>
                            ))}
                        </DropdownButton>
                        <Form.Control name="worktype" type="text" value={props.workType} readOnly/>
                        <Button variant="warning" disabled={!props.isWorkTypeEdited} onClick={handleWorkTypeReset}>
                            <BsArrowCounterclockwise/>
                        </Button>
                    </>
                }
            </InputGroup>
            <InputGroup className="mb-1">
                {props.user.username === account.username || !account.permissions.includes(Permission.ManageUserWorkInfo)
                    ?
                    <>
                        <InputGroup.Text className="col-2">Work Time</InputGroup.Text>
                        <Form.Control name="worktime" type="number" value={props.user.workTime || 'Not specified'} readOnly/>
                    </>
                    :
                    <>
                        <InputGroup.Text className="col-2">Work Time</InputGroup.Text>
                        <Form.Control
                        disabled={!allowWorkTime}
                        name="worktime"
                        type="number"
                        step="0.5"
                        min="1"
                        max="24"
                        value={props.workTime || ''}
                        onChange={event => handleWorkTimeChange(Number(event.target.value))}/>
                        <Button variant="warning" disabled={!props.isWorkTimeEdited} onClick={handleWorkTimeReset}>
                            <BsArrowCounterclockwise/>
                        </Button>
                    </>
                }
            </InputGroup>
        </>
    );
};

export default WorkInfoField;