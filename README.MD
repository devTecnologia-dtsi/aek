## Ambiente Local
Para configurar el ambiente local, es necesario utilizar una consola CMD, ya que es la única compatible con los comandos de campusM.

1) En la raíz del proyecto, abre la consola y ejecuta el siguiente comando para establecer las opciones de Node.js:
```bash
    set NODE_OPTIONS=--openssl-legacy-provider
```

2) Ejecuta el comando aek start para iniciar el proyecto en modo local:
```bash
    aek start
```

## DESPLIEGUE A SANDBOX O PROD
Para el despliegue en sandbox o producción, también es necesario utilizar una consola CMD.

1) En la raíz del proyecto, ejecuta uno de los siguientes comandos:
Para proyectos nuevos que no se han desplegado previamente en sandbox o producción:
```bash
    aek deploy
```
O para proyectos que ya han sido desplegados anteriormente:
```bash
    aek start -n
```
2) Una vez ejecutado el comando, sigue los pasos que aparezcan en la consola. Aquí podrás seleccionar el ambiente deseado para la publicación.


## INFORMACION AEKS
|-----------------------------|------------------------|-------------------------------|----------------------------|
| Nombre AEK                  |    Responsable         |   Fecha ultima publicacion    |   Fecha ultima publicacion |
|                             |                        |         sandbox               |        producción          |
|-----------------------------|------------------------|-------------------------------|----------------------------|
|Aulas Virtuales              |Andres Felipe Lopez M   |         12/06/2025            |          13/06/2025        |
|-----------------------------|------------------------|-------------------------------|----------------------------|
|Datos Academicos             |Andres Felipe Lopez M   |         30/10/2024            |          20/11/2024        |
|-----------------------------|------------------------|-------------------------------|----------------------------|
|Eventos                      |Andres Felipe Lopez M   |         08/10/2025            |          18/12/2024        |
|-----------------------------|------------------------|-------------------------------|----------------------------|
|Fotografía                   |Andres Felipe Lopez M   |         30/10/2024            |          20/11/2024        |
|-----------------------------|------------------------|-------------------------------|----------------------------|
|Intregracionminu             |Andres Felipe Lopez M   |         28/02/2025            |          28/02/2025        |
|-----------------------------|------------------------|-------------------------------|----------------------------|
|Postulaciones                |Andres Felipe Lopez M   |         30/10/2024            |          20/11/2024        |
|-----------------------------|------------------------|-------------------------------|----------------------------|