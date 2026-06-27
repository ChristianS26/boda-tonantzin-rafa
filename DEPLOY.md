# Publicar la invitación · Cloudflare Pages + dominio propio

La página es **estática** (HTML/CSS/JS + imágenes, sin servidor). La portada es
`index.html` (la invitación con foto). El RSVP envía a Google Forms desde el
navegador, así que funciona en cualquier hosting estático.

> **Antes de compartir el enlace:** conecta el Google Form en el bloque `CONFIG`
> de `index.html` (ver `README` interno / comentario arriba del `<script>`).
> Mientras no esté conectado, el botón de enviar mostrará un aviso.

---

## 1) Subir a Cloudflare Pages

### Opción A — Subida directa (la más rápida, sin git)
1. Crea una cuenta gratis en <https://dash.cloudflare.com>.
2. Menú lateral: **Workers & Pages** → **Create application** → pestaña **Pages**
   → **Upload assets**.
3. Nombre del proyecto, p. ej. `boda-tonantzin-rafa`.
4. Arrastra los archivos del sitio. **Importante:**
   - `index.html` debe quedar en la **raíz** de lo que subes (no dentro de una subcarpeta).
   - Incluye: `index.html`, `invitacion.html`, `invitacion-completa.html`,
     `styles.css`, `script.js` y la carpeta `images/`.
   - **NO subas** la carpeta `.claude/` ni `DEPLOY.md` (no hacen daño, pero no sirven al público).
   - Si te pide un ZIP, comprime esos archivos (no la carpeta contenedora) y súbelo.
5. **Deploy**. En 1 minuto tendrás una URL tipo `boda-tonantzin-rafa.pages.dev`.

Para actualizar luego: vuelves a **Upload assets** y subes la versión nueva.

### Opción B — Conectar a Git (auto-deploy en cada cambio)
Útil si vas a editar seguido. Requiere subir el proyecto a GitHub.
1. Sube el proyecto a un repo de GitHub.
2. Cloudflare Pages → **Create application** → **Pages** → **Connect to Git**.
3. Configuración de build (es estático, sin build):
   - **Framework preset:** None
   - **Build command:** *(vacío)*
   - **Build output directory:** `/`
4. Deploy. A partir de ahí, cada `git push` republica solo.

---

## 2) Comprar y conectar el dominio

Lo más simple es comprar el dominio **en Cloudflare** (precio al costo, sin sobreprecio):

1. Dashboard de Cloudflare → **Domain Registration** → **Register Domains**.
2. Busca y compra, p. ej. `tonantzinyrafael.com` (~10-12 USD/año un `.com`).
3. Ve a tu proyecto de Pages → pestaña **Custom domains** → **Set up a domain**.
4. Escribe tu dominio (y opcional `www.`). Como está en Cloudflare, el registro
   DNS se crea **automáticamente** y el certificado **HTTPS** se emite solo
   (unos minutos).

¿Compraste el dominio en otro lado (Namecheap, GoDaddy)? Dos caminos:
- **Mover los nameservers** a Cloudflare (recomendado: te lo indica el panel al
  "Add a site"), o
- Añadir un **CNAME** de tu dominio apuntando a `boda-tonantzin-rafa.pages.dev`.

---

## Checklist final antes de mandar la invitación
- [ ] Google Form conectado en el bloque `CONFIG` de `index.html`.
- [ ] Probado el RSVP de punta a punta (enviar y ver la respuesta en la hoja de cálculo).
- [ ] Probado en **teléfono** (es donde más entrarán): zonas de Templo, Hacienda,
      Liverpool y RSVP funcionando.
- [ ] Dominio con candado (HTTPS) activo.
