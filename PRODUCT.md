# Product

## Register

product

## Users

Cuatro grupos con la misma tarea: dejar sus imágenes más livianas sin complicarse.

- **Personas no técnicas:** emprendedores, community managers y docentes que suben fotos a su web, tienda o aula
  virtual, y no saben (ni quieren saber) qué es WebP.
- **Desarrolladores:** optimizan los assets de un sitio y quieren algo rápido, por lotes y privado.
- **Diseñadores:** entregan a sus clientes imágenes optimizadas sin abrir otra herramienta.
- **Uso interno:** el equipo de Iteraciona y sus clientes.

Contexto típico: tienen una carpeta con fotos pesadas, poco tiempo y desconfianza hacia los conversores en línea, por
los anuncios y porque no saben a dónde van sus archivos.

## Product Purpose

Liviana convierte imágenes (JPG, PNG, GIF, AVIF, BMP, TIFF, SVG) a WebP dentro del navegador. No se sube nada, no hay
cuentas y no hay esperas. Se pueden convertir varias imágenes a la vez, con cuatro niveles de calidad o un control
manual, y descargarlas una por una o en ZIP.

Éxito: la persona suelta sus imágenes, ve cuánto pesaban y cuánto pesan ahora, descarga y se va confiada. Sabe que sus
fotos nunca salieron de su computadora y quiere volver.

## Brand Personality

**Precisa, cercana, liviana.**

- Precisa: la herramienta dice cifras exactas (KB antes y después, porcentaje ahorrado) y no exagera.
- Cercana: habla en español claro, de tú, sin jerga técnica. "WebP" se explica con hechos, no con siglas.
- Liviana: nada sobra. La interfaz pesa poco, igual que los archivos que entrega.

Emociones objetivo, en orden de llegada: **alivio** (fue fácil), **confianza** (mis fotos no salieron de aquí),
**satisfacción** (el ahorro se ve como un logro) y **encanto** (un detalle que se recuerda).

Referencia: Squoosh, de Google, por cómo hace visible el resultado: comparación en vivo y la cifra exacta.

## Anti-references

- **Conversores con anuncios** (iLoveIMG, Convertio y parecidos): ruido, banners, botones de descarga engañosos,
  muros de registro.
- **SaaS genérico:** hero con degradado morado, grillas de tarjetas idénticas, métricas gigantes sin contexto.
- **Herramienta de terminal:** modo oscuro frío y técnico que excluye a quien no es desarrollador.
- **Infantil o caricaturesco:** mascotas, confeti exagerado, colores chillones.

## Design Principles

1. **Practica lo que predicas.** Una herramienta que aligera imágenes no puede ser pesada: poco JavaScript, cero
   adornos que cuesten bytes sin aportar.
2. **Muestra el peso, no lo describas.** El ahorro se ve (antes y después, barras, cifras), no se promete con
   adjetivos.
3. **La privacidad se demuestra.** El mensaje "nada sale de tu navegador" debe sentirse en la interfaz (sin
   barras de subida, todo instantáneo), no solo leerse.
4. **El encanto premia el logro.** Los momentos de delight aparecen cuando la persona termina algo (convertir,
   descargar), nunca estorban la tarea.
5. **Claro para quien no sabe, rápido para quien sí.** Valores por defecto sensatos para el principiante; lotes,
   teclado y ZIP para el experto.

## Accessibility & Inclusion

- WCAG 2.2 AA: texto ≥ 4.5:1, componentes de interfaz ≥ 3:1, foco visible, todo operable con teclado (incluida la
  zona de arrastre).
- Estados anunciados a lectores de pantalla (progreso de conversión, errores, descarga lista) con regiones `aria-live`.
- `prefers-reduced-motion`: toda animación tiene una alternativa sin desplazamiento (fundido o instantánea).
- El color nunca es la única señal: errores y éxitos llevan texto o ícono.
