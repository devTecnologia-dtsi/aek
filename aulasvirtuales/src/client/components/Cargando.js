import React from "react";

const Cargando = ({ mensaje, isLoading = true }) => {
    return (
        <div className="align-items-center text-center">
            <div className="card m-3 shadow-lg p-3 mb-5 bg-body rounded">
                <div className="card-body">
                    <div className="d-flex align-items-center">
                        <strong>{`${mensaje}...`}</strong>
                        {
                            isLoading ?
                                <div className="spinner-border ms-auto" role="status" aria-hidden="true"></div>
                                :
                                ""
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Cargando;