import React, { useEffect, useState } from "react";
// service
import { fetchData } from "../services/service";
// components
import Cargando from "./Cargando";

const Mensajes = ({ userData, baseUrl, headers, transformDate, setMessageUnRead, messageUnRead }) => {
    // const
    const [cargando, setCargando] = useState(true);

    useEffect(() => {
        obtenerMensajes();
    }, []);

    const obtenerMensajes = async () => {
        try {
            setCargando(true);
            const result = await fetchData({
                url: `${baseUrl}/moodle-lms-umd/getNotReadMessages?useridto=${userData.mail}`,
                headers
            });
            let nuevosMensajes = [...messageUnRead];
            result.forEach(({ result }) => {
                const body = result.body;
                if (body.hasOwnProperty("messages")) {
                    if (body.messages.length !== 0) {
                        nuevosMensajes = [...nuevosMensajes, ...body.messages];
                    }
                }
            });
            setMessageUnRead(nuevosMensajes)
            setCargando(false);
        } catch (error) {
            console.warn(error);
        }
    };

    return (
        <div>
            {cargando ? (
                <Cargando mensaje={"Se están cargando los mensajes"} />
            ) : messageUnRead.length === 0 ? (
                <Cargando mensaje={"En este momento no tienes mensajes por leer"} isLoading={false} />
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
