import React, { useEffect, useState } from "react";
// icons
import { FaBook } from "@react-icons/all-files/fa/FaBook";
import { FaInbox } from "@react-icons/all-files/fa/FaInbox";
import { FaBell } from "@react-icons/all-files/fa/FaBell";
// componets
import Cursos from "./Cursos";
import Cargando from "./Cargando";
import Mensajes from "./Mensajes";
// services
import { fetchData } from "../services/service";

const Tabs = ({ ctx, userData }) => {
    // state
    const [messageUnRead, setMessageUnRead] = useState([])
    const [notification, setNotification] = useState([])
    const [cargando, setCargando] = useState(true);

    // const test
    // const baseUrl = 'https://uniminuto.test.digibee.io/pipeline/uniminuto/v1'
    // const headers = { 'apikey': 'uxpWFePgheXvuP9Tun8TYxvjb0FgeSLH' }

    // const production
    const baseUrl = 'https://uniminuto.api.digibee.io/pipeline/uniminuto/v1'
    const headers = { 'apikey': 'ITnjVcrLWfYpY2B246EcrWO6Hln3LD7a' }

    // quita el estilo verflow hidden que trae el aek por defecto
    const element = document.getElementsByClassName("panel");
    if (element.length > 0) {
        element[0].attributes[1].value = ""
    }

    const transformDate = (date) => {
        const dateObject = new Date(date * 1000);

        const year = dateObject.getFullYear();
        const month = dateObject.getMonth() + 1;
        const day = dateObject.getDate();

        const monthNames = [
            'Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'
        ];

        const descripcionMonth = monthNames[month - 1];

        return `${descripcionMonth} ${day}, ${year}`;
    }

    useEffect(() => {
        if (userData) {
            obtenerMensajes();
        }
    }, [userData]);

    const obtenerMensajes = async () => {
        try {
            setCargando(true);
            const result = await fetchData({
                url: `${baseUrl}/moodle-lms-umd/getNotReadMessages?useridto=${userData.mail}`,
                headers
            });
            let nuevosMensajes = [...messageUnRead];
            let nuevasNotificaciones = [...notification];
            result.forEach(({ result }) => {
                const body = result.body;
                if (body.hasOwnProperty("messages")) {
                    if (body.messages.length !== 0) {
                        nuevosMensajes = [...nuevosMensajes, ...body.messages.filter(({ notification }) => !notification)];
                        nuevasNotificaciones = [...nuevasNotificaciones, ...body.messages.filter(({ notification }) => notification)]
                    }
                }
            });
            setMessageUnRead(nuevosMensajes)
            setNotification(nuevasNotificaciones)
            setCargando(false);
        } catch (error) {
            console.warn(error);
        }
    };
    return (
        <>
            {
                userData == null ?
                    <Cargando mensaje={"Estamos obteniendo tu información"} />
                    :
                    <>
                        <nav className="container mt-1">
                            <div className="nav nav-tabs nav-justified" id="nav-tab" role="tablist">
                                <button className="nav-link active" id="nav-cursos-tab" data-bs-toggle="tab" data-bs-target="#nav-cursos" type="button" role="tab" aria-controls="nav-cursos" aria-selected="true"><FaBook /> Cursos</button>
                                <button className="nav-link position-relative" id="nav-mensajes-tab" data-bs-toggle="tab" data-bs-target="#nav-mensajes" type="button" role="tab" aria-controls="nav-mensajes" aria-selected="false">
                                    <FaInbox /> Mensajes sin leer
                                    {
                                        messageUnRead.length > 0
                                            ?
                                            <span className="z-1 position-absolute top-10 start-100 translate-middle badge rounded-pill bg-danger">
                                                {messageUnRead.length}
                                                <span className="visually-hidden">New alerts</span>
                                            </span>
                                            :
                                            null
                                    }
                                </button>
                                <button className="nav-link position-relative" id="nav-notificacion-tab" data-bs-toggle="tab" data-bs-target="#nav-notificacion" type="button" role="tab" aria-controls="nav-notificacion" aria-selected="false">
                                    <FaBell /> Notificaciones
                                    {
                                        notification.length > 0
                                            ?
                                            <span className="z-1 position-absolute top-10 start-100 translate-middle badge rounded-pill bg-danger">
                                                {notification.length}
                                                <span className="visually-hidden">New alerts</span>
                                            </span>
                                            :
                                            null
                                    }
                                </button>
                            </div>
                        </nav>
                        <div className="tab-content" id="nav-tabContent">
                            <div className="tab-pane fade show active" id="nav-cursos" role="tabpanel" aria-labelledby="nav-cursos-tab">
                                <Cursos userData={userData} ctx={ctx} baseUrl={baseUrl} headers={headers} transformDate={transformDate} />
                            </div>
                            <div className="tab-pane fade" id="nav-mensajes" role="tabpanel" aria-labelledby="nav-mensajes-tab">
                                <Mensajes messageUnRead={messageUnRead} cargando={cargando} transformDate={transformDate} mensajeCargando={"Se estan cargando los mensajes"} mensajeSinDatos={"En este momento no tienes mensaje para leer"} />
                            </div>
                            <div className="tab-pane fade" id="nav-notificacion" role="tabpanel" aria-labelledby="nav-notificacion-tab">
                                <Mensajes messageUnRead={notification} cargando={cargando} transformDate={transformDate} mensajeCargando={"Se estan cargando las notificaciones"} mensajeSinDatos={"No tienes notificaciones"} />
                            </div>
                        </div>
                    </>
            }
        </>
    )
}

export default Tabs