import "../assets/styles/offcanvas.css";
import React, { PropsWithChildren, useState } from 'react';
import { Button } from 'react-bootstrap';
import Offcanvas from 'react-bootstrap/Offcanvas';
import { useSelector } from "react-redux";
import { RootState } from "../store";
import {useAppSelector} from "../hooks/redux.ts";

interface Props extends PropsWithChildren<any> {
    children?: React.ReactElement; // content that will be displayed inside a canvas body.
    title?: string; // text that will be displayed on the top of a canvas.
    trigger?: React.ReactElement; // any react element that will trigger canvas opening.
    permission?: string | string[];
}

//...props - additional Offcanvas properties from https://react-bootstrap.netlify.app/docs/components/offcanvas/

function OffCanvas({
    children,
    title = "Canvas Template",
    trigger = <Button variant="primary">Canvas</Button>,
    permission = "any",
    ...props 
} : Props) {
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const {user, status} = useAppSelector(state => state.accountInfo);
    const permissions = user.permissions;
    console.log(status);


    let isAvailable = true;
    if (permission != "any") {
        if (typeof permission === "string") {
            isAvailable = permissions.includes(permission);
        }
        else if (Array.isArray(permission)) {
            isAvailable = permission.some(perm => permissions.includes(perm));
        }
    }

    return (
    <>
        {
            isAvailable && (
                <>
                    <span onClick={handleShow} className="btn-canvas-open">
                        {trigger}
                    </span>
            
                    <Offcanvas show={show} onHide={handleClose} {...props}>
                    <Offcanvas.Header>
                    <Button variant="outline-danger" className="btn-close btn-canvas-close" onClick={handleClose}></Button>
                    <div className="text-center flex-grow-1">
                        <Offcanvas.Title>{title}</Offcanvas.Title>
                    </div>
                    </Offcanvas.Header>
                        <Offcanvas.Body className="canvas-content">
                            {children}
                        </Offcanvas.Body>
                    </Offcanvas>
                </>
            )
        }

    </>
  );
}

export default OffCanvas;