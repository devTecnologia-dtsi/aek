import { useEffect, useState } from "react";
import axios from "axios";
import { mostrarAlertaError } from "../helpers/alertasHelper";
import {  request  } from "@ombiel/aek-lib";
import {urlGetUserDetails,apikey} from "../helpers/serviciosUrl";
export const useFetchDatosPersonales = () => {

    const [idUser, setidUser] = useState('');
    
    const [userData, setUserData] = useState({
        Email: '',
        TelefonoMovil: '',
        BarrioResidencia: '',
        Direccion: '',
        TipoDireccion: '',
        IdPais: '',
        IdDepartamento: '',
        IdMunicipio: ''
    });

    useEffect(() => {

        request.action("get-user").end((err, response) => {
          //console.log(response.body);
          const {idUniminuto} = response.body.extraAttrs;
          setidUser(idUniminuto);
          //console.log("@@@ID",{idUniminuto},{idUser})
          console.log(err);
        })
          
         //setidUser("000703729");
      }, []);

    useEffect(() => {
        if(idUser!=''){
            iniciarConsultaDatos();
        }
    }, [idUser]);

    const handleChange = (event) => {
        const { name, value } = event.target;

        //Agrego esta validacion para que cuando se cambie el valor de IdDepartamento se le setee un valor 000 al IdMunicipio y lo obligue a alegir un Municipio
        if (name === 'IdDepartamento') {
            userData.IdMunicipio = '0000';
        }

        setUserData({ ...userData, [name]: value });
    };

    const iniciarConsultaDatos = async () => {
        const data = await consultarDatos();
        setUserData({ ...data });
    }

    const consultarDatos = async () => {
        //const url = 'https://uniminuto.test.digibee.io/pipeline/uniminuto/v1/servicios-banner/getUserDetails?user=000746978';
        const url = `${urlGetUserDetails}?user=${idUser}`;//`https://uniminuto.test.digibee.io/pipeline/uniminuto/v1/servicios-banner/getUserDetails?user=${idUser}`;
        const headers = {
            'apikey': apikey//'5H9CcvkLZJTgPDDCXTXTI7KC90k6prl0'
        };

        try {
            const { data } = await axios.get(url, { headers });
            return data;
        } catch (error) {

            mostrarAlertaError('Ocurrio un fallo al consultar los datos  académicos');
        }

    }

    const hayCamposVaciosUserData = (userData) => {
        // Verifica si algun campo esta vacio
        const requiredFields = ['Email', 'TelefonoMovil', 'BarrioResidencia', 'Direccion', 'TipoDireccion', 'IdPais', 'IdDepartamento', 'IdMunicipio'];
        for (const field of requiredFields) {
            if (!userData[field]) {
                return true; // Validation fails if any field is empty
            }
        }
        return false;
    };

    return {
        ...userData,
        userData,
        idUser,
        setUserData,
        handleChange,
        hayCamposVaciosUserData
    }


}
