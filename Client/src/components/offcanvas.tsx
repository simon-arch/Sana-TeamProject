import React, { PropsWithChildren, useState } from 'react';
import Offcanvas from 'react-bootstrap/Offcanvas';
import { Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

interface Props extends PropsWithChildren<any>{
    children?: React.ReactElement; // content that will be displayed inside a canvas body.
    title?: string; // text that will be displayed on the top of a canvas.
    trigger?: React.ReactElement; // any react element that will trigger canvas opening.
}

//...props - additional Offcanvas properties from https://react-bootstrap.netlify.app/docs/components/offcanvas/

function OffCanvas({
    children,
    title = "Canvas Template",
    trigger = <Button variant="primary">Canvas</Button>,
    ...props 
} : Props) {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  return (
    <>
        <span onClick={handleShow} style={{ cursor: 'pointer' }}>
            {trigger}
        </span>

        <Offcanvas show={show} onHide={handleClose} {...props}>
            <Offcanvas.Header closeButton>
                <Offcanvas.Title>{title}</Offcanvas.Title>
            </Offcanvas.Header>
            <Offcanvas.Body>
                {children}
            </Offcanvas.Body>
        </Offcanvas>
    </>
  );
}

export default OffCanvas;