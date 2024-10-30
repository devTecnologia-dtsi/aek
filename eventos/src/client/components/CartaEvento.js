import React from "react";
const CartaEvento = ({ actividad, modalidad, rectoria, sede, fechainicio, idInstancia, documento, correo, inscrito, ctx }) => {
    return (
        <div className="card text-center m-3">
            <div className="row g-0">
                <div className="col-md-8">
                    <div className="card-body">
                        <h5 className="card-title">{actividad}</h5>
                        <p className="card-text m-0 p-0 text-muted"><strong>Modalidad:</strong> {modalidad}</p>
                        <p className="card-text m-0 p-0 text-muted"><strong>Rectoria:</strong> {rectoria}</p>
                        <p className="card-text m-0 p-0 text-muted"><strong>Sede:</strong> {sede}</p>
                        <p className="card-text m-0 p-0 text-muted"><strong>Fecha:</strong> {fechainicio}</p>
                        <a className="btn btn-primary" onClick={() => { ctx.router.goto(`/evento/inscribirse/${idInstancia}/${documento}/${correo}`) }}>
                            {
                                inscrito ?
                                    'Ver evento'
                                    :
                                    'Registrarse'
                            }
                        </a>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CartaEvento;