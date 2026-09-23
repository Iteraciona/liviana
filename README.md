# Liviana

Convierte tus imágenes a **WebP** directamente en el navegador. Arrastras tus fotos, eliges la calidad y descargas los archivos más livianos. Tus imágenes **nunca salen de tu computadora**: no se suben a ningún servidor.

## ✨ Qué hace

- **Conversión a WebP en tu navegador**: todo el proceso ocurre en tu equipo, sin subir nada a internet.
- **Varias imágenes a la vez**: arrastra y suelta, o haz clic para elegir tus archivos.
- **Calidad a tu medida**: cuatro niveles listos para usar o un control manual del 10 % al 100 %.
- **Descarga individual o en ZIP**: baja cada imagen por separado o todas juntas en `imagenes-webp.zip`.
- **Ahorro visible**: muestra cuánto pesaba cada imagen y cuánto pesa ahora.
- **Respeta la transparencia**: los PNG y SVG con fondo transparente lo conservan.

### Formatos aceptados

JPG, PNG, WebP, GIF, BMP, AVIF, TIFF y SVG. Cada imagen puede pesar hasta **40 MB**.

### Niveles de calidad

| Nivel | Calidad | Recomendado para |
|---|---|---|
| Máxima | 95 % | Impresión o retoque |
| **Alta** (por defecto) | 85 % | Uso general en la web |
| Equilibrada | 72 % | Archivos notablemente más livianos |
| Ligera | 55 % | Miniaturas y vistas previas |

## 📖 Cómo se usa

1. Abre Liviana en tu navegador.
2. Arrastra tus imágenes al recuadro (o haz clic para elegirlas).
3. Elige el nivel de calidad.
4. Convierte y descarga tus imágenes, una por una o todas en un ZIP.

> Funciona en cualquier navegador moderno (Chrome, Edge, Firefox, Safari). Si tu navegador no puede generar WebP, Liviana te lo indicará.

## 🚀 Instalarlo en tu computadora

Solo lo necesitas si quieres ejecutar tu propia copia de Liviana.

### Requisitos

- [Node.js](https://nodejs.org/) 20.19 o superior (se recomienda la versión 22 LTS)
- npm (viene incluido con Node.js)

### Pasos

```sh
# 1. Instala las dependencias
npm install

# 2. Crea tu archivo de configuración
cp .env.example .env

# 3. Inicia la aplicación
npm run dev
```

Listo. Abre **http://localhost:3117** en tu navegador.

### Publicarlo en un servidor

```sh
npm run build
npm start
```

La aplicación queda disponible en el puerto `3117`. Si necesitas otro puerto, indícalo así:

```sh
PORT=8080 npm start
```

### Comandos disponibles

| Comando | Qué hace |
|---|---|
| `npm run dev` | Inicia el modo desarrollo en `http://localhost:3117` |
| `npm run build` | Genera la versión para producción en la carpeta `build/` |
| `npm run preview` | Muestra la versión de producción en `http://localhost:3117` |
| `npm start` | Ejecuta la versión de producción con Node.js |
| `npm run check` | Revisa los tipos y errores del código |

## 🛠️ Tecnologías

| Tecnología | Uso |
|---|---|
| SvelteKit 2 + Svelte 5 | Aplicación web |
| Tailwind CSS 4 | Estilos |
| GSAP | Animaciones |
| Canvas API | Conversión de imágenes en el navegador |
| Node.js (`adapter-node`) | Servidor de producción |

## 📁 Estructura del proyecto

```
src/
├── lib/
│   ├── components/site/
│   │   ├── converter/      # Zona de arrastre, selector de calidad y lista de imágenes
│   │   └── legal/          # Plantilla de las páginas legales
│   ├── services/
│   │   ├── converter.ts    # Conversión a WebP con Canvas
│   │   └── zip.ts          # Empaquetado de las descargas en ZIP
│   ├── stores/             # Estado de la cola de conversión
│   └── utils/              # Formatos aceptados, niveles de calidad y utilidades
└── routes/(site)/
    ├── +page.svelte        # Página principal con el conversor
    ├── terminos/           # Términos y condiciones
    └── privacidad/         # Política de privacidad
static/                     # Íconos, manifiesto y robots.txt
```

## 🔒 Privacidad

Liviana no recopila datos personales, no usa cookies y no guarda tus imágenes. Todo se procesa en tu navegador. Más detalles en las páginas [`/privacidad`](src/routes/(site)/privacidad/+page.svelte) y [`/terminos`](src/routes/(site)/terminos/+page.svelte).

## 📄 Licencia

Liviana se distribuye bajo la licencia [MIT](LICENSE). Puedes usarla, copiarla, modificarla y distribuirla libremente, siempre que conserves el aviso de copyright.

---

Hecho por [Iteraciona](https://iteraciona.com).
