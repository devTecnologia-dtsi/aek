import React, { useEffect, useState } from "react";
import { fetchData } from "../services/service";
import { FcSearch } from "@react-icons/all-files/fc/FcSearch";


const Filtros = ({
    ctx,
    bannerId,
    sedes,
    setSedes,
    rectorias,
    setRectorias,
    sede,
    rectoria,
    setSede,
    setRectoria,
    areas,
    setAreas,
    area,
    setArea,
    filtrarEventos
}) => {
    // const
    const urlDigibee = "https://uniminuto.test.digibee.io/pipeline/uniminuto/v1"
    // const urlDigibee = "https://uniminuto.api.digibee.io/pipeline/uniminuto/v1"
    const urlEstudiantes = "https://comunidad.uniminuto.edu/estudiantes"
    const urlEventos = "https://registros.uniminuto.edu/api_eventos_test"
    // const urlEventos = "https://registros.uniminuto.edu/api_eventos"
    // const urlEventos = "http://localhost/api_eventos"

    // states
    const [disabledRec, setDisabledRec] = useState(true)
    const [disabledSede, setDisabledSede] = useState(true)
    const [disabledArea, setDisabledArea] = useState(true)
    const headers = {
        'apikey': '5H9CcvkLZJTgPDDCXTXTI7KC90k6prl0', // pruebas
        // 'apikey': 'ITnjVcrLWfYpY2B246EcrWO6Hln3LD7a',
        'Content-Type': 'application/json'
    }

    useEffect(() => {
        obtenerRectorias()
        obtenerAreas()
    }, [])

    const obtenerRectorias = async () => {
        try {
            const result = await fetchData({ url: `${urlDigibee}/servicios-banner/obtenerRectorias`, headers })
            setRectorias(JSON.parse(result.body))

            const resultadoEstudiante = await fetchData({ url: `${urlEstudiantes}/Estudiantes/ProgramasAll/${bannerId}` })
            const ultimoResultadoEstudiante = resultadoEstudiante[resultadoEstudiante.length - 1]

            const codRectoria = JSON.parse(result.body).filter((rectoria) => rectoria.DESCRIPCION == ultimoResultadoEstudiante.descRectoria)
            // const codRectoria = JSON.parse(result.body).filter((rectoria) => rectoria.DESCRIPCION == "R CENTRO SUR")
            if (codRectoria.length > 0) {
                setRectoria(codRectoria[0].CODIGO)
                // se busca la sede y se busca el codigo de la sede a la que pertenece
                const resultSede = await obtenerSedes(codRectoria[0].CODIGO)
                const codigoSede = JSON.parse(resultSede.body).filter((sede) => sede.DESCRIPCION == ultimoResultadoEstudiante.sede)
                if (codigoSede.length > 0) {
                    setSede(codigoSede[0].CODIGO)
                }
                setSedes(JSON.parse(resultSede.body))
            }
            setDisabledRec(false)
            setDisabledSede(false)
        } catch (error) {
            console.log(`error ${error}`)
        }
    }

    const obtenerSedes = async (codRectoria) => {
        const result = await fetchData({ url: `${urlDigibee}/servicios-banner/obtenerSedes?rectoria=${codRectoria}`, headers })
        return result
    }

    const changeSedes = async (e) => {
        e.persist();
        setDisabledSede(true)
        const nuevaRectoria = rectorias.filter(({ CODIGO }) => CODIGO == e.target.value)
        setRectoria(nuevaRectoria[0].CODIGO)
        const resultSedes = await obtenerSedes(e.target.value)
        setSedes(JSON.parse(resultSedes.body))
        setDisabledSede(false)
    }

    const obtenerAreas = async () => {
        setDisabledArea(true)
        const result = await fetchData({ url: `${urlEventos}/select/index.php?fn=consultarArea` })
        setAreas(result)
        setDisabledArea(false)
    }
    return (
        <div className="container mt-2">
            <div className="row">
                <div className="col-6">
                    <select className="form-select form-select-sm" aria-label=".form-select-sm" value={rectoria} disabled={disabledRec} onChange={(e) => changeSedes(e)}>
                        <option value="">
                            {disabledRec ? 'Cargando Rectorias...' : 'Seleccione una Rectoria'}
                        </option>
                        {
                            rectorias.length != 0 ?
                                rectorias.map(({ CODIGO, DESCRIPCION }) => <option key={CODIGO} value={CODIGO}>{DESCRIPCION}</option>)
                                :
                                ""
                        }
                    </select>
                </div>
                <div className="col-6">
                    <select className="form-select form-select-sm" aria-label=".form-select-sm" value={sede} disabled={disabledSede} onChange={(e) => setSede(e.target.value)}>
                        <option value="">
                            {disabledSede ? 'Cargando Sedes...' : 'Seleccione una Sede'}
                        </option>
                        {
                            sedes.length != 0 ?
                                sedes.map(({ CODIGO, DESCRIPCION }) => <option key={CODIGO} value={CODIGO}>{DESCRIPCION}</option>)
                                :
                                ""
                        }
                    </select>
                </div>
                <div className="col-6 mt-2">
                    <div className="input-group input-group-sm">
                        <span className="input-group-text" id="inputGroup-sizing-sm"><FcSearch /> </span>
                        <input type="text" className="form-control" placeholder="Buscar evento" aria-describedby="inputGroup-sizing-sm" onChange={(e) => filtrarEventos(e)} />
                    </div>
                </div>
                <div className="col-6 mt-2">
                    <select className="form-select form-select-sm" aria-label=".form-select-sm" value={area} disabled={disabledArea} onChange={(e) => setArea(e.target.value)}>
                        <option value="">
                            {disabledArea ? 'Cargando Areas...' : 'Seleccione una Area'}
                        </option>
                        {
                            areas.length != 0 ?
                                areas.map(({ codigo, descripcion, id }) => <option key={codigo} value={id}>{descripcion}</option>)
                                :
                                ""
                        }
                    </select>
                </div>
            </div>
        </div>
    )
}

export default Filtros;