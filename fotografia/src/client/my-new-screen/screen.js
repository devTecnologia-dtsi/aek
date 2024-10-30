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
    // request.action("get-user").end((err, response) => {
    //   setUserData(response.body)
    // });
    setTimeout(() => {
      setUserData({
        "jti": "oiy9WnlLsGzutOakf1-znw",
        "iat": 1715791542,
        "iss": "ExLibris",
        "sub": "CampusMUser",
        "exp": 1718383542,
        "username": "michell.rojas@uniminuto.edu.co",
        "mail": "michell.rojas@uniminuto.edu.co",
        "firstName": "Michell Dayann",
        "lastName": "Rojas Tobar",
        "cmPersonId": 1001911673,
        // "cmPersonId": 1024580021,
        "cmOrgCode": 1000001542,
        "cmProfileGroupId": 1000004751,
        "cmIntegrationProfileId": 4541,
        "extraAttrs": {
          "idUniminuto": "000746978"
          // "idUniminuto": "000209733"
        },
        "cmauthType": "SAML",
        "enc": "FbNlq2dJ01UdV19moUNtpOKQpC5g7pk4SX2_nPFhdoT0wJ1RY_loV3JbHonPtgeAG3BOhoJBkkuesoTcYGgzdP9nok4d4IREJFPkNU_Qz4ZxxjJT9U7Cb0Wz6wZS2mzjrpYb3so46QjDngmvt-xPDmuCldE1GOnEeMyGOKDdb98ltzpyQjJtSrv576CKPbtJyqcmADs2qkoo7VCNiD5fpSGc30PZd0P-u0aJAlSAh133n8IZn4fsq4fLaIJs72e20CgEy8uAvf8jJ4PJ-VTPWLy67dG0KCrocqs2_V3D-XGYMVFxqr7quFpcywsbhyChry6NkiK0t4P9wXBm5QIzhQ.BX92ruuykPDpr60p25GVG1F-vKmkr44PkxO7hOmGCo1rwLpMvLZZRqSFLtdJRK3k2lbHwQ3N8my9WZMR0dQYo0tTzX8xwDvj-BHwbM4B9YYX2k2jZ_vTH37FtMosRVAWwRGK4sKTldB2PiQwv0hsUwAuwsDhmAQuXRm82kH_q70",
        "authType": "CMAUTH",
        "rolesHash": "sxO1mC5KqPWibxW0J9AUsmJ1fUriP01V6BZOJfDhSvQ="
      })
    }, 2000)
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
