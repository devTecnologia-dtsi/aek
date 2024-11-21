import React, { useEffect, useState } from "react";
// components
import Cargando from "./Cargando";
import Eventos from "./Eventos";
// services
import { fetchData } from "../services/service"
// icons
import { MdEventNote } from "@react-icons/all-files/md/MdEventNote"


const Cursos = ({ userData, ctx, baseUrl, headers, transformDate }) => {
    const [infoCursos, setInfoCursos] = useState([])
    const [error, setError] = useState(false)

    // states
    const [eventos, setEventos] = useState([])
    const [cargando, setCargando] = useState(true)
    const [cargandoEventos, setCargandoEventos] = useState({});

    useEffect(() => {
        obtenerCursos()
    }, [])

    const obtenerCursos = async () => {
        try {
            setCargando(true)
            const results = await fetchData({
                url: `${baseUrl}/moodle-lms-umd/getUserCourses?correoInstitucional=${userData.mail}`,
                headers
            })
            let nuevosCursos = [...infoCursos]
            results.forEach(({ executionId, result, }) => {
                if (result.status == '200') {
                    nuevosCursos = [...nuevosCursos, { [executionId]: result.body }]
                }
            })
            setInfoCursos(nuevosCursos)
            setCargando(false)
        } catch (error) {
            setError(true)
        }
    }



    const obtenerEventos = async (id, instancia) => {
        try {
            if (eventos[id] && eventos[id].length > 0 || cargandoEventos[id]) {
                return
            }
            setCargandoEventos(prevState => ({ ...prevState, [id]: true }));
            const { results } = await fetchData({
                url: `${baseUrl}/moodle-lms-umd/getEventsByCourse?idCurso=${id}&instancia=${instancia[0]}`,
                headers
            })
            if (results.length > 0) {
                const { body } = results[0]
                if (body.hasOwnProperty("events")) {
                    if (body.events.length != 0) {
                        setEventos({ ...eventos, [id]: body.events.filter(({eventtype}) => eventtype == 'due' || eventtype == 'close') })
                    }
                }
            }
            setCargandoEventos(prevState => ({ ...prevState, [id]: false }));
        } catch (error) {
            console.error(error)
        }
    }
    return (
        <>
            {
                cargando ?
                    error ?
                        <Cargando mensaje={"¡Ups! Hubo un error al obtener los cursos"} isLoading={false} />
                        :
                        <Cargando mensaje={"Estamos cargando tus cursos"} />
                    :
                    infoCursos.length == 0 ?
                        <Cargando mensaje={"Estamos trabajando para obtener tu información"} isLoading={false} />
                        :
                        <>
                            <div className="container mt-1">
                                <div className="alert text-white text-center" style={{ color: 'black', backgroundColor: '#779b00', borderColor: '#779b00' }} role="alert">
                                    <p>La información que se visualiza a continuación no es considerada una certificación de UNIMINUTO, puede estar sujeta a ajustes y/o modificaciones.</p>
                                </div>
                            </div>
                            {
                                infoCursos.map((curso) => {
                                    const executionId = Object.keys(curso)
                                    return curso[executionId].map(({ id, shortname, fullname, startdate, enddate }) => {
                                        return (
                                            <div className="card text-center m-3" key={id} style={{ borderTop: '4px solid #4AB9AE' }}>
                                                <div className="row g-0">
                                                    <div className="col-md-8">
                                                        <div className="card-header">
                                                            <h5 className="card-title">{fullname} - {shortname}</h5>
                                                        </div>
                                                        <div className="card-body">
                                                            <div className="row g-0 text-center text-uppercase">
                                                                <div className="col-12">
                                                                    <div className="accordion" id={`accordion-${id}`}>
                                                                        <div className="accordion-item">
                                                                            <h2 className="accordion-header" id={`heading-${id}`}>
                                                                                <button className="accordion-button collapsed position-relative" type="button" data-bs-toggle="collapse" data-bs-target={`#collapse-${id}`} aria-expanded="true" aria-controls={`collapse-${id}`} onClick={() => obtenerEventos(id, executionId)}>
                                                                                    <MdEventNote />
                                                                                    Eventos
                                                                                </button>
                                                                            </h2>
                                                                        </div>
                                                                        <div id={`collapse-${id}`} className="accordion-collapse collapse" aria-labelledby={`heading-${id}`} data-bs-parent={`#accordion-${id}`}>
                                                                            <div className="accordion-body">
                                                                                {
                                                                                    cargandoEventos[id] ? (
                                                                                        <Cargando mensaje={"Cargando eventos"} />
                                                                                    ) : (
                                                                                        eventos[id] && eventos[id].length > 0 ? (
                                                                                            <Eventos
                                                                                                eventos={eventos[id]}
                                                                                                transformDate={transformDate}
                                                                                            />
                                                                                        ) : (
                                                                                            <p>No hay eventos disponibles.</p>
                                                                                        )
                                                                                    )
                                                                                }
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    })
                                })
                            }
                        </>
            }
        </>
    )
}

export default Cursos;