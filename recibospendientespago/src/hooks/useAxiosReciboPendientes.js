import { useEffect, useState } from "react"
import { request } from "@ombiel/aek-lib";
import { mostrarAlertaError, mostrarAlertaExito } from "../helpers/alertasHelper";
import axios from "axios";
import { urlObtenerRecibosPendientes, urlRutaBaseRecibosPendientes, apikey, apikey2, urlGenearIdPSE } from "../helpers/serviciosUrl";

const rutaBasePdf = urlRutaBaseRecibosPendientes;//'https://www.uniminuto.edu/pecuniariosqa';
export const useAxiosReciboPendientes = (userData) => {

    const [recibos, setRecibos] = useState([])
    const [idUser, setidUser] = useState('');
    const [cargando, setCargando] = useState(true);


    const rellenarCeros = (numero) => {
        //console.log({idCeros:numero.padStart(10, '0')});
        return numero.padStart(10, '0');
    }


    useEffect(() => {

        request.action("get-user").end((err, response) => {
            //console.log(response.body);
            const { idUniminuto } = response.body.extraAttrs;

            if(idUniminuto.length===10){
                setidUser(idUniminuto);
            }else{
                //relleno con ceroz a la izquierda hasta que sean 10 digitos
                //setidUser(completarCerosIzquierda(idUniminuto,10))
                setidUser(rellenarCeros(idUniminuto));
            }

            //setidUser("000065646");
            if (err) {
                console.log(err);
            }
        })

        //setidUser("0000746978");
    }, []);

    useEffect(() => {
        if (idUser != '' && userData.EmailInstitucional != "") {
            iniciarConsultaRecibos();
        }
    }, [idUser, userData]);

    const iniciarConsultaRecibos = async () => {
        await consultarRecibosPendientes();
    }

    /*const consultarRecibosPendientes = async () => {

        const dataContract = {
            ObtenerRecibosPendientes: {
                idEstudiante: idUser
            }
        }

        //console.log(dataContract);

        const url = urlObtenerRecibosPendientes;//'https://uniminuto.test.digibee.io/pipeline/uniminuto/v1/servicios-banner/obtenerRecibosPendientes';
        const headers = {
            'apikey': apikey,//'5H9CcvkLZJTgPDDCXTXTI7KC90k6prl0',
            'Content-Type': 'application/json',
        };
        try {

            const { data } = await axios.post(url, dataContract, { headers });
            console.log({ data });
            const { T_PAGOS } = data.body;
            const { codigo } = data.resultado
            console.log(T_PAGOS.length);

            if (codigo === '200' && T_PAGOS.length === 0) {
                mostrarAlertaExito('No tienes recibos pendientes');
                setCargando(false)
                return [];
            }

            T_PAGOS.map(async (pago) => {

                //recorro los recibos extraigo el nombre del pdf y armo la ruta 
                const partes = pago.RUTA.split("/");
                const ultimaParte = `${rutaBasePdf}/${partes[partes.length - 1]}`;
                const nombrePdf = `${partes[partes.length - 1]}`;
                const valor = pago.VALOR1.trim().replace(/\./g, '').split(',')[0];;// elimino los puntos del importe
                const idPSE = await obtenerIdPSE(valor,pago.FACTURA,userData);
                console.log("@@@@",{idPSE});
                
                setRecibos((prev) => [...prev, { RUTA: ultimaParte, FACTURA: pago.FACTURA, NOMBREPDF: nombrePdf, VALOR1:valor }]);
            });

            setCargando(false);
            return recibos;

        } catch (error) {
            console.log({ error });
            mostrarAlertaError("Ocurrio un fallo al obtener los recibos");
            setCargando(false);
        }

    }*/

    const consultarRecibosPendientes = async () => {
        const dataContract = {
            ObtenerRecibosPendientes: {
                idEstudiante: idUser
            }
        };

        const url = urlObtenerRecibosPendientes;//'https://uniminuto.test.digibee.io/pipeline/uniminuto/v1/servicios-banner/obtenerRecibosPendientes';
        const headers = {
            'apikey': apikey,//'5H9CcvkLZJTgPDDCXTXTI7KC90k6prl0',
            'Content-Type': 'application/json',
        };

        try {
            const { data } = await axios.post(url, dataContract, { headers });
            console.log({ data });
            const { T_PAGOS } = data.body;
            const { codigo } = data.resultado;
            console.log(T_PAGOS.length);

            if (codigo === '200' && T_PAGOS.length === 0) {
                mostrarAlertaExito('No tienes recibos pendientes');
                setCargando(false);
                return [];
            }

            const recibosPromises = T_PAGOS.map(async (pago) => {
                const partes = pago.RUTA.split("/");
                const ultimaParte = `${rutaBasePdf}/${partes[partes.length - 1]}`;
                const nombrePdf = `${partes[partes.length - 1]}`;
                const valor = pago.VALOR1.trim().replace(/\./g, '').split(',')[0];
                const idPSE = await obtenerIdPSE(valor, pago.FACTURA, userData);//llamo a la funcion de obtener idPSE
                return { RUTA: ultimaParte, FACTURA: pago.FACTURA, NOMBREPDF: nombrePdf, VALOR1: valor, IDPSE: idPSE };
            });

            const recibos = await Promise.all(recibosPromises);
            setRecibos(recibos);

            setCargando(false);
            return recibos;

        } catch (error) {
            console.log({ error });
            mostrarAlertaError("Ocurrio un fallo al obtener los recibos");
            setCargando(false);
        }
    };


    const obtenerIdPSE = async (IdImporte, PeriodoId, datosEstudiante) => {

        const dataContract = {
            Estudiante: {
                valorTotal: IdImporte.replace(/\./g, ''),// elimino los puntos del importe"4094290",
                valorIva: "0",
                recibo_pago: PeriodoId,//"0057128637",
                descripcion_pago: "Pago de matrícula Uniminuto",
                email: datosEstudiante.EmailInstitucional,//"dpinzono@uniminuto.edu.co",
                idEstudiante: datosEstudiante.UidEstudiante,//"000065646",
                nombres: datosEstudiante.Nombre, //"DIANA PILAR",
                apellidos: datosEstudiante.Apellido,//"PINZON ORJUELA",
                telefono: datosEstudiante.TelefonoMovil//"3154372348"
            }
        }

        const url = urlGenearIdPSE;//'https://uniminuto.test.digibee.io/pipeline/uniminuto/v1/pasarelas-pago/linkPagoZonaPagos';
        const headers = {
            'apikey': apikey2,//'uxpWFePgheXvuP9Tun8TYxvjb0FgeSLH',
            'Content-Type': 'application/json',
            'SOAPAction': 'ZonaPagosPSE'
        };
        try {

            const { data } = await axios.post(url, dataContract, { headers });
            const { inicio_pagoV2Result } = data.inicio_pagoV2Response;
            //  console.log("PSE", { inicio_pagoV2Result });
            // return {
            //    idPse:inicio_pagoV2Result
            // }
            return inicio_pagoV2Result;

        } catch (error) {
            console.log({ error });
            mostrarAlertaError("Ocurrio un fallo al generar el id de PSE");
            return "";
        }
    }

    return {
        idUser,
        recibos,
        cargando,
        consultarRecibosPendientes,
        obtenerIdPSE
    }
}
