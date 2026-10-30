# Feliz Cumpleanos

Pagina web interactiva para regalar una felicitacion de cumpleanos de forma creativa. El proyecto presenta una pantalla inicial con animaciones, un boton de apertura y una segunda vista con flores animadas y un mensaje final.

[Ver demo en GitHub Pages](https://henrydann.github.io/Cumplea-os/)

![GitHub Pages](https://img.shields.io/badge/GitHub%20Pages-deployed-2ea44f?style=for-the-badge&logo=github)
![HTML](https://img.shields.io/badge/HTML-5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS](https://img.shields.io/badge/CSS-3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-ES6-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![Sass](https://img.shields.io/badge/Sass-SCSS-CC6699?style=for-the-badge&logo=sass&logoColor=white)

## Descripcion

**Feliz Cumpleanos** es una experiencia web estatica pensada como detalle digital. La pagina inicia con un ambiente nocturno, imagenes animadas de Snoopy y un texto introductorio. Al presionar el boton principal, el usuario accede a una escena floral animada con el mensaje de cumpleanos.

El proyecto esta construido solo con tecnologias web base, por lo que puede abrirse directamente en el navegador o publicarse facilmente en GitHub Pages.

## Caracteristicas

- Pantalla inicial con animaciones visuales.
- Boton de acceso a la sorpresa principal.
- Escena de flores animadas con CSS.
- Mensaje renderizado con efecto progresivo mediante JavaScript.
- Recursos graficos incluidos en el repositorio.
- Despliegue automatico en GitHub Pages mediante GitHub Actions.
- Proyecto ligero, sin frameworks ni dependencias externas.

## Tecnologias

- **HTML5** para la estructura de las vistas.
- **CSS3** para estilos y animaciones.
- **SCSS/Sass** como fuente de estilos para la escena floral.
- **JavaScript** para efectos de texto y carga.
- **GitHub Pages** para publicacion.

## Estructura Del Proyecto

```text
.
|-- .github/workflows/static.yml  # Workflow de despliegue en GitHub Pages
|-- css/
|   |-- index.css                 # Estilos de la pantalla inicial
|   `-- style.css                 # Estilos compilados de la escena floral
|-- images/
|   |-- gift.png                  # Icono del sitio
|   |-- snoopy1.gif               # Animacion decorativa
|   |-- snoopy2.gif               # Animacion decorativa
|   `-- snoopy3.gif               # Animacion decorativa
|-- js/
|   |-- index.js                  # Texto animado de la pantalla inicial
|   `-- main.js                   # Animacion del mensaje final
|-- scss/
|   `-- style.scss                # Estilos fuente en SCSS
|-- flower.html                   # Vista principal de flores
|-- index.html                    # Pagina de entrada
`-- README.md
```

## Como Ejecutarlo Localmente

No necesitas instalar dependencias.

1. Clona el repositorio:

```bash
git clone https://github.com/henryDann/Cumplea-os.git
```

2. Entra a la carpeta:

```bash
cd Cumplea-os
```

3. Abre `index.html` en tu navegador.

Tambien puedes usar una extension como **Live Server** en Visual Studio Code para trabajar con recarga automatica.

## Flujo De La Pagina

1. `index.html` muestra la portada con animaciones y el boton **ABRE**.
2. El boton dirige a `flower.html`.
3. `flower.html` carga la escena floral y muestra el mensaje final con animacion.

## Personalizacion

Puedes adaptar el proyecto rapidamente modificando estos archivos:

| Elemento | Archivo |
| --- | --- |
| Texto inicial | `js/index.js` |
| Mensaje final | `js/main.js` |
| Imagenes decorativas | `images/` |
| Estilos de portada | `css/index.css` |
| Estilos de flores | `scss/style.scss` o `css/style.css` |
| Titulo de la pagina | `index.html` y `flower.html` |

Ejemplo para cambiar el texto inicial:

```js
const text = 'te tengo un regalo'.split('')
```

Ejemplo para cambiar el mensaje final:

```js
const titles = ('Feliz Cumpleanos').split('')
```

## Despliegue

El repositorio incluye un workflow en `.github/workflows/static.yml` que publica el contenido estatico en GitHub Pages cada vez que se actualiza la rama `main`.

URL de produccion:

```text
https://henrydann.github.io/Cumplea-os/
```

## Recomendaciones De Mejora

- Corregir textos internos y titulos para que reflejen mejor el proposito del proyecto.
- Agregar una captura o GIF de vista previa al README.
- Separar estilos en archivos mas pequenos para facilitar mantenimiento.
- Revisar la codificacion de caracteres para mostrar correctamente la palabra "Cumpleanos" con caracteres especiales si se desea.
- Agregar una licencia si el proyecto sera publico y reutilizable.

## Autor

Desarrollado por [William Medina](https://github.com/WILLIAMMDN).
