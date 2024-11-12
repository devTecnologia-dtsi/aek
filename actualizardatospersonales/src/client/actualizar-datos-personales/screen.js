import React, { useEffect, useState } from "react";
import {
  Container,
  VBox,
  BannerHeader,
  BasicSegment,
  request
} from "@ombiel/aek-lib";
import { useFetchDatosPersonales } from "../../hooks/useFetchDatosPersonales";
import { useFetchActulizarDatosPersonales } from "../../hooks/useFetchActulizarDatosPersonales";
import { useFetchDirecciones } from "../../hooks/useFetchDirecciones";
import { mostrarAlertaError } from "../../helpers/alertasHelper";
//LISTA ESTATICA DE DIRECCIONES
const listaTipoDireccion = [{ id: 1, tipo: "RE", text:"Residencia Rural" }, { id: 2, tipo: "RU" , text:"Residencia Urbana" }];

//DEFINO LOS ESTILOS
const estiloFuentes = {
  fontFamily: 'Helvetica',
  fontSize:'12px'
};

const estiloBadges = {
  backgroundColor: '#779B00',//'#4AB9AE',
  color: 'white',
  marginRight: '5px',
  padding: '5px 10px',
  borderRadius: '5px',
  display: 'inline-block'
};

const estiloBase = {
  backgroundColor: '#151b60',//'#2C3A49'
}

const estiloHover = {
  backgroundColor: '#4F6175'
}

export default screen = () => {

  //Manejara el estado para ver si se hizo hover sobre un elemento
  const [isHovered, setIsHovered] = useState(false);

  const { userData, setUserData, handleChange, hayCamposVaciosUserData,idUser } = useFetchDatosPersonales();
  const { actualizarDatosPersonales } = useFetchActulizarDatosPersonales();

  const { listaPaises, listaDepartamentos, listaMunicipios } = useFetchDirecciones(userData);
  
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

  return (
    <>
      {/* <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC" crossOrigin="anonymous" /> */}
      <link href="https://unpkg.com/tailwindcss@^2/dist/tailwind.min.css" rel="stylesheet" />

      <div className="container mx-auto px-4 py-10 bg-gray p-4" style={estiloFuentes}>

        <form onSubmit={handleSubmit} autoComplete="off" className="flex flex-col space-y-4 bg-white rounded-md shadow-md p-4">
          <div className="flex items-center">
            <label style={estiloBadges} htmlFor="Email" className="w-1/3 text-gray-700 font-medium">Email:</label>
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
            <label style={estiloBadges} htmlFor="TelefonoMovil" className="w-1/3 text-gray-700 font-medium">Celular:</label>
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
            <label style={estiloBadges} htmlFor="BarrioResidencia" className="w-1/3 text-gray-700 font-medium">Barrio Residencia:</label>
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
            <label style={estiloBadges} htmlFor="IdPais" className="w-1/3 text-gray-700 font-medium">Pais:</label>
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
            <label style={estiloBadges} htmlFor="IdDepartamento" className="w-1/3 text-gray-700 font-medium">Departamentos:</label>
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
            <label  style={estiloBadges} htmlFor="IdMunicipio" className="w-1/3 text-gray-700 font-medium">Municipio:</label>
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
            <label style={estiloBadges} htmlFor="Direccion" className="w-1/3 text-gray-700 font-medium">Direccion:</label>
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
            <label style={estiloBadges} htmlFor="TipoDireccion" className="w-1/3 text-gray-700 font-medium">Tipo Direccion:</label>
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
                  {dir.text}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center py-6">
            <button onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}   style={isHovered ? estiloHover : estiloBase} type="submit" className="w-full py-2 rounded-md bg-blue-500 text-white font-medium hover:bg-blue-700">Guardar cambios</button>
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

