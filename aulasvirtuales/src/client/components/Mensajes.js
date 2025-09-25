import React, { useState } from "react";
// components
import Cargando from "./Cargando";

const Mensajes = ({ transformDate, messageUnRead, cargando, mensajeCargando, mensajeSinDatos }) => {
    return (
        <div>
            {cargando ? (
                <Cargando mensaje={mensajeCargando} />
            ) : messageUnRead.length === 0 ? (
                <Cargando mensaje={mensajeSinDatos} isLoading={false} />
            ) : (
                messageUnRead.map(({ id, subject, userfromfullname, timecreated, text }) => {
                    return (
                        <MensajeItem
                            key={id}
                            subject={subject}
                            userfromfullname={userfromfullname}
                            timecreated={timecreated}
                            text={text}
                            transformDate={transformDate}
                        />
                    );
                })
            )}
        </div>
    );
};

const MensajeItem = ({ subject, userfromfullname, timecreated, text, transformDate }) => {
    const [expanded, setExpanded] = useState(false);
    const maxChar = 100;

    const toggleExpanded = () => {
        setExpanded(!expanded);
    };

    const displayedText = expanded ? text : text.substring(0, maxChar) + (text.length > maxChar ? "..." : "");

    return (
        <div className="container mt-2 mb-3">
            <div className="list-group">
                <a href="#" className="list-group-item list-group-item-action unread message-card">
                    <div className="d-flex w-100 justify-content-between">
                        <h5 className="message-subject mb-1">{subject}</h5>
                        <small className="message-time">{transformDate(timecreated)}</small>
                    </div>
                    <p className="mb-1 text-break" dangerouslySetInnerHTML={{ __html: displayedText }}></p>
                    <small className="text-muted text-uppercase">De: {userfromfullname}</small>
                    {text.length > maxChar && (
                        <button className="btn btn-link" onClick={toggleExpanded}>
                            {expanded ? "Ver menos" : "Ver más"}
                        </button>
                    )}
                </a>
            </div>
        </div>
    );
};

export default Mensajes;
