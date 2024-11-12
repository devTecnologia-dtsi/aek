import axios from "axios";
import { mostrarAlertaError, mostrarAlertaExito } from "../helpers/alertasHelper";
import {urlActualizarDatosContacto,apikey} from "../helpers/serviciosUrl";

export const useFetchActulizarDatosPersonales = () => {

  const actualizarDatosPersonales = async (objEstudinate = {}) => {

    const { UidEstudiante, Email, TelefonoMovil, BarrioResidencia, Direccion, TipoDireccion, IdMunicipio, IdPais, IdDepartamento } = objEstudinate;

    //console.log({ UidEstudiante, Email, TelefonoMovil, BarrioResidencia, Direccion, TipoDireccion, IdMunicipio, IdPais, IdDepartamento });



    const dataContract = {
      ActualziarDatosContacto: {
        ActualizarDatosContacto: {
          Estudiante: {
            UidEstudiante: UidEstudiante,
            EmailAlternativo: Email,
            TelefonoMovil: TelefonoMovil,
            //TelefonoResidencia: "9999999",
            BarrioResidencia: BarrioResidencia,
            Direccion: {
              Direccion: Direccion,
              Tipo: TipoDireccion
            },
            Municipio: {
              Id: IdMunicipio,
              Departamento: {
                Id: IdDepartamento,
                Pais: {
                  Id: IdPais
                }
              }
            }
          }
        }
      }
    }

    const headers = {
      'apikey': apikey,//'uxpWFePgheXvuP9Tun8TYxvjb0FgeSLH',
      'Content-Type': 'application/json',
      'SOAPAction': 'ActualziarDatosContacto'
    }
    try {

      const { data } = await axios.post(urlActualizarDatosContacto/*'https://uniminuto.test.digibee.io/pipeline/uniminuto/v1/estudiante/ActualizarDatosContacto'*/, dataContract, { headers });
      mostrarAlertaExito('Se realizo la actualizacion');

    } catch (error) {
      mostrarAlertaError('Ocurrio un fallo al actualizar los datos');
    }


  }

  return {
    actualizarDatosPersonales,
  }
}
