import React, { useState } from "react";
import { useAxiosReciboPendientes } from "../../hooks/useAxiosReciboPendientes";
import { useAxiosDatosPersonales } from "../../hooks/useAxiosDatosPersonales";
import { urlPagoPSE } from "../../helpers/serviciosUrl";

//DEFINO LOS ESTILOS
const estiloFuentes = {
  fontFamily: 'Helvetica',
  fontSize: '12px'
};

const estiloBadges = {
  backgroundColor: '#779B00',//'#2C3A49',
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
  backgroundColor: '#4F6175',
  color: 'white'
}

export default Screen = () => {

  //Manejara el estado para ver si se hizo hover sobre un elemento
  const [isHovered, setIsHovered] = useState(false);
  const [isHoveredPse, setIsHoveredPse] = useState(false);

  const { userData } = useAxiosDatosPersonales();
  const { idUser, recibos, cargando } = useAxiosReciboPendientes(userData);

  if (cargando) {
    return (<h2 style={estiloBadges}>...cargando</h2>)
  }

  return (
    <>
      <link href="https://unpkg.com/tailwindcss@^2/dist/tailwind.min.css" rel="stylesheet" />

      {
        recibos.length > 0 ? (
          <div className="container mx-auto px-4 py-5 bg-gray p-2" style={estiloFuentes}>
            <div className="flex flex-col space-y-4 bg-white rounded-md shadow-md p-4">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Número de Factura
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Descargar
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Pago PSE
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {
                    recibos.map(recibo => (
                      <tr key={recibo.NOMBREPDF}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          FACTURA - {recibo.FACTURA.trimStart().replace(/^0+/g, "")}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <a href={recibo.RUTA} onMouseEnter={() => setIsHovered(true)}
                            onMouseLeave={() => setIsHovered(false)} style={isHovered ? estiloHover : estiloBase}
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" download={recibo.NOMBREPDF}>
                            Descargar
                          </a>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <a href={`${urlPagoPSE}${recibo.IDPSE}`} onMouseEnter={() => setIsHoveredPse(true)}
                            onMouseLeave={() => setIsHoveredPse(false)} style={isHoveredPse ? estiloHover : estiloBase}
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                            Pago PSE
                          </a>
                        </td>
                      </tr>
                    ))
                  }
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="container mx-auto px-4 py-5 bg-gray p-2">
            <div className="flex flex-col space-y-4 bg-white rounded-md shadow-md p-4" style={estiloFuentes}>
              <h2>No se encontraron recibos</h2>
            </div>
          </div>
        )
      }


    </>
  );



}
