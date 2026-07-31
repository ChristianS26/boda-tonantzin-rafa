# Publicar la invitación · GitHub Pages + dominio propio

La página es **estática** (HTML/CSS/JS + imágenes, sin servidor). La portada es
`index.html` (la invitación con foto). El RSVP envía a Google Forms desde el
navegador, así que funciona en cualquier hosting estático.

> **Antes de compartir el enlace:** conecta el Google Form en el bloque `CONFIG`
> de `index.html` (ver `README` interno / comentario arriba del `<script>`).
> Mientras no esté conectado, el botón de enviar mostrará un aviso.

---

## 1) Hosting: GitHub Pages

El sitio se publica directo desde el repo `boda-tonantzin-rafa`, rama `main`,
carpeta raíz (`/`) — sin build, sin GitHub Actions ("legacy" Pages).

- **Settings → Pages** del repo: fuente = rama `main`, carpeta `/`.
- Cada `git push` a `main` republica el sitio automáticamente en 1-2 minutos.
- URL por defecto (sin dominio propio): `https://christians26.github.io/boda-tonantzin-rafa/`.

---

## 2) Dominio propio (comprado en GoDaddy u otro registrador)

Dominio actual: **`tonantzinyrafa.com`** (ya conectado y funcionando).

### En GitHub
1. **Settings → Pages** → **Custom domain** → escribe el dominio → **Save**.
   Esto crea un archivo `CNAME` en el repo con ese texto.
2. Cuando el DNS resuelva correctamente, GitHub emite el certificado HTTPS
   solo (puede tardar de minutos a ~1 hora; si se queda atorado por horas,
   quitar y volver a poner el dominio en ese mismo campo fuerza una nueva
   solicitud de certificado).
3. Activa **Enforce HTTPS** en cuanto esté disponible.

### En el registrador del dominio (GoDaddy, etc.)
Agrega estos registros en la zona DNS del dominio:

- **4 registros A** en `@` (raíz), apuntando a las IPs de GitHub Pages:
  ```
  185.199.108.153
  185.199.109.153
  185.199.110.153
  185.199.111.153
  ```
- **1 registro CNAME** en `www` → `christians26.github.io`

Si el dominio tiene "Domain Forwarding"/"Reenvío" activado en el registrador,
desactívalo — pisa los registros A y evita que resuelva a GitHub Pages.

---

## 3) Variantes de invitación (1 o 2 personas)

El bottom sheet de RSVP cambia según el parámetro `?p=` en la URL:

| Variante | URL completa | Comportamiento |
|---|---|---|
| 1 persona (default) | `https://tonantzinyrafa.com/` | nombre + "¿Nos acompañarás?" (sí / no podré ir) |
| 1 persona (explícito) | `https://tonantzinyrafa.com/?p=1` | igual que el default |
| 2 personas | `https://tonantzinyrafa.com/?p=2` | nombre + "¿Cuántas personas asistirán?" (1 ó 2) |

La nota del boleto y el mensaje de agradecimiento cambian según la variante.
No hay parámetro para personalizar el nombre del invitado por URL — el nombre
se captura como campo de texto libre en el formulario.

---

## Checklist final antes de mandar la invitación
- [ ] Google Form conectado en el bloque `CONFIG` de `index.html`.
- [ ] Probado el RSVP de punta a punta (enviar y ver la respuesta en la hoja de cálculo).
- [ ] Probado en **teléfono** (es donde más entrarán): zonas de Templo, Hacienda,
      Liverpool y RSVP funcionando.
- [ ] Dominio con candado (HTTPS) activo.
- [ ] Confirmar que cada invitado recibe la URL con el `?p=` correcto (1 o 2 personas).
