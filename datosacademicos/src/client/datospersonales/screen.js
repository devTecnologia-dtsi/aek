import React, { useEffect, useState } from "react";
import { postData } from "../services/service";
import { request } from "@ombiel/aek-lib";


export default Screen = () => {
  const [tokenUser, setTokenUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    // make a request cmAuth
    request.action("get-user").end((err, response) => {
      setTokenUser(response.body)
    });
  }, [])

  useEffect(() => {
    if (tokenUser) {
      getUserData()
    }
  }, [tokenUser])


  const getUserData = async () => {
    try {
      setLoading(true);
      const headers = {
        headers: {
          'apikey': '5H9CcvkLZJTgPDDCXTXTI7KC90k6prl0'
        }
      }
      const body = { "correo": tokenUser.mail }
      const result = await postData({
        url: 'https://uniminuto.test.digibee.io/pipeline/uniminuto/v1/servicios-banner/datosPersonales',
        body,
        headers
      })

      if (result.hasOwnProperty('success') && !result.success) {
        throw ('Hubo un error');
      }

      setUserData({
        sede: result.body.sede,
        facultad: result.body.facultad,
        programa: result.body.programa,
        rectoria: result.body.rectoria,
        modalidad: result.body.modalidad,
        nivel: result.body.nivel
      })
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log(`error ${error}`)
    }
  }

  return (
    <>
      {
        loading ? (
          <div className="pistion-relative">
            <div className="position-absolute top-50 start-50 translate-middle">
              <div className="card">
                <div className="card-body">
                  <div className="d-flex align-items-center">
                    <strong>Cargando tu información...</strong>
                    <div className="spinner-border ms-auto" role="status" aria-hidden="true"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <section className="vh-100" style={{ backgroundColor: '#f4f5f7' }}>
            <div className="container h-100">
              <div className="row h-100">
                <div className="col col-lg-6 mb-4 mb-lg-0">
                  <div className="card mb-3" style={{ borderRadius: '.5rem' }}>
                    <div className="row g-0">
                      <div className="col-md-4 gradient-custom text-center text-white pt-3 text-uppercase"
                        style={{
                          borderTopLeftRadius: '.5rem',
                          borderBottomLeftRadius: '.5rem',
                          background: '#4AB9AE'
                        }}>
                        <h5>{tokenUser.firstName} {tokenUser.lastName} </h5>
                        <p>{userData.programa}</p>
                        <i className="far fa-edit mb-5"></i>
                      </div>
                      <div className="col-md-8">
                        <div className="card-body p-4">
                          <h6><b>Información Academica</b></h6>
                          <hr className="mt-0 mb-4" />
                          <div className="row pt- text-center text-uppercase">
                            <div className="col-6 mb-3">
                              <h6><b>Rectoria</b></h6>
                              <p className="text-muted">{userData.rectoria}</p>
                            </div>
                            <div className="col-6 mb-3">
                              <h6><b>Sede</b></h6>
                              <p className="text-muted">{userData.sede}</p>
                            </div>
                            <div className="col-6 mb-3">
                              <h6><b>Modalidad</b></h6>
                              <p className="text-muted">{userData.modalidad}</p>
                            </div>
                            <div className="col-6 mb-3">
                              <h6><b>Nivel</b></h6>
                              <p className="text-muted">{userData.nivel}</p>
                            </div>
                            <div className="col-12 text-center mb-3">
                              <h6><b>Facultad</b></h6>
                              <p className="text-muted">{userData.facultad}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )
      }
    </>
  );

}
