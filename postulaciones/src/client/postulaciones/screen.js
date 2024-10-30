import React, { useEffect, useState } from "react";
import { request } from "@ombiel/aek-lib";
import { fetchData } from "../service/service";


export default Screen = () => {
  const [tokenUser, setTokenUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  const SHRDGMR_LEVL_CODE = [
    { key: 'TP', value: 'Técnico Profesional' },
    { key: 'BA', value: 'Bachillerato' },
    { key: '00', value: 'No Disponible' },
    { key: 'TC', value: 'Tecnología' },
    { key: 'UG', value: 'Pregrado' },
    { key: 'GR', value: 'Posgrado' },
    { key: 'CE', value: 'Educación Continua' },
    { key: 'EB', value: 'Estudios Básicos Preuniversita' },
    { key: 'LI', value: 'Licenciatura' },
    { key: 'PG', value: 'Posgrado' },
    { key: 'DP', value: 'Diplomado' },
    { key: 'ES', value: 'Especialización' },
    { key: 'CL', value: 'Curso Libre' },
    { key: 'TL', value: 'Técnico Laboral' },
    { key: 'MS', value: 'Maestria' },
    { key: 'CO', value: 'CONGRESO' },
    { key: 'CU', value: 'Curso' },
    { key: 'OT', value: 'Otros' },
    { key: 'SE', value: 'Seminarios' },
    { key: 'SI', value: 'Simposios' },
    { key: 'TE', value: 'Técnico' },
    { key: 'TA', value: 'Talleres' },
    { key: 'DO', value: 'Doctorado' },
    { key: 'PD', value: 'Posdoctorado' },
    { key: 'UN', value: 'Universitario' },
    { key: 'PS', value: 'Especialización' },
    { key: 'PR', value: 'Universitario' },
    { key: 'DR', value: 'Doctorado' },
    { key: 'TR', value: 'Tranversales' },
    { key: 'OG', value: 'Diplomados Opción de Grado' },
    { key: 'UP', value: 'Unipack' },
    { key: 'FA', value: 'Formación académica' }
  ]

  const SHRDGMR_DEGS_CODE = [
    { key: 'SO', value: 'Grado Buscado' },
    { key: 'TM', value: 'Egresado (Termino Materias)' },
    { key: 'GR', value: 'Graduado' },
    { key: 'LC', value: 'Listo para ceremonia' },
    { key: 'GE', value: 'Graduado EDUCON' },
    { key: 'EG', value: 'Egresado no Graduado' },
    { key: 'CG', value: 'Postulado a Grado o certificado' },
    { key: 'FD', value: 'Facturar Derechos de Grado' },
    { key: 'FP', value: 'Facturar Derechos Grado Priva' },
    { key: 'PA', value: 'Pendiente Actualizacion' }
  ]

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
        'apikey': 'ITnjVcrLWfYpY2B246EcrWO6Hln3LD7a',
        'Content-Type': 'application/json'
      };
      fetch(
        `https://uniminuto.api.digibee.io/pipeline/uniminuto/v2/gestor-grados/obtenerPostulacion?id=${tokenUser.extraAttrs.idUniminuto}`,
        { headers }
      ).then((data) => data.json())
        .then(({ respuesta }) => {
          if (typeof respuesta == 'object') {
            setUserData(respuesta)
          } else {
            setUserData(null)
          }
          setLoading(false)
        })
    } catch (error) {
      setLoading(false);
      console.log(`error ${error}`)
    }
  }

  const getValueCodeLevel = (value) => {
    const filter = SHRDGMR_LEVL_CODE.filter(({ key }) => key == value)
    return filter.length > 0 ? filter[0].value : value
  }

  const getValueDegsCode = (value) => {
    const filter = SHRDGMR_DEGS_CODE.filter(({ key }) => key == value)
    return filter.length > 0 ? filter[0].value : value
  }

  return (
    <>
      {
        loading ? (
          <div className="pistion-relative">
            <div className="position-absolute top-50 start-50 translate-middle">
              <div className="card shadow-lg bg-body rounded">
                <div className="card-body">
                  <div className="d-flex align-items-center">
                    <strong>Cargando tu información... </strong>
                    <div className="spinner-border ms-auto" role="status" aria-hidden="true"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : userData == null ?
          (
            <div className="container">
              <div className="card mb-3" style={{ borderRadius: '.5rem', borderTop: '4px solid #4AB9AE' }}>
                <div className="row g-0">
                  <div className="col-md-8">
                    <div className="card-body p-4">
                      <h6><b>CREAR POSTULACIÓN</b></h6>
                      <hr className="mt-0 mb-4" />
                      <div className="row pt- text-center text-uppercase">
                        <div className="col-12 mb-3">
                          <a href="https://genesisplus.uniminuto.edu/StudentSelfService/ssb/studentCommonDashboard"><h6><b>Ingrese aqui</b></h6></a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="pistion-relative">
                <div className="position-absolute top-50 start-50 translate-middle">
                  <div className="card shadow-lg bg-body rounded" style={{ borderRadius: '.5rem', borderTop: '4px solid #4AB9AE' }}>
                    <div className="card-body">
                      <h6><b>ESTADO DE POSTULACIÓN</b></h6>
                      <hr className="mt-0 mb-4" />
                      <div className="d-flex align-items-center">
                        <strong>¡Ups! No tenemos información</strong>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )
          :
          (
            <section className="vh-100" style={{ backgroundColor: '#f4f5f7' }}>
              <div className="container h-100">
                <div className="row h-100">
                  <div className="col col-lg-12 mb-4 mb-lg-0">
                    <div className="card mb-3" style={{ borderRadius: '.5rem', borderTop: '4px solid #4AB9AE' }}>
                      <div className="row g-0">
                        <div className="col-md-8">
                          <div className="card-body p-4">
                            <h6><b>CREAR POSTULACIÓN</b></h6>
                            <hr className="mt-0 mb-4" />
                            <div className="row pt- text-center text-uppercase">
                              <div className="col-12 mb-3">
                                <a href="https://genesisplus.uniminuto.edu/StudentSelfService/ssb/studentCommonDashboard"><h6><b>Ingrese aqui</b></h6></a>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="card mb-3" style={{ borderRadius: '.5rem', borderTop: '4px solid #4AB9AE' }}>
                      <div className="row g-0">
                        <div className="col-md-8">
                          <div className="card-body p-4">
                            <h6><b>ESTADO DE POSTULACIÓN</b></h6>
                            <hr className="mt-0 mb-4" />
                            <div className="row pt- text-center text-uppercase">
                              <div className="col-6 mb-3">
                                <h6><b>ID PROGRAMA</b></h6>
                                <p className="text-muted">{userData.SHRDGMR_MAJR_CODE_1}</p>
                              </div>
                              <div className="col-6 mb-3">
                                <h6><b>NOMBRE PROGRAMA</b></h6>
                                <p className="text-muted">{userData.STVMAJR_DESC}</p>
                              </div>
                              <div className="col-6 mb-3">
                                <h6><b>NIVEL ESTUDIANTE</b></h6>
                                <p className="text-muted">{getValueCodeLevel(userData.SHRDGMR_LEVL_CODE)}</p>
                              </div>
                              <div className="col-6 mb-3">
                                <h6><b>TIPO DE ESTADO GRADO</b></h6>
                                <p className="text-muted">{getValueDegsCode(userData.SHRDGMR_DEGS_CODE)}</p>
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
