import React, { useEffect, useState } from "react";
import { request } from "@ombiel/aek-lib";


export default Screen = () => {
  const [userData, setUserData] = useState(null)
  // host pruebas
  // const baseUrl = "http://10.0.26.31:8080"
  // host produccion
  const baseUrl = "https://fotografias.uniminuto.edu"

  // obtiene la informacion del usuario por el token
  useEffect(() => {
    // make a request cmAuth
    request.action("get-user").end((err, response) => {
      setUserData(response.body)
    });
  }, [])
  return (
    <>
      {
        userData == null ?
          <div className="pistion-relative">
            <div className="position-absolute top-50 start-50 translate-middle">
              <div className="card shadow rounded">
                <div className="card-body">
                  <div className="d-flex align-items-center">
                    <strong className="me-2">Cargando...</strong>
                    <div className="spinner-border ms-auto" role="status" aria-hidden="true"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          :
          <iframe
            src={`${baseUrl}/uploads/${userData.extraAttrs.idUniminuto}?correo=${userData.mail}`}
            style={{ height: '100%', width: '100%' }}
          />
      }
    </>
  );

}
