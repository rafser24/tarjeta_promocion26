# Invitación digital de graduación

Vite + React 18 + TypeScript · Motion · Tailwind v4 · Zustand · zod · lz-string

## Uso
```bash
npm install
npm run dev        # http://localhost:5173  (tarjeta)   ·   http://localhost:5173/#/editar  (editor)
npm run build      # genera /dist, estático (Vercel, Netlify, GitHub Pages)
```

## Personalizar
- **Editor:** abre `/#/editar`. Cambia textos, fecha/hora (día de la semana, mes y hora se calculan solos), tema, WhatsApp, mapa y música. Se autoguarda en el navegador.
- **Compartir:** "Generar enlace" crea `?c=…` con toda la configuración comprimida; funciona en cualquier dispositivo sin servidor. Botón directo a WhatsApp.
- **Valores por defecto:** `src/lib/config.ts` (`DEFAULT_CONFIG`) y `cards/ejemplo.json`.
- **Tiempos de animación:** `timing` en la configuración (`curtain`, `page2At`, `inviteStay`, `agendaStay`, `rosterStay`, `thanksStay`, `sweepAfter`, `autoAdvance`); también se editan en `/#/editar`. Las páginas opcionales (agenda y nómina) se pueden desactivar y los tiempos se recalculan solos.
- **Tema:** presets en `THEMES` (`src/lib/config.ts`) o colores libres en el editor.
- **Música:** pega una URL https a un mp3; suena al tocar la portada (silenciada por defecto).

## Páginas
Portada → Promoción → Invitación → **Agenda** → **Nómina** → **Agradecimientos** → Cierre (con "Personalizar y enviar") → pantalla final opcional. Agenda, nómina y agradecimientos se editan en `/#/editar` y se pueden desactivar.

## Interacción
Toca la portada (o desliza a la izquierda) para abrir. Las páginas avanzan solas como en el video; si el usuario hace scroll toma el control. Tocar durante la escritura la completa al instante. Respeta `prefers-reduced-motion`.

## Compartir de forma elegante
1. **Vista previa (WhatsApp/Facebook/Telegram):** `index.html` ya trae los metadatos Open Graph y `public/og.jpg` (1200×630). Al publicar, define la dirección final para que las URL sean absolutas (obligatorio para que se vea la imagen):
   ```bash
   VITE_SITE_URL=https://tu-dominio.com npm run build
   ```
   (o crea un archivo `.env` con `VITE_SITE_URL=https://tu-dominio.com`). En Vercel/Netlify agrégala como variable de entorno.
   Si cambias textos/fecha, edita también `og:title`/`og:description` en `index.html` y regenera `public/og.jpg`.
   Para forzar que WhatsApp actualice una vista previa en caché, agrega `?v=2` al enlace.
2. **Enlace limpio:** los valores de `DEFAULT_CONFIG` (`src/lib/config.ts`) se publican tal cual; comparte solo la raíz (`https://tu-dominio.com`). Cuando el contenido esté definitivo, copia ahí los cambios del editor.
3. **Enlace por invitado:** `https://tu-dominio.com/?para=Familia%20Pérez` muestra "Para: Familia Pérez" en la portada. En `/#/editar` → "Enlaces personalizados por invitado" pegas la lista y generas cada enlace con su botón de WhatsApp.

## Contador de envíos (solo para el dueño)

Cada vez que alguien pulsa **Enviar por WhatsApp** o **Copiar enlace** en "Personalizar y enviar", la tarjeta llama a `/api/share` (POST) y suma 1.
El total se ve en `https://TU-SITIO/contador` escribiendo la clave (variable `STATS_KEY`). La tarjeta no muestra el número a nadie.

Configuración en Vercel (gratis):
1. Proyecto → **Storage** → **Create Database** → **Upstash Redis** (plan Free) → conéctala al proyecto.
2. **Settings → Environment Variables**: agrega `STATS_KEY` con una clave larga que solo tú conozcas.
3. **Redeploy**.

Sin base de datos conectada la tarjeta funciona igual; solo no cuenta.
