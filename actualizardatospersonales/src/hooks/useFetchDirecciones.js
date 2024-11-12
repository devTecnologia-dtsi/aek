import axios from "axios";
import { useEffect, useState } from "react";
import { mostrarAlertaError } from "../helpers/alertasHelper";
import {urlObtenerMunicipios,urlObtenerDepartamentos,urlObtenerPaises,apikey} from "../helpers/serviciosUrl";
export const useFetchDirecciones = (userData={}) => {

    
    //Estados
    const [listaPaises, setListaPaises] = useState([]);
    const [listaDepartamentos, setListaDepartamentos] = useState([]);
    const [listaMunicipios, setListaMunicipios] = useState([]);
  
    //llamados de funciones
    const iniciarListaPaises = async (idPais = 57) => {
      const paises = await obtenerPaises(idPais);
      setListaPaises(paises);
    }
  
    const iniciarListaDepartamentos = async (idPais = 57) => {
  
      const departamentos = await obtenerDepartamentos(idPais);
      setListaDepartamentos(departamentos);
  
  
    }
  
    const iniciarListaMunicipios = async (idDepartamento = 41) => {
      const municipios = await obtenerMunicipios(idDepartamento);
      setListaMunicipios(municipios);
    }
  
    useEffect(() => {
      if (userData.IdPais != "") {
  
        iniciarListaPaises(userData.IdPais);
        iniciarListaDepartamentos(userData.IdPais);
  
      }
    }, [userData.IdPais])
  
    useEffect(() => {
      if (userData.IdDepartamento != "") {
  
        iniciarListaMunicipios(userData.IdDepartamento)
      }
    }, [userData.IdDepartamento])

    const obtenerPaises = async (idPais = "57") => {

        const dataContract = {
            ObtenerPaises: {
                ObtenerPaises: idPais
            }
        };

        const url = urlObtenerPaises;//'https://uniminuto.test.digibee.io/pipeline/uniminuto/v1/ubicacion-geografica/ObtenerPaises';
        const headers = {
            'apikey': apikey,//'uxpWFePgheXvuP9Tun8TYxvjb0FgeSLH',
            'Content-Type': 'application/json',
            'SOAPAction': 'ObtenerPaises'
        };

        try {
            const { data } = await axios.post(url, dataContract, { headers });
            const { Descripcion, Id } = data.Envelope.Body.ObtenerPaisesResponse.ObtenerPaisesResponse.Paises.Pais;
            return [{ Descripcion, Id }];

        } catch (error) {

            mostrarAlertaError('Ocurrio un fallo al listar los paises');
        }
    }

    const obtenerDepartamentos = async (idPais = "57") => {

        const dataContract = {
            ObtenerDepartamentos: {
                ObtenerDepartamentos: {
                    Pais: {
                        Id: idPais,
                        Descripcion: "Colombia"
                    }
                }
            }
        };

        const url = urlObtenerDepartamentos;//'https://uniminuto.test.digibee.io/pipeline/uniminuto/v1/ubicacion-geografica/ObtenerDepartamentos';
        const headers = {
            'apikey': apikey,//'uxpWFePgheXvuP9Tun8TYxvjb0FgeSLH',
            'Content-Type': 'application/json',
            'SOAPAction': 'ObtenerDepartamentos'
        };

        try {
            const { data } = await axios.post(url, dataContract, { headers });
            const { Departamento } = data.Envelope.Body.ObtenerDepartamentosResponse.ObtenerDepartamentosResponse.Departamentos;
            return Departamento;
        } catch (error) {

            mostrarAlertaError('Ocurrio un fallo al listar los departamentos');
        }



    }

    const obtenerMunicipios = async (idDepartamento) => {

        const dataContract = {
            ObtenerMunicipios: {
                ObtenerMunicipios: {
                    IdDepartamento: idDepartamento
                }
            }
        };

        const url = urlObtenerMunicipios;//'https://uniminuto.test.digibee.io/pipeline/uniminuto/v1/ubicacion-geografica/ObtenerMunicipios';
        const headers = {
            'apikey': apikey,//'uxpWFePgheXvuP9Tun8TYxvjb0FgeSLH',
            'Content-Type': 'application/json',
            'SOAPAction': 'ObtenerMunicipios'
        }

        try {

            const { data } = await axios.post(url, dataContract, { headers });
            const {Municipio} = data.Envelope.Body.ObtenerMunicipiosResponse.ObtenerMunicipiosResponse.Municipios;
            
            if(Array.isArray(Municipio)){
                return Municipio;
            }; 

            return [Municipio];
        } catch (error) {

            mostrarAlertaError('Ocurrio un fallo al listar los Municipios');
        }



    }

    return {
        listaPaises,
        listaDepartamentos,
        listaMunicipios,

        obtenerPaises,
        obtenerDepartamentos,
        obtenerMunicipios

    }
}
