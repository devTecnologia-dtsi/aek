import React, { useEffect, useRef, useState } from "react";
import {
  Container,
  VBox,
  BannerHeader,
  BasicSegment,
} from "@ombiel/aek-lib";
import { useAxiosDatosPersonales } from "../../hooks/useAxiosDatosPersonales";
import { useAxiosProgramasInscritos } from "../../hooks/useAxiosProgramasInscritos";
import { useAxiosCondicionesPago } from "../../hooks/useAxiosCondicionesPago";
import { useAxiosReciboPago } from "../../hooks/useAxiosReciboPago";
import { mostrarAlertaError } from "../../helpers/alertasHelper";


//DEFINO LOS ESTILOS
const estiloFuentes = {
  fontFamily: 'Helvetica',
  fontSize: '12px'
};

const estiloBadges = {
  backgroundColor: '#2C3A49',
  color: 'white',
  marginRight: '5px',
  padding: '5px 10px',
  borderRadius: '5px',
  display: 'inline-block'
};

const estiloBase = {
  backgroundColor: '#2C3A49'
}

const estiloHover = {
  backgroundColor: '#4F6175'
}

//Lista de las entidades de financiacion
const lstEntidadFinanciacion = [
  { idEntidad: 1, texto: "COOP-UNINIMINUTO", desCondicion: "Val.a fin. Coop", codCondicion: "ZDFI" },
  { idEntidad: 2, texto: "COLSUBSIDIO", desCondicion: "Val.a fin. Cols", codCondicion: "ZFCB" }
]

const lstOpcionesDonacion = [
  { id: 1, texto: "No deseo Donar", montoDonacion: 0 },
  { id: 2, texto: "Donar $5000", montoDonacion: 5000 },
  { id: 3, texto: "Donar $10000", montoDonacion: 10000 },
  { id: 4, texto: "Donar $20000", montoDonacion: 20000 }
]

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
  const [valorMatriculaBase, setValorMatriculaBase] = useState(0);// Maneja el estado de la matricula base extraido de las condiciones de pago
  const [valorCarnet, setValorCarnet] = useState(0); // Maneja el estado del valor del radio button de las opciones de carnet
  const [valorDonaciones, setValorDonaciones] = useState(0);// Maneja el estado del valor del radio button de las opciones de donaciones
  const [valorFinanciado, setValorFinanciado] = useState(''); // Maneja el estado del valor del input numerico de valor a financiar
  const [valorFinanciadoRestarDebounced, setValorFinanciadoRestarDebounced] = useState(''); // Maneja el estado para actualizar despues el valor a financiar  despues de un lapso de tiempo es un debouncer
  const [total, setTotal] = useState(0); // Maneja el estado del total a pagar
  const [totalFinanciado, setTotalFinanciado] = useState(0); //Maneja el estadod del total a pagar menos el valor financiado
  const [ultimoCarnet, setUltimoCarnet] = useState(""); // Maneja el estado para validar el ultimo carnet que fue seleccionado
  const [entidadSeleccionada, setEntidadSeleccionada] = useState({}); // Maneja el estado del select de entidades financieras
  const [mostrarFormFinanciacion, setMostrarFormFinanciacion] = useState(false); // Maneja el estado para ver si se debe mostrar o no el fomulario de financiacion
  const { generarReciboPago } = useAxiosReciboPago(); // Funcion encargada de generar el recibo de pago
  const [mostrarDivCargando, setMostrarDivCargando] = useState(false);


  //Este Evento manda a generar el recibo por dentro invoca la funcion generarReciboPago
  const handleSubmit = async (e) => {
    e.preventDefault();

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

    if (mostrarFormFinanciacion && (valorFinanciado < 200000)) {
      setValorFinanciado(0);
      mostrarAlertaError("El valor minimo a financiar es de  $200.000");
      return;
    }

    try {
      //deshabilito el boton y desestructuro las propiedades
      setBtnGenerarIsDisabled(true);
      //const infoCondicionesPago = await obtenerCondicionesPago(programaSeleccionado[0], userData.UidEstudiante);
      const { IdArchivo, urlRecibo } = await generarReciboPago(userData, programaSeleccionado, infoCondicionesPagoPdf); // Genera el pdf

      //cambio el state del objeto infoRecibo y habilito el boton
      setInfoRecibo({ IdArchivo, urlRecibo });
      setValorFinanciado(0); //seteo 0 al valor financiado para que despues de generado el pdf se elimine el objeto de financiacion del state de infoCondicionesPagoPdf
      setBtnGenerarIsDisabled(false);

    } catch (error) {

      mostrarAlertaError("Ocurrio un fallo en el proceso de generar el recibo");
      setBtnGenerarIsDisabled(false);
    }

  }

  //esta funcion maneja el evento cuando se cambia el programa
  const handleChange = (e) => {
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
            console.log({ infoCondicionesPago });
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
      const condicionMatricula = infoCondicionesPago.filter(x => x.TipoCondicion === "MPRO");
      const condicionCarnet = infoCondicionesPago.filter(item => item.TipoCondicion.startsWith('I00'))
      const condicionDonacion = infoCondicionesPago.filter(x => x.TipoCondicion === "ZDON");
      setInfoCondicionesPagoPdf(condicionMatricula);
      setInfoCondicionesPagoPdf((prev) => [...prev, condicionCarnet[0]])
      setInfoCondicionesPagoPdf((prev) => [...prev, condicionDonacion[0]])
      setUltimoCarnet(condicionCarnet[0].TipoCondicion)
      setValorMatriculaBase(parseFloat(condicionMatricula[0].Importe))
      setValorCarnet(parseFloat(condicionCarnet[0].Importe))
      setTotal(parseFloat(condicionMatricula[0].Importe) + parseFloat(condicionCarnet[0].Importe))
    }
  }, [infoCondicionesPago])



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
      setTotalFinanciado(total); //inicio el state del totalFinanciado con el valor que tenga el state del total 
    } else {
      setTotalFinanciado(0);
      eliminarObjetoFinanciacion();
    }
  }, [mostrarFormFinanciacion])


  // Actualizar valorFinanciadoRestarDebounced después de que el usuario haya dejado de escribir durante medio segundo
  useEffect(() => {
    const handler = setTimeout(() => {
      setValorFinanciadoRestarDebounced(valorFinanciado);
    }, 1000);

    if (valorFinanciado === '' || valorFinanciado === 0) {
      eliminarObjetoFinanciacion();
    }

    return () => {
      clearTimeout(handler);
    };

  }, [valorFinanciado]);

  // Actualizar total solo cuando valorFinanciadoRestarDebounced cambia
  useEffect(() => {
    if (valorFinanciadoRestarDebounced === '') {
      setTotalFinanciado(total);   // Restablecer a la suma original cuando el campo de entrada está vacío
    } else {

      setTotalFinanciado(total - valorFinanciadoRestarDebounced); // al valor total le resta el valor financiado y se lo setea al state de totalFinanciado

      //Agrego el objeto de financiamiento al arreglo de condiciones de pagos pdf siempre y cuando el valor financiado sea mayor a 0
      if (mostrarFormFinanciacion && (valorFinanciado >= 200000)) {
        setInfoCondicionesPagoPdf((prev) => [...prev,
        {
          Signo: "-",
          DescripcionCondicion: entidadSeleccionada.desCondicion,
          Importe: `-${valorFinanciado.toString()}`,
          TipoCondicion: entidadSeleccionada.codCondicion,
          Cliente: infoCondicionesPagoPdf[0].Cliente,
          TipoImporte: "C"
        }])
      }

    }
  }, [valorFinanciadoRestarDebounced]);


  //cuando cambie el valor total actualizo el state del totalFinanciado
  useEffect(() => {
    if (mostrarFormFinanciacion) {
      setTotalFinanciado(total)
    }
  }, [total])


  //Maneja el onchange de los radio butons de carnet
  const handleAddValue = (value, carnet) => {
    const valNumber = parseFloat(value)
    setValorCarnet(valNumber);
    setTotal((prevTotal) => valorMatriculaBase + valNumber + valorDonaciones);
    //actualizo el estado de la condicion de pago de Carnet
    const nuevoEstadoCarnet = infoCondicionesPagoPdf.map(objeto => {
      if (objeto.TipoCondicion === ultimoCarnet) {
        return { ...objeto, ...carnet };
      }
      return objeto;
    });
    setInfoCondicionesPagoPdf(nuevoEstadoCarnet);
    setUltimoCarnet(carnet.TipoCondicion)
  };

  //Maneja el onchange de los radio butons de Donaciones
  const handleAddValue2 = (value) => {
    const valNumber = parseFloat(value)
    setValorDonaciones(valNumber);
    setTotal((prevTotal) => valorMatriculaBase + valNumber + valorCarnet);

    //actualizo el estado de la condicion de pago de Donaciones
    const nuevoEstadoDonacion = infoCondicionesPagoPdf.map(objeto => {
      if (objeto.TipoCondicion === 'ZDON') {
        return { ...objeto, Importe: value.toString() };
      }
      return objeto;
    });
    setInfoCondicionesPagoPdf(nuevoEstadoDonacion);

  };


  // Filtra el arreglo de infocondicionesPagoPdf para excluir los objetos con TipoCondicion 'ZDFI' o 'ZFCB' cuando no se quiera financiar
  const eliminarObjetoFinanciacion = () => {
    const arregloPdfNoFinanciado = infoCondicionesPagoPdf.filter(item => item.TipoCondicion !== 'ZDFI' && item.TipoCondicion !== 'ZFCB' && item.TipoCondicion !== undefined);
    setInfoCondicionesPagoPdf(arregloPdfNoFinanciado);
  }


  return (
    <>
      <link href="https://unpkg.com/tailwindcss@^2/dist/tailwind.min.css" rel="stylesheet" />

      <div className="container mx-auto px-4 py-10 bg-gray p-4" style={estiloFuentes}>
        <form onSubmit={handleSubmit} autoComplete="off" className="flex flex-col space-y-4 bg-white rounded-md shadow-md p-4">
          {/* <h1 className="text-3xl font-bold text-center mb-4">Generar Recibo</h1> */}

          <div className="flex items-center">
            <label style={estiloBadges} htmlFor="idPrograma" className="w-1/3 text-gray-700 font-medium">Programa:</label>
            <select
              className="flex-1 px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500"
              id="idPrograma"
              name="idPrograma"
              onChange={handleChange}
            >
              <option key={"0000"} value={"0000"} style={{ color: 'red' }}>
                --Selecciona un Programa--
              </option>
              {infoPrograma.map((prog) => (
                <option key={prog.ProgramaAcademicoID} value={prog.ProgramaAcademicoID}>
                  {prog.ProgramaAcademicoID}
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
              {infoCondicionesPago.map((item, index) => {
                if (item.TipoCondicion === 'MPRO') {
                  return <fieldset key={index} className="border-2 border-gray-400 rounded-lg p-4 shadow-lg">
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
                        <tr>
                          <td className="border border-gray-400 p-2">{item.DescripcionCondicion}</td>
                          <td className="border border-gray-400 p-2">{item.TipoCondicion}</td>
                          <td className="border border-gray-400 p-2">{item.Importe}</td>
                        </tr>
                      </tbody>
                    </table>
                  </fieldset>
                }
              })}
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
                                <input type="radio" name="rbtCarne" checked={isItemInOtherList} onChange={() => handleAddValue(item.Importe, item)} />
                                <label>{item.DescripcionCondicion}</label>
                              </td>
                              <td className="border border-gray-400 p-2">
                                <label>${item.Importe}</label>
                              </td>
                            </tr>
                          )
                        }
                      })
                    }
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
                              <input type="radio" name="rbtDonacion" checked={isItemInOtherList} onChange={() => handleAddValue2(item.montoDonacion)} />
                              <label>{item.texto}</label>
                            </td>
                            <td className="border border-gray-400 p-2">
                              <label>${item.montoDonacion}</label>
                            </td>
                          </tr>
                        )
                      })
                    }
                    <tr>
                      <td>Valor a Pagar</td>
                      <td>{total}</td>
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
                    <option key={"0000"} value={"0000"} style={{ color: 'red' }}>
                      --Selecciona una entidad --
                    </option>
                    {lstEntidadFinanciacion.map((entidad) => (
                      <option key={entidad.idEntidad} value={entidad.codCondicion}>
                        {entidad.texto}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center mt-3 mb-3" >

                  <span className="mr-3">
                    <input type="radio" name="rbtFinanciacion" onChange={() => setMostrarFormFinanciacion(true)} />
                    <label>Parcial</label>
                  </span>

                  <span className="ml-3">
                    <input type="radio" checked={!mostrarFormFinanciacion} name="rbtFinanciacion" onChange={() => setMostrarFormFinanciacion(false)} />
                    <label>No</label>
                  </span>

                </div>

                {
                  (mostrarFormFinanciacion) &&
                  <div>
                    <div className="flex items-center">
                      <label style={estiloBadges} htmlFor="idPrograma" className="w-1/3 text-gray-700 font-medium">Valor a Financiar:</label>
                      <input type="number" min={0} max={total} value={valorFinanciado} className="flex-1 px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500" placeholder="Ingrese el valor" onChange={(e) => setValorFinanciado(e.target.value)} />
                    </div>

                    <div className="flex items-center">
                      <label style={estiloBadges} htmlFor="idPrograma" className="w-1/3 text-gray-700 font-medium">Valor a pagar descontando financiación:</label>
                      <input type="number" readOnly className="flex-1 px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500" placeholder="Ingrese el valor" value={totalFinanciado} />
                    </div>
                  </div>

                }


              </fieldset>
              <pre>{JSON.stringify(infoCondicionesPagoPdf)}</pre>
            </div>
          }


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
            <div className="flex items-center py-6">
              <iframe src={infoRecibo.urlRecibo} width="600" height="400"></iframe>
            </div>
          }


        </form>
      </div>

    </>)
}


