import React, { useEffect, useState } from "react";
import { fetchData, postData } from "../services/service"
import QRCode from "react-qr-code";

const Inscribirse = ({ ctx }) => {
    // const 
    // const urlApIWallet = "http://localhost/api_wallet"
    // const urlApIWallet = "https://comunidad.uniminuto.edu/api_wallet_test"
    const urlApIWallet = "https://comunidad.uniminuto.edu/api_wallet"
    // const urlApiEventos = "http://localhost/api_eventos"
    // const urlApiEventos = "https://registros.uniminuto.edu/api_eventos_test"
    const urlApiEventos = "https://registros.uniminuto.edu/api_eventos"

    // state
    const [infoEvento, setInfoEvento] = useState({})
    const [cargando, setCargando] = useState(true)
    const [tipoDocumento, setTipoDocumento] = useState("")
    const [tiposDocumentos, setTiposDocumentos] = useState([])
    const [disabledTipoDocumento, setDisabledTipoDocumento] = useState(true)
    const [formularioCompleto, setFormularioCompleto] = useState(true)
    const [ejecutandoAccion, setEjecutandoAccion] = useState(false)
    const [exitoEjecucionInscripcion, setExitoEjecucionInscripcion] = useState(false)
    const [accionFinalizada, setAccionFinalizada] = useState(false)
    const [exitoCancelacionEvento, setExitoCancelacionEvento] = useState(false)

    const { params } = ctx
    useEffect(() => {
        obtenerInformacionEvento()
        obtenerTiposDocumento()
    }, [])

    const obtenerInformacionEvento = async () => {
        setCargando(true)
        const result = await fetchData({
            url: `${urlApiEventos}/select/index.php?fn=consultaEventoDetalle&evento=${params['id']}&documento=${params['documento']}`
        });
        setInfoEvento(result)
        setCargando(false)
    }

    const obtenerTiposDocumento = async () => {
        setDisabledTipoDocumento(true)
        const result = await fetchData({
            url: `${urlApIWallet}/modules/evento.php?fn=consultaTiposDocumento`
        })
        setTiposDocumentos(result)
        setDisabledTipoDocumento(false)
    }

    const transformDate = (date, isTransformToDateLong) => {
        if (isTransformToDateLong) {
            return transformToLongTime(new Date(date + 'T00:00:00'));
        } else {
            return transformToShortTime(new Date(date * 1000));
        }

    }

    const transformToLongTime = (date) => {
        const year = date.getFullYear();
        const month = date.getMonth() + 1;
        const day = date.getDate();

        const monthNames = [
            'Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'
        ];

        const descripcionMonth = monthNames[month - 1];

        return `${descripcionMonth} ${day}, ${year}`;
    }

    const transformToShortTime = (date) => {
        return date.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })
    }

    const inscribirse = async () => {
        if (tipoDocumento == "") {
            setFormularioCompleto(false)
            return
        }
        setEjecutandoAccion(true)
        const resultSaveEvent = await postData({
            url: `${urlApIWallet}/modules/evento.php`,
            params: JSON.stringify([
                {
                    "idInstancia": params['id'],
                    "tipoUsuario": "1",
                    "tipo_participante": "ESTUDIANTE",
                    "tipoDocumento": tipoDocumento,
                    "correo": params['correo'],
                    "EstadoAsist": "1",
                    "notificaciones": "Si",
                    "rol": "ESTUDIANTE"
                }
            ])
        })
        setEjecutandoAccion(false)
        setExitoEjecucionInscripcion(true)
        if (resultSaveEvent[0].resp) {
            setAccionFinalizada(true)
            setTimeout(() => {
                ctx.router.goto(`/`)
            }, 4000)
        } else {

        }
    }

    const cancelar = async () => {
        setEjecutandoAccion(true)
        const result = await fetchData({ url: `${urlApIWallet}/modules/evento.php?fn=cancelar&id=${infoEvento.idUwallet}` })
        if (result.resp) {
            setAccionFinalizada(true)
            setTimeout(() => {
                ctx.router.goto(`/`)
            }, 4000)
        }
        setEjecutandoAccion(false)
        setExitoCancelacionEvento(true)
    }
    return (
        <>
            {
                cargando
                    ?
                    <div className="align-items-center text-center">
                        <strong>Cargando la informacion del evento...</strong>
                        <div className="spinner-border ms-auto" role="status" aria-hidden="true"></div>
                    </div>
                    :
                    <div className="overflow-auto">
                        <div className="card m-3">
                            <div className="card-header text-uppercase" style={{ borderTop: '4px solid rgb(74, 185, 174)' }}>
                                <div className="row">
                                    <div className="col-2 mt-3">
                                        <button className="btn btn-primary" onClick={() => { ctx.router.goto(`/`) }}>
                                            Volver
                                        </button>
                                    </div>
                                    <div className="col-10">
                                        <p className="mt-2"><b>{infoEvento.actividad}</b></p>
                                        <p className="mt-2 text-muted">{infoEvento.nmproyecto}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="card-body">
                                <div className="row g-0">
                                    <div className="col-md-12">
                                        <div className="card-body p-4">
                                            <div className="row pt- text-center text-uppercase">
                                                <div className="col-6 mb-3">
                                                    <h6><b>Rectoría</b></h6>
                                                    <p className="text-muted">{infoEvento.rectoria}</p>
                                                </div>
                                                <div className="col-6 mb-3">
                                                    <h6><b>Modalidad</b></h6>
                                                    <p className="text-muted">{infoEvento.modalidad}</p>
                                                </div>
                                                <div className="col-6 mb-3">
                                                    <h6><b>Lugar</b></h6>
                                                    <p className="text-muted">{infoEvento.lugarCanal}</p>
                                                </div>
                                                {
                                                    infoEvento.finicioins
                                                        ?
                                                        <div className="col-12 text-center mb-3">
                                                            <h6><b>Fecha de la Actividad</b></h6>
                                                            <div className="row">
                                                                <div className="col-6">
                                                                    <p className="text-muted"><strong>Desde:</strong> {transformDate(infoEvento.fechainicio, true)}</p>
                                                                </div>
                                                                <div className="col-6">
                                                                    <p className="text-muted"><strong>Hasta:</strong> {transformDate(infoEvento.fechafin, true)}</p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        :
                                                        null
                                                }
                                                <div className="col-12 text-center mb-3">
                                                    <h6><b>Objetivo</b></h6>
                                                    <p className="text-muted">{infoEvento.objetivo}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    {
                                        infoEvento.estado == 1 || infoEvento.estado == 2 ?
                                            <QRCode value={btoa(infoEvento.idUwallet)}></QRCode>
                                            :
                                            <div className="">
                                                <strong>FORMULARIO DE REGISTRO</strong>
                                                <hr />
                                                <div className="col-12">
                                                    <select className="form-select" value={tipoDocumento} disabled={disabledTipoDocumento} onChange={(e) => setTipoDocumento(e.target.value)}>
                                                        <option value="">
                                                            {disabledTipoDocumento ? 'Cargando Tipo de Documentos...' : 'Seleccione su tipo de documento'}
                                                        </option>
                                                        {
                                                            tiposDocumentos.length != 0 ?
                                                                tiposDocumentos.map(({ id, nombre, abreviatura }) => <option key={id} value={abreviatura}>{nombre}</option>)
                                                                :
                                                                ""
                                                        }
                                                    </select>
                                                    {!formularioCompleto ? <div id="emailHelp" className="form-text">Este campo es obligatorio</div> : ""}

                                                </div>
                                                <div className="col-12 mt-2">
                                                    <input type="text" className="form-control" placeholder="Documento" value={params['documento']} disabled />
                                                </div>
                                            </div>
                                    }
                                    {
                                        exitoEjecucionInscripcion ?
                                            <div className="col-12 mt-2">
                                                <div className="alert alert-success" role="alert">
                                                    <strong>¡Muy bien!</strong> Te registraste con exito
                                                </div>
                                            </div>
                                            : ""
                                    }
                                    {
                                        exitoCancelacionEvento ?
                                            <div className="col-12 mt-2">
                                                <div className="alert alert-success" role="alert">
                                                    <strong>¡Muy bien!</strong> Cancelaste el evento con exito
                                                </div>
                                            </div>
                                            : ""
                                    }
                                </div>
                            </div>
                            <div className="card-footer">
                                <div className="d-grid gap-2 col-6 mx-auto">
                                    {
                                        ejecutandoAccion
                                            ?
                                            infoEvento.estado == 1 ?
                                                <button className="btn btn-danger" type="button" disabled>
                                                    <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                                    <span className="visually-hidden">Cancelando...</span>
                                                </button>
                                                :
                                                <button className="btn btn-primary" type="button" disabled>
                                                    <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                                    <span className="visually-hidden">Cargando...</span>
                                                </button>
                                            :
                                            infoEvento.estado == 1 || infoEvento.estado == 2 ?
                                                <button className="btn btn-danger" onClick={() => cancelar()} disabled={accionFinalizada}>Cancelar</button>
                                                :
                                                <button className="btn btn-primary" onClick={() => inscribirse()} disabled={accionFinalizada}>Pre-Inscripción</button>
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
            }
        </>
    )
}

export default Inscribirse;