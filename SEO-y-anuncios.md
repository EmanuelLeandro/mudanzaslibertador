# SEO y anuncios: Mudanzas Libertador BA

> **Antes que nada:** nadie puede garantizar el puesto #1 en Google. Google decide el orden según cientos de señales, y las más fuertes para un negocio local (la ficha de Google, las reseñas, la antigüedad del dominio y los enlaces de otros sitios) **se construyen fuera de la web**. Lo que sí hicimos es dejar el sitio técnicamente impecable, con contenido útil y una página para cada búsqueda importante. El resto depende de los pasos de la sección 3, y de tiempo: en general se ven resultados en 2 a 6 meses.

---

## 1. Qué se hizo en el sitio

### Investigación de palabras clave
- `keywords.csv` tiene unas 80 búsquedas reales (sacadas del autocompletado de Google Argentina, las preguntas frecuentes de los buscadores y la competencia), cada una con su intención y la página que la atiende.
- Las más importantes: **mudanzas zona norte**, **mudanzas caba**, **fletes caba / zona norte**, **flete chico caba**, **izaje de muebles (por balcón)**, **mudanzas al interior del país**, **mudanzas a la costa atlántica / mar del plata desde capital**, **mudanzas en cuotas**, **embalaje mudanza / kit de embalaje**, **cuánto cuesta una mudanza en caba**, y las de barrio (**mudanzas belgrano / núñez / palermo / vicente lópez / olivos / san isidro / tigre**).

### Páginas nuevas (14 en total)
| Página | Apunta a |
|---|---|
| `index.html` | mudanzas y fletes CABA y Zona Norte, presupuesto de mudanza |
| `izaje-de-muebles-por-soga.html` | izaje de muebles, izaje por balcón |
| `mudanzas-de-oficinas.html` | mudanza de oficina |
| `fletes.html` | fletes CABA / zona norte, flete chico |
| `embalaje-y-armado-de-muebles.html` | embalaje mudanza, kit de embalaje, desarme y armado |
| `mudanzas-al-interior-y-a-la-costa.html` | mudanzas al interior, a la Costa (Mar del Plata no se nombra: sin fuente) |
| `mudanzas-en-cuotas.html` | mudanzas en cuotas, financiación, "mudanzas económicas" |
| `mudanzas-caba.html` | mudanzas CABA, cuánto cuesta una mudanza en CABA |
| `mudanzas-zona-norte.html` | mudanzas zona norte |
| `mudanzas-belgrano-nunez.html` | mudanzas Belgrano, Núñez, Saavedra |
| `mudanzas-palermo.html` | mudanzas Palermo |
| `mudanzas-vicente-lopez-olivos.html` | mudanzas Vicente López, Olivos |
| `mudanzas-san-isidro-martinez.html` | mudanzas San Isidro, Martínez |
| `mudanzas-tigre-san-fernando.html` | mudanzas Tigre, San Fernando (SIN FUENTE: noindex y fuera del sitemap hasta confirmar) |

Cada página tiene su propio título, descripción, H1, texto, preguntas frecuentes y cotizador. Cuando la consulta llega por WhatsApp dice desde qué página vino (por ejemplo "Consulta: Izaje por soga"). Todas se enlazan entre sí: servicios, zonas cercanas, "También te puede servir" y el pie de página.

**⚠️ Para confirmar con el dueño:** las páginas de barrio y partido (Belgrano y Núñez, Palermo, Vicente López y Olivos, San Isidro y Martínez, Tigre y San Fernando) tienen un comentario en el código. Hay que **mantenerlas solo si confirma que trabaja ahí**. Si no, se borran y se sacan de `sitemap.xml` y del pie. Pilar, Escobar y San Martín no tienen página propia hasta que lo confirme.

### SEO técnico (todo "white-hat")
- Títulos de menos de 70 caracteres y descripciones de alrededor de 155, únicos en cada página. Un solo H1 por página, con la palabra clave escrita de forma natural.
- Datos estructurados (schema.org): `MovingCompany` con zonas atendidas, servicios, teléfono, email e Instagram; `FAQPage` en todas las páginas; `Service` en cada landing; `BreadcrumbList` (la ruta Inicio › Servicios › Página) y `WebSite`.
- Preguntas frecuentes respondidas **solo con datos reales** (precio cerrado, cuotas, izaje, embalaje, vehículos, zonas). No hay precios, años de experiencia ni reseñas inventadas.
- `sitemap.xml` y `robots.txt`, URL canónica en cada página, Open Graph para que el link se vea lindo al compartirlo en WhatsApp e Instagram, y textos alternativos en todas las fotos.
- Velocidad: la foto principal se carga primero y en webp liviano (unos 37 KB), el resto de las imágenes carga a medida que bajás, y las tipografías no bloquean el texto (`display=swap`). No hay librerías pesadas: es HTML, CSS y un JS chico.
- Sin trampas: nada de texto oculto, relleno de palabras clave ni páginas "puerta" vacías. Cada página tiene contenido distinto y útil.

### Preparado para anuncios
- En el `<head>` de cada página están comentados el **Google tag (GA4 + Google Ads)** y el **Meta Pixel**. Para activarlos se descomentan y se ponen los IDs reales.
- En `assets/js/main.js`, el objeto `ADS` es para cargar el ID `AW-...` y los labels de conversión.
- Eventos que ya se disparan solos:
  - clic en WhatsApp → `contact` (GA4), conversión de Google Ads con el label `whatsapp`, `Contact` (Meta)
  - clic en el teléfono → `contact` / label `phone` / `Contact`
  - envío del cotizador → `generate_lead` / label `quote` / `Lead`
  - además, todo se manda a `dataLayer` (`ml_whatsapp`, `ml_phone`, `ml_quote`) por si después usan Google Tag Manager.
- **De qué anuncio vino cada cliente:** si la visita llega con `utm_source` (o con `gclid` de Google o `fbclid` de Meta), el mensaje de WhatsApp termina con, por ejemplo, **"Vengo de: Google (anuncio) · izaje"**. Así el dueño ve en el chat qué anuncio funciona. El dato se guarda mientras la persona navega por el sitio.
  - Ejemplo de link para Instagram: `https://www.tu-dominio.com.ar/mudanzas-en-cuotas.html?utm_source=instagram&utm_medium=paid&utm_campaign=cuotas`
  - En Google Ads, activar el etiquetado automático (`gclid`) o usar como sufijo de URL final: `utm_source=google&utm_medium=cpc&utm_campaign={campaignid}`

---

## 2. Lo que hay que reemplazar antes de publicar
1. **Dominio:** cambiar `https://www.tu-dominio.com.ar/` en todas las páginas, en `sitemap.xml` y en `robots.txt`. Para regenerar todo: editar `DOMAIN` en `build/build.py` y correr `python3 build/build.py`.
2. **Zonas:** confirmar con el dueño los barrios y partidos (ver arriba).
3. **IDs de medición:** GA4, Google Ads y Meta Pixel.
4. **Reseñas reales**, cuando las haya: se pueden sumar a la home. Nunca inventarlas, porque Google y la ley de defensa del consumidor lo sancionan.

---

## 3. Lo que hay que hacer afuera del sitio para posicionar (lo más importante)
1. **Dominio propio .com.ar** (en NIC Argentina, barato). Por ejemplo `mudanzaslibertador.com.ar`. Publicarlo en Netlify con HTTPS.
2. **Google Business Profile (ficha de Google Maps).** Es lo que más pesa para "mudanzas zona norte" y "mudanzas cerca de mí".
   - Categoría principal "Servicio de mudanzas", y "Servicio de fletes" como secundaria.
   - Como no tienen local a la calle, configurarlo como **negocio de área de servicio** con CABA y los partidos de Zona Norte que atienden, sin mostrar la dirección.
   - Mismo nombre, teléfono y web que en el sitio. Horarios, fotos reales del camión y del equipo (subir fotos todos los meses) y publicaciones semanales.
   - Cargar los servicios (izaje, embalaje, fletes, interior, cuotas) y responder las preguntas.
3. **Reseñas:** pedirle una reseña en Google a cada cliente al terminar la mudanza (por WhatsApp, con el link directo de la ficha). Responderlas todas. Esto es lo que más mueve el ranking local y la conversión. Apuntar a 20 o más reseñas en los primeros meses. Está prohibido comprarlas o inventarlas.
4. **Google Search Console:** verificar el dominio, enviar `sitemap.xml` y revisar cada mes por qué búsquedas aparecen. Con eso se ajustan títulos y textos.
5. **Directorios y perfiles locales con los mismos datos** (nombre, teléfono, web): Bing Places, Apple Maps (Business Connect), Servidos, Muovi, CargasXL, Mudar, Páginas Amarillas / Guía Oleo si aplica, y Facebook. Cada perfil suma un enlace y confianza.
6. **Instagram:** poner el link del sitio en la bio (o una landing según la campaña) y el sitio ya enlaza a Instagram. Usar los destacados (Accesos, Kit embalaje, Testimonios) y llevar a la gente a las landings con UTM.
7. **Contenido con el tiempo:** cada tanto, una nota útil, por ejemplo "Checklist antes de mudarte" (ya lo tienen en Instagram), "Qué hacer si el mueble no entra por el ascensor" o "Mudarse a un barrio cerrado". Atrae búsquedas informativas y enlaces.
8. **Enlaces locales:** inmobiliarias de la zona, administradores de consorcios y guardamuebles con los que trabajen. Un enlace de ellos vale mucho.

---

## 4. Google Ads: propuesta para arrancar

**Estructura sugerida (Búsqueda, no Display):** una campaña por zona (CABA / Zona Norte) y grupos de anuncios por servicio, cada uno con su landing.

**Palabras clave (concordancia de frase o exacta):**
- Zona Norte: "mudanzas zona norte", "empresa de mudanzas zona norte", "fletes zona norte", "mudanzas vicente lopez", "mudanzas olivos", "mudanzas san isidro", "mudanzas martinez", "mudanzas tigre", "mudanzas san fernando" (→ landing de zona)
- CABA: "mudanzas caba", "empresa de mudanzas caba", "fletes caba", "flete chico caba", "mudanzas belgrano", "mudanzas nuñez", "mudanzas palermo" (→ landing de zona)
- Servicios: "izaje de muebles", "izaje por balcon", "mudanza de oficina", "embalaje para mudanza", "mudanzas en cuotas", "mudanzas al interior del pais", "mudanza a mar del plata", "mudanzas a la costa atlantica" (→ landing de servicio)
- Precio: "presupuesto mudanza", "cuanto cuesta una mudanza caba", "precio mudanza zona norte" (→ home o zona)

**Palabras clave negativas (para no pagar clics inútiles):**
`gratis, trabajo, empleo, busco trabajo, peón, chofer, sueldo, curso, alquiler de camión, alquiler de camioneta sin chofer, cajas usadas, venta de cajas, madrid, barcelona, españa, méxico, chile, uruguay, montevideo, córdoba capital, rosario, mendoza, internacional, mudanzas internacionales, contenedor, mascotas, guardamuebles` (sacar "guardamuebles" de la lista si algún día lo ofrecen), `qué significa, definición, wikipedia, frases, sueño, soñar con mudanza`. Y nombres de competidores si no quieren aparecer por ellos.

**Ubicación:** CABA y los partidos de Zona Norte confirmados, con la opción "Presencia: personas que están o que suelen estar en esas zonas". Hacer una campaña aparte para las búsquedas de "interior" y "costa" con alcance en AMBA.

**Conversiones:** importar los tres eventos (WhatsApp, llamada y cotizador). La principal es el cotizador.

**3 anuncios de ejemplo (responsivos de búsqueda):**

1. *Zona Norte / general*
   - Títulos: `Mudanzas en Zona Norte` · `Presupuesto Cerrado` · `No Cobramos por Hora` · `Cuotas con Mercado Pago` · `Cotizá por WhatsApp`
   - Descripciones: `El precio que acordamos es el precio final. Embalaje, desarme y armado incluidos en tu presupuesto.` · `Hogares y oficinas en Zona Norte y CABA. Personal capacitado. Pedí tu presupuesto en 1 minuto.`
   - URL: `/mudanzas-zona-norte.html`

2. *Izaje por soga*
   - Títulos: `Izaje de Muebles por Soga` · `¿No Entra por el Ascensor?` · `Por Ventana o Balcón` · `Precio Cerrado` · `CABA y Zona Norte`
   - Descripciones: `Subimos o bajamos tu sillón, placard o heladera por afuera, bien protegido. Cotizá por WhatsApp.` · `Personal capacitado, mantas, film y sogas. Pagá en cuotas con Mercado Pago.`
   - URL: `/izaje-de-muebles-por-soga.html`

3. *Cuotas / precio*
   - Títulos: `Mudanzas en Cuotas` · `Mercado Pago o Financiación Propia` · `Presupuesto Cerrado` · `Sin Sorpresas al Final` · `Mudanzas Libertador BA`
   - Descripciones: `Mudate ahora y pagá en cuotas. El precio que acordamos es el precio final, no cobramos por hora.` · `Casas, departamentos y oficinas en CABA y Zona Norte. Escribinos y te cotizamos hoy.`
   - URL: `/mudanzas-en-cuotas.html`

(En los anuncios no hay que prometer "los más baratos", "#1" ni "garantía": Google los rechaza si no se pueden demostrar.)

**Instagram / Meta (pago):** usar las fotos y videos reales del equipo. Mandar el tráfico a la landing del tema del anuncio (cuotas, izaje, Zona Norte) con UTM, con un objetivo de "Clientes potenciales" o de mensajes de WhatsApp. El Pixel ya registra `Contact` y `Lead`.


## Actualización v5 (auditoría)
- Zonas verificadas en el Instagram (subtítulos de los reels DXAMZgNEauO y DcZpCt6JUmU, más hashtags): Palermo, Belgrano, Núñez, Saavedra, Vicente López, Olivos, Florida, Martínez, San Isidro. Igual conviene confirmarlas con el dueño.
- **Tigre y San Fernando no aparecen en ninguna fuente.** La página se genera para mostrársela al dueño, pero con `noindex`, fuera del sitemap y fuera del schema. Si lo confirma, se saca de `UNCONFIRMED` en `build/build.py` y se vuelve a correr el build.
- No usar "Mar del Plata", "Pinamar" ni "Colegiales" en anuncios sin confirmarlo.
- Detalle completo: `auditoria-datos.md`.
