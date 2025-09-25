import React, { useEffect, useState } from "react";
import { request } from "@ombiel/aek-lib";


export default Screen = () => {
  const [tokenUser, setTokenUser] = useState(null);
  useEffect(() => {
    // make a request cmAuth
    request.action("get-user").end((err, response) => {
      setTokenUser(response.body);
    });

  }, [])

  return (
    <>
      {
        tokenUser == null ? (
          <>
            <div className="pistion-relative">
              <div className="position-absolute top-50 start-50 translate-middle">
                <div className="card shadow rounded">
                  <div className="card-body">
                    <div className="d-flex align-items-center">
                      <strong className="me-2">Cargando tu chat con Minu...</strong>
                      <div className="spinner-border ms-auto" role="status" aria-hidden="true"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )
          : (
            <iframe
              style={{ height: '100%', width: '100%' }}
              src={`https://minu.uniminuto.edu/chat/minu/${tokenUser.mail}`}
            >
            </iframe>
          )}
    </>
  );

}
