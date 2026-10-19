# Mudanzas Libertador BA · sitio (v5: auditoría de datos y responsive + videos + SEO)

HTML + CSS + JS estático, sin build obligatorio. Se sube la carpeta tal cual a Netlify o GitHub Pages.

- 14 páginas: home + 6 de servicios + 7 de zonas. Las landings se generan con `build/build.py` (está fuera de esta carpeta, en /workspace/mudanzas/build).
- Antes de publicar: reemplazar `https://www.tu-dominio.com.ar/` (páginas, sitemap.xml, robots.txt), confirmar las zonas (las páginas de barrio y partido tienen un comentario `ZONA A CONFIRMAR`) y cargar los IDs de GA4, Google Ads y Meta (comentados en el `<head>` y en el objeto `ADS` de `assets/js/main.js`).
- Origen de las visitas: los parámetros `utm_source`, `gclid` y `fbclid` se agregan al mensaje de WhatsApp como "Vengo de: …".
- Ver también: /workspace/mudanzas/SEO-y-anuncios.md y keywords.csv.

## Videos (v4)

En `assets/video/` hay recortes cortos de los reels públicos de @mudanzaslibertador.ar, **sin audio** y elegidos en tramos sin texto encima:

- `hero-desktop.(webm|mp4)` (1280x720, 8 s, tres tomas lado a lado) y `hero-mobile.(webm|mp4)` (540x960, 8 s), con su póster `-poster.(webp|jpg)`. Vienen del reel del 6/9/2026 (instagram.com/reel/Dc9n_Z3RUAY/).
- Clips 480x600 (4:5) de 4 a 6 s: `clip-camion` (reel DecMW_LxL-1), `clip-pasillo` y `clip-film` (Dc9n_Z3RUAY), `clip-carga` (Ddb45EJRaYm), `clip-traslado` y `clip-embalaje` (DctDHChRu94). Cada uno tiene su póster `.webp/.jpg`.
- `main.js` carga los videos solo cuando hace falta: el del hero según el ancho de pantalla y el resto al entrar en pantalla. Con "Ahorro de datos" o "Reducir movimiento" no carga ningún video y se ven los pósters.
- En la galería, en compu el video arranca al pasar el mouse y en el celular cuando la tarjeta está a la vista. Si la tocás, se abre más grande y sin sonido, con un link al reel completo en Instagram.
- Para cambiar un clip: reemplazá los archivos manteniendo el nombre, o editá `build/v4_video.py` y corré `python3 build/build.py`.
- Los reels son del negocio. Conviene confirmar con el dueño que se pueden usar en la web.

## v5 (auditoría)
- Cada dato se contrastó con el Instagram: bio, captions y subtítulos de 12 reels y 5 posts. Ver `/workspace/mudanzas/auditoria-datos.md`.
- `mudanzas-tigre-san-fernando.html` no tiene fuente: está en `noindex` y fuera del sitemap y del schema hasta que el dueño confirme la zona (`UNCONFIRMED` en build.py).
- Probado en Chromium en 12 tamaños, de 320x568 a 1920x1080, incluido un celular en horizontal. Safari/iOS solo se revisó leyendo el código.
