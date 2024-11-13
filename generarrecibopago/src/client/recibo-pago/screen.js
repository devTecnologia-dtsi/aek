import React, { useEffect, useRef, useState } from "react";
import {Container, VBox, BannerHeader, BasicSegment, } from "@ombiel/aek-lib";
import { useAxiosDatosPersonales } from "../../hooks/useAxiosDatosPersonales";
import { useAxiosProgramasInscritos } from "../../hooks/useAxiosProgramasInscritos";
import { useAxiosCondicionesPago } from "../../hooks/useAxiosCondicionesPago";
import { useAxiosReciboPago } from "../../hooks/useAxiosReciboPago";
import { mostrarAlertaConfirmacion, mostrarAlertaError } from "../../helpers/alertasHelper";
import { estiloFuentes, estiloBadges, estiloBadges2, estiloBase, estiloHover } from "../../helpers/estilos"
import { lstEntidadFinanciacion, lstOpcionesDonacion, valorMinimoFinanciar, mensajeConfirmacionGenerarRecibo, CodigosCombinacionPago } from "../../helpers/valoresFijos"
import { SpanErrorComponents } from "../../components/SpanErrorComponents";
import { TooltipComponents } from "../../components/TooltipComponents";
import { urlPagoPSE } from "../../helpers/serviciosUrl";

export default Screen = () => {


    const [isHovered, setIsHovered] = useState(false); //Manejara el estado para ver si se hizo hover sobre un elemento
    const isFirstRender = useRef(true); //Valida si es la primera vez que se renderiza la pagina

    const [btnGenerarIsDisabled, setBtnGenerarIsDisabled] = useState(true); //Manejara el estado para ver si el boton de generar recibo esta habilitado o no
    const [btnGenerarExist, setBtnGenerarExist] = useState(false); //Manejara el estado para ver si el boton de generar recibo esta habilitado o no
    const [infoRecibo, setInfoRecibo] = useState({ IdArchivo: "", urlRecibo: "" }); //Maneja el estado de la informacion del recibo generado
    const [programaSeleccionado, setProgramaSeleccionado] = useState([]);//Maneja el estado del programa seleccionado

    const { userData, idUser } = useAxiosDatosPersonales(); // objeto que almacena la informacion del usuario
    const { infoPrograma } = useAxiosProgramasInscritos(idUser);
    const { obtenerCondicionesPago } = useAxiosCondicionesPago(); //Metodo encargarado de obtener las condiciones de pago
    const [infoCondicionesPago, setInfoCondicionesPago] = useState([]); //Maneja el estado de las condiciones de pago
    const [infoCondicionesPagoPdf, setInfoCondicionesPagoPdf] = useState([]);//Maneja el estado de las condiciones de pago que se enviaran para generar el pdf
    //const [valorMatriculaBase, setValorMatriculaBase] = useState(0);// Maneja el estado de la matricula base extraido de las condiciones de pago
    const [valorCarnet, setValorCarnet] = useState(0); // Maneja el estado del valor del radio button de las opciones de carnet
    const [valorDonaciones, setValorDonaciones] = useState(0);// Maneja el estado del valor del radio button de las opciones de donaciones
    const [valorFinanciado, setValorFinanciado] = useState(''); // Maneja el estado del valor del input numerico de valor a financiar
    const [valorFinanciadoRestarDebounced, setValorFinanciadoRestarDebounced] = useState(''); // Maneja el estado para actualizar despues el valor a financiar  despues de un lapso de tiempo es un debouncer
    const [total, setTotal] = useState(0); // Maneja el estado del total a pagar sumando donacion y carnet
    const [totalSinDonacion, setTotalSinDonacion] = useState(0); // Maneja el estado del total sin sumar la donacion
    const [totalFinanciado, setTotalFinanciado] = useState(0); //Maneja el estadod del total a pagar menos el valor financiado
    const [ultimoCarnet, setUltimoCarnet] = useState(""); // Maneja el estado para validar el ultimo carnet que fue seleccionado
    const [entidadSeleccionada, setEntidadSeleccionada] = useState({}); // Maneja el estado del select de entidades financieras
    const [mostrarFormFinanciacion, setMostrarFormFinanciacion] = useState(false); // Maneja el estado para ver si se debe mostrar o no el fomulario de financiacion
    const { generarReciboPago, obtenerIdPSE } = useAxiosReciboPago(); // Funcion encargada de generar el recibo de pago
    const [mostrarDivCargando, setMostrarDivCargando] = useState(false); //state que indica si se deve mostrar o no el div de cargando
    const [valorOrPorcentaje, setValorOrPorcentaje] = useState("valor"); // state que indica si se debe hacer calculo por valor o por porcentaje
    const [valorMaximoFinanciar, setValorMaximoFinanciar] = useState(0); // state que maneja el valor maximo a financiar en terminos de pesos
    const [valorMaximoFinanciarPorcentaje, setValorMaximoFinanciarPorcentaje] = useState(0); //state para manejar el valor maximo a financiar por porcentaje
    const [valorMinimoFinanciarPorcentaje, setValorMinimoFinanciarPorcentaje] = useState(0); //state para manejar el valor minimo a financiar por porcentaje
    const [rbtnTotal, setRbtnTotal] = useState(false); //state para el radio button de total en el form de financiamiento
    const scrollRef = useRef(null); //Referencia para hacer scroll automatico cuando se genere el certificado
    const [idPSE, setIdPSE] = useState("");//state para manejar el state del id obtenido del servicio de PSE

    const [mostrarFormCombinacionPago, setMostrarFormCombinacionPago] = useState(false);//state que indica si se deve mostrar o no Form de combinacion de pago
    const [valorCombinadoDebito, setValorCombinadoDebito] = useState(0);
    const [valorCombinadoCredito, setValorCombinadoCredito] = useState(0);
    const [valorCombinadoCheke, setValorCombinadoCheke] = useState(0);
    const [sumaValoresCombinados, setSumaValoresCombinados] = useState(0);

    const [valorDebitoDebounced, setValorDebitoDebounced] = useState('');
    const [valorCreditoDebounced, setValorCreditoDebounced] = useState('');
    const [valorChekeDebounced, setValorChekeDebounced] = useState('');


    //Este Evento manda a generar el recibo por dentro invoca la funcion generarReciboPago
    const handleSubmit = async (e) => {
        e.preventDefault();

        //llamo el metodo para mostrar alerta de confirmacion para generar el recibo
        const res = await mostrarAlertaConfirmacion(mensajeConfirmacionGenerarRecibo, "Generar");
        if (res.isConfirmed === false) {
            return;
        }

        //Si no hay un programa seleccionado no hago nada y muestro un mensaje de error
        if (programaSeleccionado.length === 0) {
            mostrarAlertaError("Seleccione un programa")
            return;
        }

        //Si no hay una entidad de financiamiento seleccionada no hago nada y muestro un mensaje de error
        if (mostrarFormFinanciacion && (entidadSeleccionada === undefined || Object.keys(entidadSeleccionada).length === 0)) {
            mostrarAlertaError("Seleccione una entidad de financiamiento")
            return;
        }

        //Si el valor a financiar es menor al monto en terminos de peso muestro un mensaje de error
        if (mostrarFormFinanciacion && (valorFinanciado < valorMinimoFinanciar) && valorOrPorcentaje === "valor") {
            setValorFinanciado(0);
            mostrarAlertaError(`El valor minimo a financiar es de $ ${valorMinimoFinanciar}`);
            return;
        }

        //Si el valor a financiar es menor al monto en terminos de porcentaje muestro un mensaje de error
        if (mostrarFormFinanciacion && (Number(valorFinanciado) < Number(valorMinimoFinanciarPorcentaje)) && valorOrPorcentaje === "porcentaje") {
            setValorFinanciado(0);
            console.log({ valorFinanciado, valorMinimoFinanciarPorcentaje });
            mostrarAlertaError(`El valor minimo a financiar es de  ${valorMinimoFinanciarPorcentaje} %`);
            return;
        }

        //Si el valor a financiar es menor al monto en terminos de porcentaje muestro un mensaje de error
        if (mostrarFormCombinacionPago && (Number(sumaValoresCombinados) > Number(total))) {
            mostrarAlertaError(`La suma de las combinaciones de pago  no puede ser mayor a $${total} %`);
            return;
        }


        try {
            //deshabilito el boton y desestructuro las propiedades
            setBtnGenerarIsDisabled(true);
            const { IdArchivo, urlRecibo, IdImporte, PeriodoId } = await generarReciboPago(userData, programaSeleccionado, infoCondicionesPagoPdf); // Genera el pdf

            //cambio el state del objeto infoRecibo y habilito el boton
            setInfoRecibo({ IdArchivo, urlRecibo });
            setValorFinanciado(0); //seteo 0 al valor financiado para que despues de generado el pdf se elimine el objeto de financiacion del state de infoCondicionesPagoPdf
            setMostrarFormCombinacionPago(false); //seteo false al valor de la bandera mostrar form combinaciones de pago para que despues de generado el pdf se eliminen los objetos de combinaciones de pago del state de infoCondicionesPagoPdf
            setBtnGenerarIsDisabled(false);

            scrollRef.current.scrollIntoView({ behavior: 'smooth' }); //hago scroll automatico hasta el div que mostrara el certificado

            //consumo el servicio que genera el id para el pago de PSE
            const idPSE = await obtenerIdPSE(IdImporte, PeriodoId, userData);
            setIdPSE(idPSE);

        } catch (error) {

            mostrarAlertaError("Ocurrio un fallo en el proceso de generar el recibo");
            setBtnGenerarIsDisabled(false);
        }

    }

    //esta funcion maneja el evento cuando se cambia el programa
    const handleChangePrograma = (e) => {
        const { name, value } = e.target;

        if (name === 'idPrograma') {

            if (value === "0000") {
                setProgramaSeleccionado(undefined);
                return;
            }
            //Filtro los programas y se la seteo al State
            setProgramaSeleccionado(infoPrograma.filter(programa => programa.ProgramaAcademicoID === value))
        }
    }

    //esta funcion maneja el evento cuando se cambia la entidad de financiacion
    const handleChangeFinanciacion = (e) => {
        const { name, value } = e.target;

        if (name === 'idEntidad') {

            if (value === "0000") {
                setEntidadSeleccionada(undefined);
                return;
            }
            //Filtro los programas y se la seteo al State
            setEntidadSeleccionada(lstEntidadFinanciacion.filter(ent => ent.codCondicion === value)[0]);
            setValorFinanciado(0);//seteo 0 para que se limpien elimine el objeto de financiacion cuando se cambie de entidad
        }
    }


    useEffect(() => {
        setTimeout(() => {
            setBtnGenerarIsDisabled(false);
        }, 2000);

    }, [infoPrograma])


    //cuando cambie el programa consulta la condiciones de pago
    useEffect(() => {

        //si es la primera vez qye carga la pagina no hago nada y seteo la variable a falsem para que no se arroje la alerta apenas cargue la pagina
        if (isFirstRender.current) {
            isFirstRender.current = false;
        } else {


            //Si no hay un programa seleccionado no hago nada y muestro un mensaje de error
            if (programaSeleccionado.length === 0) {
                mostrarAlertaError("Seleccione un programa")
                return;
            }

            // consulta las condiciones de pago
            const consultarCondiciones = async () => {
                try {
                    setMostrarDivCargando(true);
                    const infoCondicionesPago = await obtenerCondicionesPago(programaSeleccionado[0], userData.UidEstudiante);
                    if (infoCondicionesPago) {
                        setInfoCondicionesPago(infoCondicionesPago);
                        //Habilito el boton de generar recibo
                        setBtnGenerarExist(true);
                    }
                    setMostrarDivCargando(false)
                } catch (error) {
                    setMostrarDivCargando(false)
                    mostrarAlertaError("Ocurrio un fallo en el proceso");
                }
            }

            consultarCondiciones();
        }

    }, [programaSeleccionado])


    //cuando cambie o carguen la condiciones de pago inicializo  varios state
    useEffect(() => {
        //Seteo el valor de la matricula inicial al State
        if (infoCondicionesPago.length > 0) {

            //!seteo un carnet por default la primera vez que carguen las condiciones de pago
            const condicionCarnet = infoCondicionesPago.filter(item => item.TipoCondicion.startsWith('I00'))
            setUltimoCarnet(condicionCarnet[0])

            //!seto las condiciones de pago bases excluyendo un carnet
            const condicionesBase = infoCondicionesPago.filter(item => item.TipoCondicion !== 'I003')
            setInfoCondicionesPagoPdf(condicionesBase);


            //!calculo el valor base de la matricula sumandole el valor de un carnet y restandole los descuentos respectivos
            let valorTotal = 0;
            infoCondicionesPago.forEach(objeto => {
                if (objeto.TipoCondicion === 'MPRO') {
                    valorTotal += Number(objeto.Importe);
                } else if (objeto.TipoCondicion === 'I003') {
                    return;
                } else {
                    valorTotal += Number(objeto.Importe);
                }
            });

            setTotal(valorTotal)
            setTotalSinDonacion(valorTotal);

        }

    }, [infoCondicionesPago])


    useEffect(() => {
        let valorRestar = 0;
        //! hago el calculo del valor maximo a financiar en terminos de pesos  y el calculo del valor minimo a financiar en terminos de porcentaje cada vez que cambie el estado de infoCondicionesPagoPdf
        if (infoCondicionesPagoPdf.length > 0) {
            infoCondicionesPagoPdf.forEach(item => {
                //console.log({ infoCondicionesPagoPdf });
                if (item.TipoCondicion.startsWith('I00') || item.TipoCondicion === 'ZDON') {
                    valorRestar += parseFloat(item.Importe);
                }
            });
            //console.log({ valorRestar }, { total }, { resultado: (total - valorRestar) });
            //setValorMaximoFinanciar(total - valorRestar);
            //setValorMinimoFinanciarPorcentaje(((valorMinimoFinanciar * 100) / total).toFixed(2))
            setValorMaximoFinanciar(total - (valorDonaciones + Number(ultimoCarnet.Importe))) //!TODO:: SI ALGO REVERTIR POR CALCULO SOLICITADO ING BRAYAN)
            setValorMinimoFinanciarPorcentaje(((valorMinimoFinanciar * 100) / (total - (valorDonaciones + Number(ultimoCarnet.Importe)))).toFixed(2)) //!TODO:: SI ALGO REVERTIR POR CALCULO SOLICITADO ING BRAYAN)
        }
    }, [infoCondicionesPagoPdf])

    useEffect(() => {
        //! hago el calculo  del valor maximo a financiar en terminos de porcentaje cada vez que cambie el estado de valorMaximoFinanciar
        //setValorMaximoFinanciarPorcentaje(((valorMaximoFinanciar * 100) / total).toFixed(2))
        setValorMaximoFinanciarPorcentaje(((valorMaximoFinanciar * 100) / (total - (valorDonaciones + Number(ultimoCarnet.Importe)))).toFixed(2))//!TODO:: SI ALGO REVERTIR POR CALCULO SOLICITADO ING BRAYAN)
    }, [valorMaximoFinanciar])


    useEffect(() => {
        //Si no hay una entidad seleccionada no hago nada y muestro un mensaje de error
        if (entidadSeleccionada === undefined) {
            mostrarAlertaError("Seleccione una entidad de financiamiento")
            return;
        }
    }, [entidadSeleccionada])



    //seteo lo que tenga total al total financiado
    useEffect(() => {
        if (mostrarFormFinanciacion) {
            //setTotalFinanciado(total); //!inicio el state del totalFinanciado con el valor que tenga el state del total 
            setTotalFinanciado(total - (valorDonaciones + Number(ultimoCarnet.Importe))) //!TODO:: SI ALGO REVERTIR POR CALCULO SOLICITADO ING BRAYAN
        } else {
            setTotalFinanciado(0);
            setValorFinanciado(0);
            eliminarObjetoFinanciacion();
        }
    }, [mostrarFormFinanciacion])


    useEffect(() => {
        //limpio los states de combinaciones de pago cuando no se quiera hacer combinacion de pago
        if (!mostrarFormCombinacionPago) {
            setSumaValoresCombinados(0);
            setValorCombinadoDebito(0);
            setValorCombinadoCredito(0);
            setValorCombinadoCheke(0);
            eliminarObjetoDebito();
            eliminarObjetoCredito();
            eliminarObjetoCheke();
        }
    }, [mostrarFormCombinacionPago])


    //! Actualizar valorFinanciadoRestarDebounced después de que el usuario haya dejado de escribir durante 1 segundo
    useEffect(() => {
        const handler = setTimeout(() => {
            setValorFinanciadoRestarDebounced(valorFinanciado);
        }, 1000);

        if (valorFinanciado === '' || valorFinanciado === 0) {
            eliminarObjetoFinanciacion();//! si valor finaciado es vacio o cero elimimo el objeto de financiacion del state de infoCondicionesPagoPdf
        }

        return () => {
            clearTimeout(handler);
        };

    }, [valorFinanciado]);


    //! Actualizar valorCombinadoDebito después de que el usuario haya dejado de escribir durante 1 segundo
    useEffect(() => {
        const handler = setTimeout(() => {
            setValorDebitoDebounced(valorCombinadoDebito);
        }, 1000);

        if (valorCombinadoDebito === '' || valorCombinadoDebito === 0) {
            eliminarObjetoDebito();//! si valor finaciado es vacio o cero elimimo el objeto de debito del state de infoCondicionesPagoPdf
        }

        return () => {
            clearTimeout(handler);
        };

    }, [valorCombinadoDebito]);

    //! Actualizar valorCombinadoCredito después de que el usuario haya dejado de escribir durante 1 segundo
    useEffect(() => {
        const handler = setTimeout(() => {
            setValorCreditoDebounced(valorCombinadoCredito);
        }, 1000);

        if (valorCombinadoCredito === '' || valorCombinadoCredito === 0) {
            eliminarObjetoCredito();//! si valor finaciado es vacio o cero elimimo el objeto de credito del state de infoCondicionesPagoPdf
        }

        return () => {
            clearTimeout(handler);
        };

    }, [valorCombinadoCredito]);

    //! Actualizar valorCombinadoCheke después de que el usuario haya dejado de escribir durante 1 segundo
    useEffect(() => {
        const handler = setTimeout(() => {
            setValorChekeDebounced(valorCombinadoCheke);
        }, 1000);

        if (valorCombinadoCheke === '' || valorCombinadoCheke === 0) {
            eliminarObjetoCheke();//! si valor finaciado es vacio o cero elimimo el objeto de Cheke del state de infoCondicionesPagoPdf
        }

        return () => {
            clearTimeout(handler);
        };

    }, [valorCombinadoCheke]);



    //! Actualizar total solo cuando valorFinanciadoRestarDebounced cambia
    useEffect(() => {
        if (valorFinanciadoRestarDebounced === '') {
            //setTotalFinanciado(total);   // Restablecer a la suma original cuando el campo de entrada está vacío
            setTotalFinanciado(total - (valorDonaciones + Number(ultimoCarnet.Importe))) //!TODO:: SI ALGO REVERTIR POR CALCULO SOLICITADO ING BRAYAN
        } else {

            if (valorOrPorcentaje === 'valor') {
                //setTotalFinanciado(total - valorFinanciadoRestarDebounced); // al valor total le resta el valor financiado y se lo setea al state de totalFinanciado
                setTotalFinanciado((total - (valorDonaciones + Number(ultimoCarnet.Importe))) - valorFinanciadoRestarDebounced) //!TODO:: SI ALGO REVERTIR POR CALCULO SOLICITADO ING BRAYAN
            } else {

                //! al valor total le resta el valor financiado en terminos de % y se lo setea al state de totalFinanciado
                //const valorRestar = (valorFinanciadoRestarDebounced / 100) * total;
                //setTotalFinanciado(total - valorRestar);
                const valorRestar = (valorFinanciadoRestarDebounced / 100) * (total - (valorDonaciones + Number(ultimoCarnet.Importe)));//!TODO:: SI ALGO REVERTIR POR CALCULO SOLICITADO ING BRAYAN
                setTotalFinanciado((total - (valorDonaciones + Number(ultimoCarnet.Importe))) - valorRestar) //!TODO:: SI ALGO REVERTIR POR CALCULO SOLICITADO ING BRAYAN
            }

            //! Agrego el objeto de financiamiento al arreglo de condiciones de pagos pdf siempre y cuando el valor financiado sea mayor al valor Minimo  a financiar ya sea por terminos de peso o de porcentaje
            if (mostrarFormFinanciacion && (Number(valorFinanciado) >= Number(valorMinimoFinanciar)) && valorOrPorcentaje === "valor") {
                setInfoCondicionesPagoPdf((prev) => [...prev,
                {
                    Signo: "-",
                    DescripcionCondicion: entidadSeleccionada.desCondicion,
                    Importe: `-${valorFinanciado.toString()}`,
                    TipoCondicion: entidadSeleccionada.codCondicion,
                    Cliente: infoCondicionesPagoPdf[0].Cliente,
                    TipoImporte: "C"
                }])
            } else if (mostrarFormFinanciacion && (Number(valorFinanciado) >= Number(valorMinimoFinanciarPorcentaje)) && valorOrPorcentaje === "porcentaje") {
                setInfoCondicionesPagoPdf((prev) => [...prev,
                {
                    Signo: "-",
                    DescripcionCondicion: entidadSeleccionada.desCondicion,
                    //Importe: `-${(valorFinanciado * total) / 100}`,//`-${valorFinanciado.toString()}`,
                    Importe: `-${(valorFinanciado * (total - (valorDonaciones + Number(ultimoCarnet.Importe)))) / 100}`,//!TODO:: SI ALGO REVERTIR POR CALCULO SOLICITADO ING BRAYAN,
                    TipoCondicion: entidadSeleccionada.codCondicion,
                    Cliente: infoCondicionesPagoPdf[0].Cliente,
                    TipoImporte: "C"
                }])
            }

        }
    }, [valorFinanciadoRestarDebounced, valorOrPorcentaje]);



    //! Actualizar total solo cuando valorFinanciadoRestarDebounced cambia
    useEffect(() => {
        if (valorDebitoDebounced != '') {
            //! Agrego el objeto de debito al arreglo de condiciones de pagos pdf siempre y cuando el valor sea mayor a 0 y menor al total de la matricula
            if (mostrarFormCombinacionPago && (Number(valorCombinadoDebito) <= Number(total))) {
                setInfoCondicionesPagoPdf((prev) => [...prev,
                {
                    Signo: "-",
                    DescripcionCondicion: CodigosCombinacionPago[0].descripcion,
                    Importe: `-${valorCombinadoDebito.toString()}`,
                    TipoCondicion: CodigosCombinacionPago[0].Codigo,
                    Cliente: infoCondicionesPagoPdf[0].Cliente,
                    TipoImporte: "C"
                }])
            }
        }
    }, [valorDebitoDebounced]);

    //! Actualizar total solo cuando valorFinanciadoRestarDebounced cambia
    useEffect(() => {
        if (valorCreditoDebounced != '') {
            //! Agrego el objeto de credito al arreglo de condiciones de pagos pdf siempre y cuando el valor sea mayor a 0 y menor al total de la matricula
            if (mostrarFormCombinacionPago && (Number(valorCombinadoCredito) <= Number(total))) {
                setInfoCondicionesPagoPdf((prev) => [...prev,
                {
                    Signo: "-",
                    DescripcionCondicion: CodigosCombinacionPago[1].descripcion,
                    Importe: `-${valorCombinadoCredito.toString()}`,
                    TipoCondicion: CodigosCombinacionPago[1].Codigo,
                    Cliente: infoCondicionesPagoPdf[0].Cliente,
                    TipoImporte: "C"
                }])
            }
        }
    }, [valorCreditoDebounced]);

    //! Actualizar total solo cuando valorFinanciadoRestarDebounced cambia
    useEffect(() => {
        if (valorChekeDebounced != '') {
            //! Agrego el objeto de credito al arreglo de condiciones de pagos pdf siempre y cuando el valor sea mayor a 0 y menor al total de la matricula
            if (mostrarFormCombinacionPago && (Number(valorCombinadoCheke) <= Number(total))) {
                setInfoCondicionesPagoPdf((prev) => [...prev,
                {
                    Signo: "-",
                    DescripcionCondicion: CodigosCombinacionPago[2].descripcion,
                    Importe: `-${valorCombinadoCheke.toString()}`,
                    TipoCondicion: CodigosCombinacionPago[2].Codigo,
                    Cliente: infoCondicionesPagoPdf[0].Cliente,
                    TipoImporte: "C"
                }])
            }
        }
    }, [valorChekeDebounced]);


    //cuando cambie el valor total actualizo el state del totalFinanciado
    useEffect(() => {
        if (mostrarFormFinanciacion) {
            //setTotalFinanciado(total)
            setTotalFinanciado(total - (valorDonaciones + Number(ultimoCarnet.Importe))) //!TODO:: SI ALGO REVERTIR POR CALCULO SOLICITADO ING BRAYAN
        }
    }, [total])


    //Maneja el onchange de los radio butons de carnet
    const handleAddValueCarnet = (value, carnet) => {

        const valNumber = parseFloat(value)
        setValorCarnet(valNumber);

        //! extraigo el valor del carnet seleccionado por defecto para restarselo y sumarle el nuevo valor del carnet seleccionado
        const valorRestarCarnet = Number(ultimoCarnet.Importe)
        setTotal((totalSinDonacion - valorRestarCarnet) + valNumber + valorDonaciones);

        //! actualizo el estado de la condicion de pago de Carnet 
        const nuevoEstadoCarnet = infoCondicionesPagoPdf.map(objeto => {
            if (objeto.TipoCondicion === ultimoCarnet.TipoCondicion) {
                return { ...objeto, ...carnet };
            }
            return objeto;
        });
        setInfoCondicionesPagoPdf(nuevoEstadoCarnet);
        setUltimoCarnet(carnet)
        setValorFinanciado(0);
    };

    //Maneja el onchange de los radio butons de Donaciones
    const handleAddValueDonacion = (value) => {

        const valNumber = parseFloat(value)
        setValorDonaciones(valNumber);
        setTotal(totalSinDonacion + valNumber);

        //!actualizo el estado de la condicion de pago de Donaciones
        const nuevoEstadoDonacion = infoCondicionesPagoPdf.map(objeto => {
            if (objeto.TipoCondicion === 'ZDON') {
                return { ...objeto, Importe: value.toString() };
            }
            return objeto;
        });
        setInfoCondicionesPagoPdf(nuevoEstadoDonacion);
        setValorFinanciado(0);
    };


    //! Filtra el arreglo de infocondicionesPagoPdf para excluir los objetos con TipoCondicion 'ZDFI' o 'ZFCB' cuando no se quiera financiar
    const eliminarObjetoFinanciacion = () => {
        const arregloPdfNoFinanciado = infoCondicionesPagoPdf.filter(item => item.TipoCondicion !== 'ZDFI' && item.TipoCondicion !== 'ZFCB' && item.TipoCondicion !== undefined);
        setInfoCondicionesPagoPdf(arregloPdfNoFinanciado);
    }

    //! Filtra el arreglo de infocondicionesPagoPdf para excluir los objetos con TipoCondicion 'ZTDE' (debito)  cuando no se quiera combinar el pago
    const eliminarObjetoDebito = () => {
        const arregloPdfNoDebito = infoCondicionesPagoPdf.filter(item => item.TipoCondicion !== 'ZTDE' && item.TipoCondicion !== undefined);
        setInfoCondicionesPagoPdf(arregloPdfNoDebito);
    }

    //! Filtra el arreglo de infocondicionesPagoPdf para excluir los objetos con TipoCondicion 'ZTCR' (credito)  cuando no se quiera combinar el pago
    const eliminarObjetoCredito = () => {
        const arregloPdfNoCredito = infoCondicionesPagoPdf.filter(item => item.TipoCondicion !== 'ZTCR' && item.TipoCondicion !== undefined);
        setInfoCondicionesPagoPdf(arregloPdfNoCredito);
    }

    //! Filtra el arreglo de infocondicionesPagoPdf para excluir los objetos con TipoCondicion 'ZCHE' (cheke) cuando no se quiera combinar el pago
    const eliminarObjetoCheke = () => {
        const arregloPdfNoCheke = infoCondicionesPagoPdf.filter(item => item.TipoCondicion !== 'ZCHE' && item.TipoCondicion !== undefined);
        setInfoCondicionesPagoPdf(arregloPdfNoCheke);
    }

    useEffect(() => {
        //calculo la suma de combinaciones de pago
        setSumaValoresCombinados((Number(valorCombinadoDebito) + Number(valorCombinadoCredito) + Number(valorCombinadoCheke)))
    }, [valorCombinadoDebito, valorCombinadoCredito, valorCombinadoCheke])


    return (
        <>
            <link href="https://unpkg.com/tailwindcss@^2/dist/tailwind.min.css" rel="stylesheet" />

            <div className="container mx-auto px-4 py-10 bg-gray p-4" style={estiloFuentes}>

                <form onSubmit={handleSubmit} autoComplete="off" className="flex flex-col space-y-4 bg-white rounded-md shadow-md p-4">

                    {/* <h2>total = {total}</h2>
                    <h2>total sin donacion = {totalSinDonacion}</h2>
                    <h2>donacion = {valorDonaciones}</h2>
                    <h2>UltimoCarnet = {ultimoCarnet.Importe}</h2>
                    <h2>Suma combinados = {sumaValoresCombinados}</h2>
                    <h2>resultado {total - (valorDonaciones + Number(ultimoCarnet.Importe))}</h2> */}

                    <div className="flex items-center">
                        <label style={estiloBadges} htmlFor="idPrograma" className="w-1/3 text-gray-700 font-medium">Programa:</label>
                        <select
                            className="flex-1 px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500"
                            id="idPrograma"
                            name="idPrograma"
                            onChange={handleChangePrograma}
                        >
                            {(Object.keys(programaSeleccionado).length === 0) && <option key={"0000"} value={"0000"} style={{ color: 'red' }}>
                                --Selecciona un Programa--
                            </option>}
                            {infoPrograma.map((prog) => (
                                <option key={prog.ProgramaAcademicoID} value={prog.ProgramaAcademicoID}>
                                    {`${prog.Descripcion} - ( ${prog.ProgramaAcademicoID} )`}
                                </option>
                            ))}
                        </select>
                    </div>

                    {
                        (mostrarDivCargando) && <div className="flex justify-center items-center">
                            <label style={estiloBadges} htmlFor="idPrograma" className="w-full py-2 rounded-md bg-blue-500 text-white font-medium hover:bg-blue-700">Cargando....</label>
                        </div>
                    }

                    {
                        /*DIV DE CONCEPTOS*/
                        (infoCondicionesPago.length > 0) &&

                        <div>
                            <fieldset className="border-2 border-gray-400 rounded-lg p-4 shadow-lg">
                                <legend className="text-lg font-semibold">Conceptos</legend>
                                <table className="border-collapse border border-gray-400 w-full mt-2">
                                    <thead>
                                        <tr className="bg-blue-900 text-white">
                                            <th className="border border-gray-400 p-2">Codigo</th>
                                            <th className="border border-gray-400 p-2">Descripcion</th>
                                            <th className="border border-gray-400 p-2">Valor</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {infoCondicionesPago.map((item, index) => {
                                            if (!item.TipoCondicion.startsWith("I00") && item.TipoCondicion !== "ZDON") {
                                                return (
                                                    <tr key={index}>
                                                        <td className="border border-gray-400 p-2">{item.TipoCondicion}</td>
                                                        <td className="border border-gray-400 p-2">{item.DescripcionCondicion}</td>
                                                        <td className="border border-gray-400 p-2 text-right">$ {Number(item.Importe).toLocaleString('de-DE')}</td>
                                                    </tr>

                                                )
                                            }

                                        })}
                                        <tr>
                                            <td><span className="text-lg font-bold">Valor base a pagar</span></td>
                                            <td>{""}</td>
                                            <td className="text-right p-2">
                                                <span className="text-md font-bold">
                                                    ${(total - (valorDonaciones + Number(ultimoCarnet.Importe))).toLocaleString('de-DE')}
                                                </span>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </fieldset>
                        </div>
                    }


                    {
                        /*DIV DE CARNET*/
                        (infoCondicionesPago.length > 0) &&
                        <div>
                            <fieldset className="border-2 border-gray-400 rounded-lg p-4 shadow-lg">
                                <legend className="text-lg font-semibold">Carné</legend>
                                <table className="border-collapse border border-gray-400 w-full mt-2">
                                    <tbody>
                                        {
                                            infoCondicionesPago.map((item, index) => {
                                                if (item.TipoCondicion.startsWith('I00')) {

                                                    const isItemInOtherList = infoCondicionesPagoPdf.some(otherItem => otherItem.TipoCondicion === item.TipoCondicion);

                                                    return (
                                                        <tr key={index} className="bg-blue-900 text-white">
                                                            <td className="border border-gray-400 p-2">
                                                                <input type="radio" name="rbtCarne" checked={isItemInOtherList} onChange={() => handleAddValueCarnet(item.Importe, item)} />
                                                                <label>{item.DescripcionCondicion}</label>
                                                                <label className="mx-3">
                                                                    {(item.DescripcionCondicion === "CARNE REACTIVACION") ?
                                                                        <TooltipComponents claseColorTailwind="text-white" mensaje="Recuerda que el pago del carné es importante porque es el único documento válido para ingresar a la institución." />
                                                                        :
                                                                        <TooltipComponents claseColorTailwind="text-white" mensaje="Recuerda que este pago te permite solicitar un nuevo carné en caso de pérdida." />
                                                                    }
                                                                </label>
                                                            </td>
                                                            <td className="border border-gray-400 text-right p-2">
                                                                <label className="p-2">${Number(item.Importe).toLocaleString('de-DE')}</label>
                                                            </td>
                                                        </tr>
                                                    )
                                                }
                                            })
                                        }
                                        <tr>
                                            <td><span className="text-lg font-bold">Valor a Pagar</span></td>
                                            <td className="text-right p-2"><span className="text-md font-bold">${total.toLocaleString('de-DE')}</span></td>
                                        </tr>
                                    </tbody>

                                </table>
                            </fieldset>
                        </div>


                    }


                    {
                        /*DIV DE DONACION*/
                        (infoCondicionesPago.length > 0) &&
                        <div>
                            <fieldset className="border-2 border-gray-400 rounded-lg p-4 shadow-lg">
                                <legend className="text-lg font-semibold">Donación</legend>
                                <p>Te invitamos a donar y ser partícipe de esta hermosa labor contribuyendo a que muchos de nosotros podamos continuar nuestros estudios y
                                    a que otros que no han podido cumplir su sueño de ingresar a la Educación Superior lo puedan cumplir. Ayúdanos, tu aporte puede significar
                                    un gran cambio.
                                </p>
                                <table className="border-collapse border border-gray-400 w-full mt-2">
                                    <tbody>

                                        {
                                            lstOpcionesDonacion.map((item, index) => {

                                                const isItemInOtherList = infoCondicionesPagoPdf.some(otherItem => (otherItem.TipoCondicion === 'ZDON' && otherItem.Importe === item.montoDonacion.toString()));
                                                return (
                                                    <tr key={index} className="bg-blue-900 text-white">
                                                        <td className="border border-gray-400 p-2">
                                                            <input type="radio" name="rbtDonacion" checked={isItemInOtherList} onChange={() => handleAddValueDonacion(item.montoDonacion)} />
                                                            <label>{item.texto}</label>
                                                        </td>
                                                        <td className="border border-gray-400 text-right p-2">
                                                            <label>${item.montoDonacion.toLocaleString('de-DE')}</label>
                                                        </td>
                                                    </tr>
                                                )
                                            })
                                        }
                                        <tr>
                                            <td><span className="text-lg font-bold">Valor a Pagar</span></td>
                                            <td className="text-right p-2"><span className="text-md font-bold">${total.toLocaleString('de-DE')}</span></td>
                                        </tr>

                                    </tbody>
                                </table>
                            </fieldset>
                        </div>
                    }


                    {
                        /*DIV DE Financiacion*/
                        (infoCondicionesPago.length > 0) &&
                        <div>
                            <fieldset className="border-2 border-gray-400 rounded-lg p-4 shadow-lg">
                                <legend className="text-lg font-semibold">Financiación</legend>

                                <div className="flex items-center">
                                    <label style={estiloBadges} htmlFor="idEntidad" className="w-1/3 text-gray-700 font-medium">Entidad:</label>
                                    <select
                                        className="flex-1 px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                        id="idEntidad"
                                        name="idEntidad"
                                        onChange={handleChangeFinanciacion}
                                    >
                                        {(Object.keys(entidadSeleccionada).length === 0) && <option key={"0000"} value={"0000"} style={{ color: 'red' }}>
                                            --Selecciona una entidad --
                                        </option>}
                                        {lstEntidadFinanciacion.map((entidad) => (
                                            <option key={entidad.idEntidad} value={entidad.codCondicion}>
                                                {entidad.texto}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="flex items-center mt-3 mb-3" >

                                    <span className="mr-3">
                                        <input type="radio" name="rbtFinanciacion" onChange={() => { setRbtnTotal(true), setMostrarFormFinanciacion(false) }} />
                                        <label>Total</label>
                                    </span>

                                    <span className="mr-3">
                                        <input type="radio" name="rbtFinanciacion" onChange={() => { setMostrarFormFinanciacion(true); setRbtnTotal(false); }} />
                                        <label>Parcial</label>
                                    </span>

                                    <span className="ml-3">
                                        <input type="radio" checked={!mostrarFormFinanciacion && !rbtnTotal} name="rbtFinanciacion" onChange={() => { setMostrarFormFinanciacion(false); setRbtnTotal(false); }} />
                                        <label>No</label>
                                    </span>

                                    <span className="mx-3">
                                        <TooltipComponents claseColorTailwind="text-white" mensaje="Ten en cuenta lo siguiente:</br></br> <b>Total</b>: significa la financiación del 100% de la matricula mas el valor del carné con COOP-UNIMINUTO y/o COLSUBSIDIO.
                                                               </br></br> <b>Parcial</b>: significa pagar una parte de la matrícula en el banco y buscar una financiación para el restante con COOP-UNIMINUTO y/o COLSUBSIDIO."/>

                                    </span>

                                </div>

                                <div className="flex items-center mt-3 mb-3" >
                                    <p>Si tiene un recibo pagado parcialmente, es necesario acercarse a la sede y no generar un nuevo recibo.</p>
                                </div>

                                {
                                    /*Muestro el formulario si se elije pago parcial y se selecciona una entidad de financiamiento */
                                    (mostrarFormFinanciacion && Object.keys(entidadSeleccionada).length > 0) &&
                                    <div>

                                        {/* <span className="flex justify-center items-center text-blue-900 text-sm m-2 font-bold">Minimo % {valorMinimoFinanciarPorcentaje} ---- Maximo% {valorMaximoFinanciarPorcentaje}  Minimo ${valorMinimoFinanciar} ---- Maximo $ {valorMaximoFinanciar} </span> */}

                                        <div className="flex items-center">
                                            <label style={estiloBadges} htmlFor="" className="w-1/3 text-gray-700 font-medium">Financiación por:</label>
                                            <span className="mr-3">
                                                <input type="radio" checked={valorOrPorcentaje === "valor"} name="rbtValorOrPorcentaje" onChange={() => setValorOrPorcentaje("valor")} />
                                                <label>Valor</label>
                                            </span>

                                            <span className="mr-3">
                                                <input type="radio" checked={valorOrPorcentaje === "porcentaje"} name="rbtValorOrPorcentaje" onChange={() => setValorOrPorcentaje("porcentaje")} />
                                                <label>Porcentaje</label>
                                            </span>
                                        </div>

                                        <div className="flex items-center">
                                            <label style={estiloBadges} htmlFor="" className="w-1/3 text-gray-700 font-medium">Valor a Financiar {(valorOrPorcentaje.toLowerCase() === "valor") ? '$' : '%'} :</label>
                                            {/* <input type="number" min={0} max={total} value={valorFinanciado} className="flex-1 px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500" placeholder="Ingrese el valor" onChange={(e) => setValorFinanciado(e.target.value)} /> */}
                                            {/* <input type="number" 
                                                min={(valorOrPorcentaje === "valor") ? valorMinimoFinanciar : ((valorMinimoFinanciar * 100) / total).toFixed(2)}
                                                max={(valorOrPorcentaje === "valor") ? valorMaximoFinanciar : ((valorMaximoFinanciar * 100) / total).toFixed(2)} value={valorFinanciado}
                                                className="flex-1 px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500" placeholder="Ingrese el valor"
                                                onChange={(e) => setValorFinanciado(e.target.value)} /> */}

                                            <input type="number"
                                                min={(valorOrPorcentaje === "valor") ? valorMinimoFinanciar : Number(valorMinimoFinanciarPorcentaje)}
                                                max={(valorOrPorcentaje === "valor") ? valorMaximoFinanciar : Number(valorMaximoFinanciarPorcentaje)} value={valorFinanciado}
                                                className="flex-1 px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500" placeholder="Ingrese el valor"
                                                step="0.01"
                                                onChange={(e) => setValorFinanciado(e.target.value)} />
                                        </div>


                                        {(
                                            /*Muestra errores si no llega monto minimo*/
                                            (valorOrPorcentaje === "valor")
                                                ?
                                                ((valorFinanciado < valorMinimoFinanciar) && (valorFinanciado > 0 || valorFinanciado != "")) ?
                                                    <SpanErrorComponents mensaje={`El valor a financiar no puede ser menor a $ ${valorMinimoFinanciar}.`} /> : ''
                                                :

                                                // ((valorFinanciado < ((valorMinimoFinanciar * 100) / total)) && (valorFinanciado > 0 || valorFinanciado != "")) ?
                                                //     <SpanErrorComponents mensaje={`El valor a financiar no puede ser menor a ${((valorMinimoFinanciar * 100) / total).toFixed(2)} %.`} /> 
                                                //!TODO:: SI ALGO REVERTIR POR CALCULO SOLICITADO ING BRAYAN
                                                ((valorFinanciado < ((valorMinimoFinanciar * 100) / (total - (valorDonaciones + Number(ultimoCarnet.Importe))))) && (valorFinanciado > 0 || valorFinanciado != "")) ?
                                                    <SpanErrorComponents mensaje={`El valor a financiar no puede ser menor a ${((valorMinimoFinanciar * 100) / (total - (valorDonaciones + Number(ultimoCarnet.Importe)))).toFixed(2)} %.`} />

                                                    : ''
                                        )}

                                        {(
                                            /*Muestra errores si se pasa del tope maximo*/
                                            (valorOrPorcentaje === "valor")
                                                ?
                                                (valorFinanciado > valorMaximoFinanciar) ?
                                                    <SpanErrorComponents mensaje={`Error: El valor a financiar no puede ser superior a $ ${valorMaximoFinanciar}.`} /> : ''
                                                :
                                                // (valorFinanciado > ((valorMaximoFinanciar * 100) / total)) ?
                                                //     <SpanErrorComponents mensaje={`Error: El valor a financiar no puede ser superior a ${((valorMaximoFinanciar * 100) / total).toFixed(2)} %.`} /> 
                                                //!TODO:: SI ALGO REVERTIR POR CALCULO SOLICITADO ING BRAYAN
                                                (valorFinanciado > ((valorMaximoFinanciar * 100) / (total - (valorDonaciones + Number(ultimoCarnet.Importe))))) ?
                                                    <SpanErrorComponents mensaje={`Error: El valor a financiar no puede ser superior a ${((valorMaximoFinanciar * 100) / (total - (valorDonaciones + Number(ultimoCarnet.Importe)))).toFixed(2)} %.`} />

                                                    : ''
                                        )}


                                        <div className="flex items-center">
                                            <label style={estiloBadges} htmlFor="" className="w-1/3 text-gray-700 font-medium">Valor a pagar descontando financiación:</label>
                                            <input type="number" readOnly disabled className="text-md font-bold flex-1 px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500" placeholder="Ingrese el valor" value={totalFinanciado} />
                                            {/* <span className="flex text-lg text-red-500 font-bold">${totalFinanciado}</span> */}
                                        </div>
                                    </div>

                                }
                            </fieldset>
                            {/* <pre>{JSON.stringify(infoCondicionesPagoPdf)}</pre> */}
                        </div>
                    }

                    {
                        /*DIV DE COMBINACIONES*/
                      (infoCondicionesPago.length > 0) &&
                        <div>
                            <fieldset className="border-2 border-gray-400 rounded-lg p-4 shadow-lg">
                                <legend className="text-lg font-semibold">Combinación medios de pago</legend>

                                <div className="flex items-center mt-3 mb-3" >

                                    <span className="mr-3">
                                        <input type="radio" name="rbtCombinacion" onChange={() => setMostrarFormCombinacionPago(true)} />
                                        <label>Si</label>
                                    </span>

                                    <span className="mr-3">
                                        <input type="radio" checked={!mostrarFormCombinacionPago} name="rbtCombinacion" onChange={() => { setMostrarFormCombinacionPago(false) }} />
                                        <label>No</label>
                                    </span>

                                </div>

                                <div className="flex items-center mt-3 mb-3" >
                                    <p>Ten en cuenta que los pagos con tarjeta de crédito, tarjeta débito o cheque, solo se recibirán en las sedes donde UNIMINUTO tenga caja para pago.
                                       <br/> Escribe en los recuadros el valor a pagar según lo desee:</p>
                                </div>

                                {
                                    /*Muestro el formulario si se elije combinacion de pago */
                                    (mostrarFormCombinacionPago) &&
                                    <div>
                                        <div className="flex items-center mt-2">
                                            <label style={estiloBadges} htmlFor="" className="w-1/3 text-gray-700 font-medium">Tarjeta débito</label>

                                            <input type="number"
                                                min={0}
                                                max={total} value={valorCombinadoDebito}
                                                className="flex-1 px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500" placeholder="Ingrese el valor"
                                                step="0.01"
                                                onChange={(e) => setValorCombinadoDebito(e.target.value)} />

                                        </div>

                                        {(
                                            /*Muestra errores si se pasa del total de la matricula*/
                                            (total < valorCombinadoDebito) ?
                                                <SpanErrorComponents mensaje={`El valor a financiar no puede ser mayor a $ ${total}.`} /> : ''
                                        )}


                                        <div className="flex items-center mt-2">
                                            <label style={estiloBadges} htmlFor="" className="w-1/3 text-gray-700 font-medium">Tarjeta de crédito</label>

                                            <input type="number"
                                                min={0}
                                                max={total} value={valorCombinadoCredito}
                                                className="flex-1 px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500" placeholder="Ingrese el valor"
                                                step="0.01"
                                                onChange={(e) => setValorCombinadoCredito(e.target.value)} />

                                        </div>

                                        {(
                                            /*Muestra errores si se pasa del total de la matricula*/
                                            (total < valorCombinadoCredito) ?
                                                <SpanErrorComponents mensaje={`El valor a financiar no puede ser mayor a $ ${total}.`} /> : ''
                                        )}


                                        <div className="flex items-center mt-2">
                                            <label style={estiloBadges} htmlFor="" className="w-1/3 text-gray-700 font-medium">Cheque</label>

                                            <input type="number"
                                                min={0}
                                                max={total} value={valorCombinadoCheke}
                                                className="flex-1 px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500" placeholder="Ingrese el valor"
                                                step="0.01"
                                                onChange={(e) => setValorCombinadoCheke(e.target.value)} />
                                        </div>

                                        {(
                                            /*Muestra errores si se pasa del total de la matricula*/
                                            (total < valorCombinadoCheke) ?
                                                <SpanErrorComponents mensaje={`El valor a financiar no puede ser mayor a $ ${total}.`} /> : ''
                                        )}

                                        <div className="flex items-center mt-2">
                                            <label style={estiloBadges} htmlFor="" className="w-1/3 text-gray-700 font-medium">Efectivo (Pago en banco):</label>
                                            <input type="number" readOnly disabled className="text-md font-bold flex-1 px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                                value={(total - sumaValoresCombinados)} />
                                        </div>

                                        <div className="flex items-center mt-2">
                                            <label style={estiloBadges} htmlFor="" className="w-1/3 text-gray-700 font-medium">Total</label>
                                            <input type="number" readOnly disabled className="text-md font-bold flex-1 px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                                value={total.toLocaleString('de-DE')} />
                                        </div>

                                    </div>
                                }

                            </fieldset>
                        </div>
                    }

                    {/* {<pre>{JSON.stringify(infoCondicionesPagoPdf)}</pre>} */}

                    {/* Boton Generar Recibo */}
                    {
                        (btnGenerarExist) &&
                        <div className="flex items-center py-6">
                            <button type="submit"
                                onMouseEnter={() => setIsHovered(true)}
                                onMouseLeave={() => setIsHovered(false)} style={isHovered ? estiloHover : estiloBase}
                                className={!btnGenerarIsDisabled ? "w-full py-2 rounded-md bg-blue-500 text-white font-medium hover:bg-blue-700" : "w-full py-2 rounded-md bg-gray-500 text-white font-medium hover:bg-blue-700"}
                                disabled={btnGenerarIsDisabled}>
                                {btnGenerarIsDisabled ? 'Generando...' : 'Generar recibo'}
                            </button>
                        </div>
                    }

                    {/* Vista previa del recibo */}
                    {
                        (infoRecibo.urlRecibo != "") &&
                        <div className="flex items-center py-6" ref={scrollRef}>
                            <iframe src={infoRecibo.urlRecibo} width="600" height="400"></iframe>
                        </div>
                    }

                    {/* Link pago por PSE */}
                    {
                        (idPSE != "") &&
                        <a style={estiloBadges2} className="flex justify-center text-center text-whithe"
                            // href={`https://www.zonapagos.com/t_uniminuto/pago.asp?estado_pago=iniciar_pago&identificador=${idPSE}`} 
                            href={`${urlPagoPSE}${idPSE}`}
                            target="_blank">
                            Pago por PSE
                        </a>
                    }


                </form>
            </div>

        </>)
}
