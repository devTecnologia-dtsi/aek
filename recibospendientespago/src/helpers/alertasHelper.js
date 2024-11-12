import Swal from "sweetalert2";

export const mostrarAlertaError = (mensaje = '',duracionMilisegundo=5000) => {
    //MUESTRO ALERTA DE FALLO
    Swal.fire({
        icon: "error",
        title: `<h2>${mensaje}</h2>`,
        timer: duracionMilisegundo,
      })
}

export const mostrarAlertaExito = (mensaje = '',duracionMilisegundo=5000) => {
    //MUESTRO ALERTA DE EXITO 
    Swal.fire({
        icon: "success",
        title: `<h2>${mensaje}</h2>`,
        timer: duracionMilisegundo,
    });
}