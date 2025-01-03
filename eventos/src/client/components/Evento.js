import React from "react";
import { useEffect, useState } from "react";
import { fetchData } from "../services/service"
import CartaEvento from "./CartaEvento";
import Filtros from "./Filtros";
import Cargando from "./Cargando";
import { request } from "@ombiel/aek-lib";

const Evento = ({ ctx }) => {
    // const
    const baseUrlEventos = "https://registros.uniminuto.edu/api_eventos_test";
    // const baseUrlEventos = "http://localhost/api_eventos"
    const baseUrlDA = "https://registros.uniminuto.edu/api_da"
    // const beseUrlWallet = "http://localhost/api_wallet"
    const beseUrlWallet = "https://comunidad.uniminuto.edu/api_wallet_test"

    // states filters
    const [rectorias, setRectorias] = useState([])
    const [sedes, setSedes] = useState([])
    const [sede, setSede] = useState("")
    const [rectoria, setRectoria] = useState("")
    const [areas, setAreas] = useState([])
    const [area, setArea] = useState("")

    // states events
    const [eventos, setEventos] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [cargandoEventos, setCargandoEventos] = useState(true)
    const [userData, setUserData] = useState(null);
    const [mensajeCargando, setMensajeCargando] = useState()
    const [copiaEventos, setCopiaEventos] = useState([])

    // states events inscribed
    const [eventosInscribed, setEventosInscribed] = useState([])
    const [cargandoEventosInsbribed, setCargandoEventosInscribed] = useState(false)

    // state DA 
    const [infoDa, setInfoDa] = useState()

    // quita el estilo verflow hidden que trae el aek por defecto
    const test = document.getElementsByClassName("panel");
    if (test.length > 0) {
        test[0].attributes[1].value = ""
    }
    // obtiene la informacion del usuario por el token
    useEffect(() => {
        // make a request cmAuth
        request.action("get-user").end((err, response) => {
            setUserData(response.body)
        });
    }, [])

    useEffect(() => {
        if (userData) {
            obtenerInfoDA()
        }
    }, [userData]);

    useEffect(() => {
        if (infoDa) {
            setCargando(false)
        }
    }, [infoDa])

    useEffect(() => {
        if (rectoria && sede) {
            setMensajeCargando("")
            obtenerEventos()
        } else {
            setCargandoEventos(true)
            setEventos([])
            setMensajeCargando("Por favor selecciona rectoria y sede")
        }
    }, [rectorias, sedes, rectoria, sede, area])

    const obtenerEventos = async () => {
        try {
            const descRectoria = rectorias.filter(({ CODIGO }) => CODIGO == rectoria)[0]
            const descSede = sedes.filter(({ CODIGO }) => CODIGO == sede)[0]
            setCargandoEventos(true)
            const result = await fetchData({
                url: `${baseUrlEventos}/select/index.php?fn=consultaEventosDisponibles&rol=ESTUDIANTE&area=${area}&rectoria=${descRectoria.DESCRIPCION}&sede=${descSede.DESCRIPCION}`
            });
            setCargandoEventos(false)
            setEventos(result)
            setCopiaEventos(result)
        } catch (error) {
            console.log(`error ${error}`)
        }
    }

    const filtrarEventos = ({ target }) => {
        const { value } = target
        const nuevosEventos = copiaEventos.filter((evento) =>
            evento.actividad.toLowerCase().includes(value.toLowerCase())
            // || evento.sede.toLowerCase().includes(value.toLowerCase())
        );
        setEventos(nuevosEventos)
    }

    const obtenerInfoDA = async () => {
        const result = await fetchData({
            url: `${baseUrlDA}/select/index.php?fn=da&correo=${userData.mail}`
        })
        setInfoDa(result)
    }

    const obtenerEventosInscrito = async () => {
        setCargandoEventosInscribed(true)
        const result = await fetchData({
            url: `${beseUrlWallet}/modules/evento.php?fn=consultas&documento=${infoDa.Pager}&rol=ESTUDIANTE&idEvento=5&accion=consultas`
        })
        setCargandoEventosInscribed(false)
        setEventosInscribed(result)
    }


    return (
        <>
            {
                cargando ?
                    <Cargando mensaje={"Cargando la información"} />
                    :
                    <>
                        <ul className="nav nav-tabs" id="tap-opciones" role="tablist">
                            <li className="nav-item" role="presentation">
                                <button className="nav-link active" id="home-tab" data-bs-toggle="tab" data-bs-target="#eventos-disponibles" type="button" role="tab" aria-controls="home" aria-selected="true">Eventos Disponibles</button>
                            </li>
                            <li className="nav-item" role="presentation">
                                <button className="nav-link" id="profile-tab" data-bs-toggle="tab" data-bs-target="#eventos-inscritos" type="button" role="tab" aria-controls="profile" aria-selected="false" onClick={() => { obtenerEventosInscrito() }}>Eventos Inscritos</button>
                            </li>
                        </ul>
                        <div className="tab-content" id="tap-opciones">
                            <div className="tab-pane fade show active overflow-visible" id="eventos-disponibles" role="tabpanel" aria-labelledby="eventos-disponibles-tab">
                                <Filtros
                                    bannerId={userData.extraAttrs.idUniminuto}
                                    sedes={sedes}
                                    setSedes={setSedes}
                                    rectorias={rectorias}
                                    setRectorias={setRectorias}
                                    sede={sede}
                                    rectoria={rectoria}
                                    setSede={setSede}
                                    setRectoria={setRectoria}
                                    areas={areas}
                                    setAreas={setAreas}
                                    setArea={setArea}
                                    filtrarEventos={filtrarEventos}
                                />
                                {
                                    cargandoEventos ?
                                        <Cargando mensaje={mensajeCargando ? mensajeCargando : "Estamos cargando los eventos"} isLoading={!cargandoEventos} />
                                        :
                                        eventos.length != 0 ?
                                            eventos.map(({ actividad, sede, rectoria, modalidad, fechainicio, idinstancia }, index) => {
                                                return (
                                                    <CartaEvento
                                                        key={index}
                                                        actividad={actividad}
                                                        sede={sede}
                                                        rectoria={rectoria}
                                                        modalidad={modalidad}
                                                        fechainicio={fechainicio}
                                                        idInstancia={idinstancia}
                                                        documento={infoDa.Pager}
                                                        correo={userData.mail}
                                                        inscrito={false}
                                                        ctx={ctx}
                                                    />
                                                )
                                            })
                                            :
                                            <Cargando mensaje={"No se encontraron eventos"} isLoading={false} />
                                }
                            </div>
                            <div className="tab-pane fade" id="eventos-inscritos" role="tabpanel" aria-labelledby="eventos-inscritos-tab">
                                {
                                    cargandoEventosInsbribed ?
                                        <Cargando mensaje={"Un momento, estamos cargando tus eventos"} />
                                        :
                                        eventosInscribed.length != 0 ?
                                            eventosInscribed.map(({ actividad, sede, rectoria, modalidad, fechainicio, evento }, index) => {
                                                return (
                                                    <CartaEvento
                                                        key={index}
                                                        actividad={actividad}
                                                        sede={sede}
                                                        rectoria={rectoria}
                                                        modalidad={modalidad}
                                                        fechainicio={fechainicio}
                                                        idInstancia={evento}
                                                        documento={infoDa.Pager}
                                                        correo={userData.mail}
                                                        inscrito={true}
                                                        ctx={ctx}
                                                    />
                                                )
                                            })
                                            :
                                            <Cargando mensaje={"No te has inscrito a ningun evento"} isLoading={false} />
                                }
                            </div>
                        </div>
                    </>
            }
        </>
    )
}

export default Evento;