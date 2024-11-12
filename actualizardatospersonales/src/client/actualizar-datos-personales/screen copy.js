import React, { useEffect, useState } from "react";
import {
  Container,
  VBox,
  BannerHeader,
  BasicSegment,
} from "@ombiel/aek-lib";
import { useFetchDatosPersonales } from "../../hooks/useFetchDatosPersonales";
import { useFetchActulizarDatosPersonales } from "../../hooks/useFetchActulizarDatosPersonales";
import { useFetchDirecciones } from "../../hooks/useFetchDirecciones";
import { mostrarAlertaError } from "../../helpers/alertasHelper";

//LISTA ESTATICA DE DIRECCIONES
const listaTipoDireccion = [{ id: 1, tipo: "RE" }, { id: 2, tipo: "RU" }];

export default screen = () => {

  const { userData, setUserData, handleChange, hayCamposVaciosUserData } = useFetchDatosPersonales();
  const { actualizarDatosPersonales } = useFetchActulizarDatosPersonales();

  const { listaPaises, listaDepartamentos, listaMunicipios } = useFetchDirecciones(userData);

  const [username, setUsername] = useState(null);


  const handleSubmit = async (e) => {
    e.preventDefault();

    //valido si hay campos vacios en el state del userData
    if (hayCamposVaciosUserData(userData)) {
      mostrarAlertaError('Todos Los campos son requeridos');
      return;
    }

    //valido que haya seleccionado un tipo de direccion valido
    if (userData.TipoDireccion === '0000') {
      mostrarAlertaError('Por favor Seleccione un tipo de direccion');
      return;
    };

    //valido que haya seleccionado un Municipio valido
    if (userData.IdMunicipio === '0000') {
      mostrarAlertaError('Por favor Seleccione el Municipio');
      return;
    };

    //mando a actualizar los datos personales
    await actualizarDatosPersonales(userData);
  }

  function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
  }

  useEffect(() => {
    const nombreCookie = "cmAuthToken";
    const valorCookie = 'eyJhbGciOiJSUzI1NiJ9.eyJqdGkiOiJvaXk5V25sTHNHenV0T2FrZjEtem53IiwiaWF0IjoxNzE1NzkxNTQyLCJpc3MiOiJFeExpYnJpcyIsInN1YiI6IkNhbXB1c01Vc2VyIiwiZXhwIjoxNzE4MzgzNTQyLCJ1c2VybmFtZSI6Im1pY2hlbGwucm9qYXNAdW5pbWludXRvLmVkdS5jbyIsIm1haWwiOiJtaWNoZWxsLnJvamFzQHVuaW1pbnV0by5lZHUuY28iLCJmaXJzdE5hbWUiOiJNaWNoZWxsIERheWFubiIsImxhc3ROYW1lIjoiUm9qYXMgVG9iYXIiLCJjbVBlcnNvbklkIjoxMDAxOTExNjczLCJjbU9yZ0NvZGUiOjEwMDAwMDE1NDIsImNtUHJvZmlsZUdyb3VwSWQiOjEwMDAwMDQ3NTEsImNtSW50ZWdyYXRpb25Qcm9maWxlSWQiOjQ1NDEsImV4dHJhQXR0cnMiOnsiaWRVbmltaW51dG8iOiIwMDA3NDY5NzgifSwiY21hdXRoVHlwZSI6IlNBTUwiLCJlbmMiOiJGYk5scTJkSjAxVWRWMTltb1VOdHBPS1FwQzVnN3BrNFNYMl9uUEZoZG9UMHdKMVJZX2xvVjNKYkhvblB0Z2VBRzNCT2hvSkJra3Vlc29UY1lHZ3pkUDlub2s0ZDRJUkVKRlBrTlVfUXo0Wnh4akpUOVU3Q2IwV3o2d1pTMm16anJwWWIzc280NlFqRG5nbXZ0LXhQRG11Q2xkRTFHT25FZU15R09LRGRiOThsdHpweVFqSnRTcnY1NzZDS1BidEp5cWNtQURzMnFrb283VkNOaUQ1ZnBTR2MzMFBaZDBQLXUwYUpBbFNBaDEzM244SVpuNGZzcTRmTGFJSnM3MmUyMENnRXk4dUF2ZjhqSjRQSi1WVFBXTHk2N2RHMEtDcm9jcXMyX1YzRC1YR1lNVkZ4cXI3cXVGcGN5d3NiaHlDaHJ5Nk5raUswdDRQOXdYQm01UUl6aFEuQlg5MnJ1dXlrUERwcjYwcDI1R1ZHMUYtdktta3I0NFBreE83aE9tR0NvMXJ3THBNdkxaWlJxU0ZMdGRKUkszazJsYkh3UTNOOG15OVdaTVIwZFFZbzB0VHpYOHh3RHZqLUJId2JNNEI5WVlYMmsyalpfdlRIMzdGdE1vc1JWQVd3UkdLNHNLVGxkQjJQaVF3djBoc1V3QXV3c0RobUFRdVhSbTgya0hfcTcwIiwiYXV0aFR5cGUiOiJDTUFVVEgiLCJyb2xlc0hhc2giOiJzeE8xbUM1S3FQV2lieFcwSjlBVXNtSjFmVXJpUDAxVjZCWk9KZkRoU3ZRPSJ9.V5KCG1LBMkwzOPc1ql4--eN1-xDU_XA3vENpksD82nHEwvL4x2buama4xl01Abvn7agfV8qXKAkwLj0EDXXJjI1KL2KWoAlGejp7G4mPfcCoYY_58dCYtcbv6e4lg6dIB4ro7Y1kIeZWr726zgU-dxIspMptJlN_mJgfU5EMX74x0HMKLKkqDxWJ61IGhaymIWT-RgSqc8csTQnt13r49UjLPLtacqd7Bdwo210FmaOzRsSOrpOQoikVdCJlY6WbsqrHpoglyE8P9Cc9CwwHorpa9jk43ObNgoYrt9WzWpQT9rexNzaeMsiBY9iNRcdgcIlRMYXqna3Ln2il-_S1Wg';

    const opcionesCookie = {
      expires: 3600, // Duración de la cookie en segundos (1 hora)
      path: "/", // Ruta de la cookie (por defecto, toda la ruta)
      domain: "localhost", // Dominio de la cookie (por defecto, el dominio actual)
      secure: false // Indica si la cookie solo se debe enviar a través de HTTPS
    };

    let cadenaCookie = `${nombreCookie}=${valorCookie}`;

    if (opcionesCookie) {
      for (const clave in opcionesCookie) {
        if (opcionesCookie.hasOwnProperty(clave)) {
          cadenaCookie += `; ${clave}=${opcionesCookie[clave]}`;
        }
      }
    }

    document.cookie = cadenaCookie;

  }, [])

  useEffect(() => {
    const cmAuthToken = getCookie('cmAuthToken');
    console.log('cmAuthToken:', cmAuthToken);
  }, [])

  useEffect(() => {
    if (window.CMAuthUtilities) {
      window.CMAuthUtilities.getTokenAttributes()
        .then(attributes => {
          setUsername(attributes.username);
        })
        .catch(error => {
          console.error('Error al obtener los atributos del token:', error);
        });
    } else {
      console.log('NOOOOO');
    }
  }, []);

  return (
    <>
      {/* <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC" crossOrigin="anonymous" /> */}

      <link href="https://unpkg.com/tailwindcss@^2/dist/tailwind.min.css" rel="stylesheet" />

      <div className="container mx-auto px-4 py-10 bg-gray p-4">

        <form onSubmit={handleSubmit} autoComplete="off" className="flex flex-col space-y-4 bg-white rounded-md shadow-md p-4">
          <h1 className="text-3xl font-bold text-center mb-4">Información de usuario</h1>
          <div className="flex items-center">
            <label htmlFor="Email" className="w-1/3 text-gray-700 font-medium">Email:</label>
            <input
              className="flex-1 px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500"
              type="email"
              id="Email"
              name="Email"
              value={userData.Email}
              onChange={handleChange}
            />
          </div>

          <div className="flex items-center">
            <label htmlFor="TelefonoMovil" className="w-1/3 text-gray-700 font-medium">Celular:</label>
            <input
              className="flex-1 px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500"
              type="text"
              id="TelefonoMovil"
              name="TelefonoMovil"
              value={userData.TelefonoMovil}
              onChange={handleChange}
            />
          </div>

          <div className="flex items-center">
            <label htmlFor="BarrioResidencia" className="w-1/3 text-gray-700 font-medium">Barrio Residencia:</label>
            <input
              className="flex-1 px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500"
              type="text"
              id="BarrioResidencia"
              name="BarrioResidencia"
              value={userData.BarrioResidencia}
              onChange={handleChange}
            />
          </div>

          <div className="flex items-center">
            <label htmlFor="IdPais" className="w-1/3 text-gray-700 font-medium">Pais:</label>
            <select
              className="flex-1 px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500"
              id="IdPais"
              name="IdPais"
              value={userData.IdPais}
              onChange={handleChange}
            >
              {listaPaises.map((pais) => (
                <option key={pais.Id} value={pais.Id}>
                  {pais.Descripcion}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center">
            <label htmlFor="IdDepartamento" className="w-1/3 text-gray-700 font-medium">Departamentos:</label>
            <select
              className="flex-1 px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500"
              id="IdDepartamento"
              name="IdDepartamento"
              value={userData.IdDepartamento}
              onChange={handleChange}
            >
              {(listaDepartamentos.map((dep) => (
                <option key={dep.Id} value={dep.Id}>
                  {dep.Descripcion}
                </option>
              )))}
            </select>
          </div>


          <div className="flex items-center">
            <label htmlFor="IdMunicipio" className="w-1/3 text-gray-700 font-medium">Municipio:</label>
            <select
              className="flex-1 px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500"
              id="IdMunicipio"
              name="IdMunicipio"
              value={userData.IdMunicipio}
              onChange={handleChange}
            >
              <option key={"0000"} value={"0000"} style={{ color: 'red' }}>
                --Selecciona un valor--
              </option>
              {listaMunicipios.map((mun) => (
                <option key={mun.Id} value={mun.Id}>
                  {mun.Descripcion}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center">
            <label htmlFor="Direccion" className="w-1/3 text-gray-700 font-medium">Direccion:</label>
            <input
              className="flex-1 px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500"
              type="text"
              id="Direccion"
              name="Direccion"
              value={userData.Direccion}
              onChange={handleChange}
            />
          </div>

          <div className="flex items-center">
            <label htmlFor="TipoDireccion" className="w-1/3 text-gray-700 font-medium">Tipo Direccion:</label>
            <select
              className="flex-1 px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500"
              id="TipoDireccion"
              name="TipoDireccion"
              value={userData.TipoDireccion}
              onChange={handleChange}
            >
              <option key={"0000"} value={"0000"} style={{ color: 'red' }}>
                --Selecciona un valor--
              </option>
              {listaTipoDireccion.map((dir) => (
                <option key={dir.id} value={dir.tipo}>
                  {dir.tipo}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center py-6">
            <button type="submit" className="w-full py-2 rounded-md bg-blue-500 text-white font-medium hover:bg-blue-700">Guardar cambios</button>
          </div>

        </form>
      </div>

      {/* FORMULARIO CON ESTILOS DE BOOSTRAP */}
      {/* <div className="container mt-5">
        <h1>Información de usuario</h1>
        <form onSubmit={handleSubmit} autoComplete="off">

          <div>
            <label htmlFor="Email" className="form-label">Email:</label>
            <input
              className="form-control"
              type="email"
              id="Email"
              name="Email"
              value={userData.Email}
              onChange={handleChange}
            />
          </div>

          <div>
            <label htmlFor="TelefonoMovil" className="form-label">Celular:</label>
            <input
              className="form-control"
              type="text"
              id="TelefonoMovil"
              name="TelefonoMovil"
              value={userData.TelefonoMovil}
              onChange={handleChange}
            />
          </div>
          <div>
            <label htmlFor="BarrioResidencia" className="form-label" >Barrio Residencia:</label>
            <input
              className="form-control"
              type="text"
              id="BarrioResidencia"
              name="BarrioResidencia"
              value={userData.BarrioResidencia}
              onChange={handleChange}
            />
          </div>

          <div>
            <label htmlFor="Direccion" className="form-label">Direccion:</label>
            <input
              className="form-control"
              type="text"
              id="Direccion"
              name="Direccion"
              value={userData.Direccion}
              onChange={handleChange}
            />
          </div>
          <div>
            <label htmlFor="TipoDireccion" className="form-label">Tipo Direccion:</label>
            <input
              className="form-control"
              type="text"
              id="TipoDireccion"
              name="TipoDireccion"
              value={userData.TipoDireccion}
              onChange={handleChange}
            />
          </div>
          <button type="submit" className="btn btn-primary mt-2">Guardar cambios</button>
        </form>
      </div> */}
    </>

  );

}

