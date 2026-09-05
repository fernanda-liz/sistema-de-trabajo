# Sistema de trabajo con agentes de código (Fernanda Liz)

Versión pública y curada de cómo organizo mi conocimiento y mi trabajo asistido por agentes de
código (Claude Code, Codex, Antigravity). **Esto no es un backup crudo de mis notas privadas**: es
un resumen del *sistema* — la arquitectura, las convenciones, las skills reutilizables — sin datos
personales, credenciales, información de clientes/empleador ni contenido específico de mis proyectos
privados. Ese detalle vive en bóvedas privadas separadas; acá solo el método.

Se actualiza cada vez que el método cambia de verdad (no es un espejo automático de mis notas del
día a día).

---

## 1. Filosofía: "cofres" temáticos, no una sola carpeta gigante

Separo el conocimiento por dominio en bóvedas independientes ("cofres"), cada una con su propio
alcance y su propia regla de qué entra y qué no:

- Un cofre por proyecto/dominio (tesis, trabajo, salud, meta-configuración de herramientas, etc.).
- Cada cofre declara explícitamente, en su propio archivo de instrucciones, **qué va** y **qué no
  va** ahí — evita que todo se mezcle "porque apareció en esta sesión".
- Cuando algo aparece en el cofre equivocado (pasa, sobre todo por accidente de terminal o porque
  fue el lugar más rápido de guardar algo a mitad de sesión), se documenta y se mueve al cofre
  correcto en cuanto se nota, en vez de dejarlo ahí "total ya está guardado".

## 2. Los tres archivos que sostienen cada cofre

Cada cofre tiene la misma estructura mínima, independiente de su contenido:

| Archivo | Rol |
|---|---|
| `CLAUDE.md` / `AGENTS.md` | Reglas del proyecto: qué va en este cofre, qué esquema de carpetas usa, qué convenciones seguir. Es lo primero que un agente debe leer al abrir el cofre. |
| `notas.md` (o bitácora equivalente) | Registro **append-only** de decisiones, configuraciones y aprendizajes, con fecha. No es un resumen editado — es historial real, para que una sesión futura (u otra persona) entienda *por qué* algo quedó como quedó, no solo *cómo* está ahora. |
| `skills/` (o equivalente por herramienta) | Capacidades reutilizables y documentadas — un flujo que se repite se convierte en skill en vez de volver a explicarlo cada vez. |

La razón de este trío: la memoria interna de cualquier agente de código vive **localmente en el
equipo donde corriste la sesión** — no viaja sola si cambias de máquina, reinstalas, o cambias de
herramienta. `CLAUDE.md`/`AGENTS.md` + `notas.md`, en cambio, son texto plano versionado (sincronizado
por iCloud/Drive/lo que uses, y respaldado en Git con historial) — **esa es la memoria real que
sobrevive** a un cambio de equipo o de herramienta.

## 3. Multi-herramienta: un mismo cofre, tres agentes distintos

No dependo de una sola herramienta. El mismo cofre debe poder abrirse con Claude Code, Codex o
Antigravity y que el agente entienda el mismo contexto:

- **Claude Code** lee `CLAUDE.md` de forma nativa.
- **Codex** (OpenAI) lee `AGENTS.md` — jerárquico: uno global en `~/.codex/AGENTS.md`, luego el del
  repo, luego el de subcarpetas más específicas (lo más específico gana).
- **Antigravity** (Google) también adoptó `AGENTS.md` como formato — soporta tanto un `AGENTS.md`
  único en la raíz como una carpeta `.agents/rules/` con varios archivos por tema (límite de ~12.000
  caracteres por archivo).

`AGENTS.md` es hoy el formato abierto compartido entre Codex, Antigravity, Cursor, Gemini CLI,
Windsurf y otros — por eso en este repo el archivo canónico es `AGENTS.md`, y `CLAUDE.md` es un
alias/copia del mismo contenido para que Claude Code lo lea sin fricción. Regla práctica: **si
edito las reglas de un cofre, edito `AGENTS.md` y actualizo `CLAUDE.md` a la par** (o uso un symlink
si la herramienta de sincronización del cofre lo permite).

Ver [`AGENTS.md`](AGENTS.md) / [`CLAUDE.md`](CLAUDE.md) en este mismo repo como plantilla de punto de
partida para un cofre nuevo.

## 4. Skills reutilizables (públicas)

Los flujos que se repiten seguido quedan como skills versionadas, en vez de reexplicarlos cada
sesión. Repo separado: **[fernanda-liz/claude-skills](https://github.com/fernanda-liz/claude-skills)**.

- **`pdf-a-wiki`** — ingesta un PDF (paper, informe, manual) a una bóveda con esquema `raw/`+`wiki/`,
  extrayendo no solo el texto sino todas las imágenes y gráficos, y reconstruyendo en tabla los
  gráficos de datos en vez de dejarlos como imagen muda.
- **`tesis-workflow`** — flujo de trabajo académico: clasifica qué llega (fuente citable → gestor de
  referencias + wiki; idea/tarea/reunión → solo wiki) y automatiza la ingestión de fuentes (texto
  completo + imágenes + síntesis).
- **`apa7-writing`** — redacta o revisa texto académico en norma APA 7ª edición (citas en el texto,
  lista de referencias, niveles de encabezado, tablas/figuras, lenguaje sin sesgos). No gestiona
  bibliografía — eso lo sigue haciendo el gestor de referencias (Zotero u otro) vía su plugin de
  Word/Google Docs; esta skill solo define el formato correcto.

## 5. Flujo de investigación académica: Zotero + skill APA 7

Para cualquier cofre que implique leer y citar papers, informes o fuentes académicas, el gestor de
referencias es **Zotero** — es la fuente de verdad de la bibliografía, no algo que reconstruyo a
mano ni que el agente inventa:

1. **Buscar y recolectar**: bases académicas abiertas (Semantic Scholar, OpenAlex, Google Scholar) o
   acceso institucional si corresponde, exportando cada fuente válida en BibTeX.
2. **Zotero**: cada fuente entra a Zotero vía "Add Item → From BibTeX" (o su API si el volumen lo
   amerita), con el PDF adjunto cuando hay acceso a texto completo.
3. **Ingestión a la wiki del cofre**: la skill `pdf-a-wiki` (ver sección 4) convierte cada PDF en una
   página de wiki con texto, imágenes y gráficos reconstruidos en tabla — para consultar barato sin
   releer el PDF completo cada vez.
4. **Redacción con formato APA 7**: cuando llega el momento de escribir (un informe, una sección de
   tesis, un resumen), pido la skill `apa7-writing` — define el formato correcto de citas en el
   texto, lista de referencias, encabezados y tablas/figuras. **No reemplaza a Zotero**: las citas
   "vivas" se insertan con el plugin de Zotero para Word/Google Docs; la skill solo asegura que el
   estilo final sea APA 7 correcto y no inventa ningún dato bibliográfico que no esté confirmado.

Esta separación de responsabilidades (Zotero = bibliografía real, skill = formato) evita el error
típico de que un agente "alucine" una referencia que suena plausible pero no existe.

## 6. Reglas de higiene que aplico antes de publicar algo

- Ningún archivo público lleva credenciales, tokens ni claves — ni siquiera *dónde* viven, para no
  dejar un mapa. Van solo en archivos ignorados por Git (`.env.local`, `*-config.md` fuera del
  repo) y nunca en un cofre que se vaya a compartir.
- Antes de hacer público cualquier cofre o repo, reviso el contenido completo entrada por entrada —
  no alcanza con "no debería tener nada raro", hay que confirmarlo leyendo.
- Información de clientes, empleador o bajo acuerdo de confidencialidad no sale de las bóvedas
  privadas, ni siquiera anonimizada a medias — si hay duda, no se publica.
- Lo que sí es público es el **método**: cómo está armado el sistema, qué convenciones sigo, qué
  skills reutilizo. El contenido real de cada proyecto se queda donde corresponde.

## 7. Cómo se mantiene esto actualizado

Cada vez que cambia algo de fondo en el método — una convención nueva, una skill nueva, un ajuste al
esquema de cofres — se refleja acá, filtrando cualquier dato específico de un proyecto privado. Este
repo documenta el *cómo*, no el *qué* de cada proyecto.
