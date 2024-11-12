import axios from "axios";
import { useEffect, useState } from "react";
import { mostrarAlertaError } from "../helpers/alertasHelper";
import {urlObtenerProgramasInscritos,apikey}  from "../helpers/serviciosUrl";

export const useAxiosProgramasInscritos = (idUser='') => {


    const [infoPrograma, setInfoPrograma] = useState([{
        FechaAdmision: "",
        Jornada: "",
        CodeNivelAcademico: "",
        SedeID: "",
        ProgramaAcademicoID: ""
    }]);

    useEffect(() => {
        if(idUser!=''){
            iniciarConsultaProgramasInscritos(idUser);
        }
    }, [idUser])

    const handleChange = (event) => {
        const { name, value } = event.target;
        setInfoPrograma({ ...infoPrograma, [name]: value });
    };

    const iniciarConsultaProgramasInscritos = async (idUsuario /*= '000065646'*/) => {
        const data = await obtenerProgramasInscritos(idUsuario);
        setInfoPrograma([...data]);
    }

    const obtenerProgramasInscritos = async (idUsuario /*= '000065646'*/) => {

        const dataContract = {
            ObtenerProgramasInscritos: {
                ObtenerProgramasInscritos: {
                    uid_usuario: idUsuario
                }
            }
        };

        const url = urlObtenerProgramasInscritos;//'https://uniminuto.test.digibee.io/pipeline/uniminuto/v1/estudiante/ObtenerProgramasInscritos';
        const headers = {
            'apikey': apikey,//'uxpWFePgheXvuP9Tun8TYxvjb0FgeSLH',
            'Content-Type': 'application/json',
            'SOAPAction': 'ObtenerProgramasInscritos'
        };

        try {

            const { data } = await axios.post(url, dataContract, { headers });
            //console.log("PROGRAMAS INSCRITOS",{ProgInscritos:data});
            const { Programa } = data.Envelope.Body.ObtenerProgramasInscritosResponse.ObtenerProgramasInscritosResponse.Programas;

            if (Array.isArray(Programa)) {
                let arrayProgramas = [];
                for (const prog of Programa){
                    const dataInfoPrograma = {
                        FechaAdmision: prog.Periodo.Admitido,
                        Jornada: prog.Jornada.Id,
                        CodeNivelAcademico: prog.Nivel.Id,
                        SedeID: prog.Sede.Id,
                        ProgramaAcademicoID: prog.Id,
                        Descripcion : prog.Descripcion
                    }

                    arrayProgramas.push(dataInfoPrograma)
                }
                console.log({arrayProgramas});
                
                return arrayProgramas;
            };

            const dataInfoPrograma = {
                FechaAdmision: Programa.Periodo.Admitido,
                Jornada: Programa.Jornada.Id,
                CodeNivelAcademico: Programa.Nivel.Id,
                SedeID: Programa.Sede.Id,
                ProgramaAcademicoID: Programa.Id,
                Descripcion : Programa.Descripcion
            }
            //console.log({dataInfoPrograma},{Programa});
            return [dataInfoPrograma]

        } catch (error) {
            mostrarAlertaError("Error Obteniendo el programa");
        }

    }



    return {
        ...infoPrograma,
        infoPrograma,
        setInfoPrograma,
        obtenerProgramasInscritos
    }


}
