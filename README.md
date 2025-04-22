# Documento de Gestión de Configuración
El presente documento tiene como objetivo establecer los lineamientos a seguir para la gestión de la configuración del proyecto, a lo largo del desarrollo de la materia Ingeniería y calidad de software.
El documento de gestión de configuración se encuentra en el directorio raíz del repositorio y por una disposición del repositorio remoto que estamos utilizando debe de llamarse "README.md". De esta manera se puede tener siempre visible el documento de gestión de configuración de una forma rápida y sencilla.

## Estructura de directorios
Hemos propuesto la siguiente estructura de directorios en base a el desarrollo del producto de software propuesto.

```
├── api_docs
├── codigo_fuente
│   ├── backend
│   ├── frontend
├── diseño
│   ├── prototipos
│   ├── arquitectura
├── infraestructura
├── pruebas
├── requerimientos
├── seguimiento_supervision
│   ├── minutas
│   ├── reportes
```

## Listado de ítems de configuración

| Tipo               | Regla de nombrado | Extensión          | Ubicación                          |
|--------------------|---------|--------------------|------------------------------------|
| Documentacion API       | API_<\<apiConsumida\>>.<\<ext\>>  | PDF                | /api_docs                      |
| Prototipos       | PRO_<\<nombrePantalla\>>.<\<ext\>>    | JPG, PNG, PDF, SVG         | /diseño/prototipos           |
| Arquitectura      | ARQ_<\<nombreDiagrama\>>.<\<ext\>>   | PDF     | /diseño/arquitectura           |
| Pruebas | PRUEBA_PLAN_<\<numeroEntregable\>>.<\<ext\>>    | XLSX     | /pruebas           |
| Diagrama        | DIAG_<\<nombreDiagrama\>>.<\<ext\>>     | DRAWIO                | *                     |
| Requerimientos   | REQ_<\<nombreDocumento\>>.<\<ext\>>      | PDF    | /requerimientos           |
| Minutas | MIN_DD_MM_AA_.<\<ext\>>      | PDF          | /seguimiento_supervision/minutas              |
| Reportes            | REP_<\<TPX\>>_<\<EX\>>.<\<ext\>>     | PDF          | /seguimiento_supervision/reportes             |
| Manuales               | MAN_<\<nombreManual\>>.<\<ext\>>    | PDF                | /seguimiento_supervision                 |
| Imagen               | IMG_<\<nombreItem\>>.<\<ext\>>    | PNG, JPG                | *                 |
| Documentación código               | COD_<\<nombreDocumento\>>.<\<ext\>>    | PDF, DOCX                | /codigo_fuente                |


### Regla de nombrado

**Reglas Específicas**
- **Reportes:** Se incluye el numero de TP y numero de entrega
  - Ejemplo: `REP_TP1_E1.pdf`
- **Pruebas:** Se incluye el numero de entrega
  - Ejemplo: `PRUEBA_PLAN_E0.pdf`


\* Los items de tipo diagrama e imagen pueden estar ubicados en cualquier carpeta


## Glosario

|Sigla | Descripción|
|---|---|
|SCM| Gestión de Configuración del Software|
|TP| Trabajo Práctico|
|API| Interfaz de Programacion de Aplicaciones|
|ISW | Ingeniería y Calidad de Software|
|US| User Stories|
|PRO| Prototipo|
|ARQ| Arquitectura|
|REP| Reportes|
|MAN| Manual|
|MIN| Minutas|
|DIAG| Diagramas|
|REQ| Requerimientos|
|COD| Código|


## Criterio de Línea Base
Se establecerá una línea base luego de la entrega presencial de cada trabajo practico, la cual se realizará sobre la rama “main” del repositorio. 
Decidimos utilizar este criterio ya que creemos que luego de cada corrección brindada por las profesoras de la cátedra, el proyecto se encontrará en una versión estable.

## Enlace al repositorio
Para el control de versiones se utilizará el sistema de control de versiones distribuido [Git](https://git-scm.com/).
El repositorio se encuentra alojado en [GitHub](https://github.com/matuser/isw-grupo3): https://github.com/matuser/isw-grupo3
