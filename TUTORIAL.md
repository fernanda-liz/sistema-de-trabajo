# Tutorial: cómo usar este sistema desde cero

Guía paso a paso para alguien que nunca usó ninguno de estos agentes y quiere replicar el sistema.
No asume conocimiento previo. Cada paso dice qué instalar, qué cuenta necesitas y qué es opcional.

**Importante sobre credenciales**: ningún API key, token ni contraseña va en este repo ni en ningún
cofre que compartas. Cada quien genera las suyas propias con su propia cuenta (Paso 4). Si alguna
vez ves una clave real en un repo público —el tuyo o de alguien más— es un error de seguridad, no
algo para copiar y usar.

---

## Paso 1 — Elegí con qué agente vas a trabajar

No hace falta instalar los tres. Con uno alcanza para empezar; podés sumar otro después porque el
sistema (Paso 3) funciona igual en cualquiera.

### Opción A: Claude Code (terminal, de Anthropic)

Requisito previo: [Node.js](https://nodejs.org) versión 22 o superior instalado.

```bash
npm install -g @anthropic-ai/claude-code
claude --version
```

Al correr `claude` por primera vez te va a pedir loguearte con tu cuenta de Anthropic/Claude (plan
gratis o de pago, según qué límites de uso quieras).

### Opción B: Codex CLI (terminal, de OpenAI)

Requisito previo: Node.js 22+.

```bash
npm install -g @openai/codex
codex --version
```

Vas a necesitar una cuenta de OpenAI con una API key propia (se genera en
[platform.openai.com](https://platform.openai.com)) o loguearte con tu cuenta ChatGPT según el modo
de autenticación que ofrezca la versión que instales.

### Opción C: Antigravity (IDE completo, de Google)

No es un simple paquete de npm — es una aplicación de escritorio:

1. Andá a [antigravity.google/download](https://antigravity.google/download) y descargá el
   instalador para tu sistema operativo (macOS, Windows o Linux).
2. Corré el instalador y logueate con una cuenta de Gmail personal.
3. Aceptá las opciones por defecto la primera vez (IDE, acciones por defecto, plugins).

Requiere cuenta de Google (Gmail), no cuenta corporativa/Workspace restringida.

---

## Paso 2 — Cloná este repo y el de las skills

```bash
git clone https://github.com/fernanda-liz/sistema-de-trabajo.git
git clone https://github.com/fernanda-liz/claude-skills.git
```

El primero es este documento (el método). El segundo son las skills reutilizables ya escritas
(`pdf-a-wiki`, `tesis-workflow`, `apa7-writing`).

## Paso 3 — Armá tu primer "cofre"

Un cofre es simplemente una carpeta con esta estructura mínima:

```
mi-cofre/
├── AGENTS.md      ← reglas del proyecto (copiá el de este repo como plantilla)
├── CLAUDE.md      ← igual contenido que AGENTS.md, para que Claude Code lo lea nativo
└── notas.md       ← bitácora vacía, vas a ir agregando entradas fechadas
```

1. Copiá [`AGENTS.md`](AGENTS.md) de este repo a tu carpeta nueva y editalo: reemplazá los ejemplos
   por las reglas reales de tu proyecto (qué va ahí, qué esquema de carpetas usás).
2. Copiá ese mismo contenido a `CLAUDE.md` (si vas a usar Claude Code además de Codex/Antigravity).
3. Creá `notas.md` con una sola línea: `# Notas internas` — de ahí en adelante cada sesión agrega una
   entrada nueva con fecha, nunca se borra ni se reescribe lo viejo.
4. Iniciá git en esa carpeta (`git init`) si querés respaldo con historial, y agregá un `.gitignore`
   con cualquier archivo de configuración/credenciales que vayas a crear ahí (ver Paso 4).

Abrí esa carpeta con el agente que elegiste en el Paso 1 (`claude` estando parado en la carpeta,
`codex` igual, o "Open Folder" en Antigravity) y empezá a trabajar — el agente va a leer
`CLAUDE.md`/`AGENTS.md` solo, sin que se lo pidas.

## Paso 4 — Instalar las skills (opcional pero recomendado)

Parado en la carpeta de tu cofre:

```bash
npx skills add fernanda-liz/claude-skills --skill apa7-writing --copy -y
npx skills add fernanda-liz/claude-skills --skill pdf-a-wiki --copy -y
```

Esto requiere Node.js (el mismo que ya instalaste en el Paso 1) — `npx` viene incluido con npm, no
hace falta instalar nada más. Cada skill queda copiada dentro de `.claude/skills/` en tu cofre.

## Paso 5 — MCP / conectores externos (opcional, solo si los necesitás)

MCP (Model Context Protocol) es el mecanismo que usan estos agentes para conectarse a servicios
externos (correo, Drive, gestores de referencias bibliográficas, etc.). **No viene activado por
default** y **cada quien necesita su propia cuenta y su propia API key/OAuth** — nunca la de otra
persona, y nunca puesta en un archivo versionado en Git.

Ejemplos de para qué sirve, si tu flujo lo necesita:

- **Gestor de referencias bibliográficas** (ej. Zotero): API key personal generada en la
  configuración de tu cuenta del gestor — se usa para automatizar altas de ítems/PDFs desde el
  agente en vez de hacerlo a mano. Guardala en un archivo tipo `.env.local` **fuera** de cualquier
  repo público, y agregá ese archivo a `.gitignore` antes del primer commit.
- **Correo / Drive**: se conectan vía OAuth desde la configuración del propio agente (`/mcp` en
  Claude Code, o el equivalente en Codex/Antigravity) — no se necesita una API key manual, autorizás
  con tu cuenta y listo.
- **Búsqueda académica** (ej. APIs de editoriales científicas): se registra una app en el portal de
  desarrollador de esa editorial, se genera una key, y se guarda igual que el primer ejemplo — nunca
  en un repo compartido.

Si no necesitás ninguno de estos, saltate este paso entero — el sistema (cofres + skills) funciona
sin ningún MCP conectado.

## Paso 6 — Checklist antes de compartir cualquier cofre tuyo

Antes de hacer público un repo o carpeta que armaste con este sistema:

- [ ] `grep` (o buscar a mano) por cualquier palabra tipo `key`, `token`, `password`, `secret` en
      todos los archivos — si aparece algo real, sacalo antes de publicar.
- [ ] Releer `notas.md` entrada por entrada — es una bitácora honesta, va a tener cosas que
      pensabas en el momento y que no querés públicas (nombres de gente, datos de trabajo, etc.).
- [ ] Confirmar que `.gitignore` cubre cualquier archivo de configuración con credenciales antes del
      primer commit (no después — si ya se subió una vez, queda en el historial de git aunque lo
      borres después).
- [ ] Si el cofre tiene contenido de un trabajo, cliente o acuerdo de confidencialidad: no se
      publica, ni resumido ni anonimizado a medias.

---

Con esto ya tenés lo mismo que uso yo: un cofre por dominio, reglas y bitácora que sobreviven a
cambiar de equipo o de agente, y skills reutilizables en vez de reexplicar el mismo flujo cada vez.
