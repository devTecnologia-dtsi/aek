import axios from "axios";
import { useEffect, useState } from "react";
import { mostrarAlertaError, mostrarAlertaExito, mostrarAlertaExitoSinTimer, mostrarAlertaFalloSinTimer } from "../helpers/alertasHelper";
import { urlObtenerCondicionesPago, apikey } from "../helpers/serviciosUrl"
export const useAxiosCondicionesPago = () => {


    const obtenerCondicionesPago = async (programa = {}, idEstudiante = '') => {

        const dataContract = {
            ObtenerCondicionesPago: {
                ObtenerCondicionesPago: {
                    FechaAdmision: programa.FechaAdmision,//"201660",
                    EstudianteId: idEstudiante,//"000065646",
                    Jornada: programa.Jornada,//"N",
                    CodeNivelAcademico: programa.CodeNivelAcademico,//"UG",
                    SedeId: programa.SedeID,//"UMD",
                    ProgramaAcademicoId: programa.ProgramaAcademicoID,//"ISUM"
                }
            }
        };


        const url = urlObtenerCondicionesPago;//'https://uniminuto.test.digibee.io/pipeline/uniminuto/v1/consultas-financieras/ObtenerCondicionesPago';
        const headers = {
            'apikey': apikey, //'uxpWFePgheXvuP9Tun8TYxvjb0FgeSLH',
            'Content-Type': 'application/json',
            'SOAPAction': 'ObtenerCondicionesPago'
        };

        try {
            const { data } = await axios.post(url, dataContract, { headers });
            if (data.Envelope.Body.ObtenerCondicionesPagoResponse.ObtenerCondicionesPagoResponse.CondicionesFacturacion === "") {
                

                const fechaActual = new Date();
                const dia = fechaActual.getDate();
                const mes = fechaActual.getMonth() + 1; // Los meses empiezan desde 0
                const year = fechaActual.getFullYear();
                const fechaCompleta = `${dia}/${mes}/${year}`; // Formato: DD/MM/YYYY

                const codigo = data.Envelope.Body.ObtenerCondicionesPagoResponse.ObtenerCondicionesPagoResponse.ResultadoTransaccion.Codigo;
                const mensaje = data.Envelope.Body.ObtenerCondicionesPagoResponse.ObtenerCondicionesPagoResponse.ResultadoTransaccion.Mensaje;
                if (codigo === "Z8008") {
                    mostrarAlertaExitoSinTimer(`${fechaCompleta} Matriculas - El recibo de pago ya fue registrado como pagado`);
                }else{
                    mostrarAlertaFalloSinTimer(`(${fechaCompleta}) Código de error: ${codigo}  Descripción de error:${mensaje}`)
                }
                return;
            }

            const { CondicionFacturacion } = data.Envelope.Body.ObtenerCondicionesPagoResponse.ObtenerCondicionesPagoResponse.CondicionesFacturacion;
            //console.log(CondicionFacturacion,data);
            return CondicionFacturacion;

        } catch (error) {
            mostrarAlertaError("Error consultando Condiciones de pago");
        }
    }

    return {
        // ...infoCondicionesPago,
        // infoCondicionesPago,
        obtenerCondicionesPago
    }
}
