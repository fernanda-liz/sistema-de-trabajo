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

### 1.1 Criterios para decidir si un cofre nuevo hace falta

No cualquier tema nuevo justifica una bóveda nueva. Antes de crear una:

- **¿Tiene un dueño temático claro y distinto a los cofres que ya existen?** Si la respuesta cabe
  dentro de "qué va acá" de un cofre existente, va ahí — no se crea uno nuevo por comodidad del
  momento.
- **¿El contenido se va a mezclar con otro dominio si no lo separo?** Ese es el motivo real para
  dividir: evitar que información de un ámbito (ej. un proyecto de trabajo) termine contaminando el
  wiki de otro (ej. una tesis), lo que hace más difícil compartir, auditar o archivar cada uno por
  separado el día de mañana.
- **¿Va a acumular su propia bitácora y su propio criterio de "qué no va acá"?** Si el contenido es
  chico y no va a crecer, probablemente no necesita cofre propio — una entrada en un cofre existente
  alcanza.
- Un cofre "aparecido por accidente" (se escribió ahí porque era el lugar más rápido a mitad de
  sesión) no se vuelve permanente solo por existir: se documenta qué pasó y su contenido se mueve al
  cofre correcto en cuanto se nota.

### 1.2 Los informes de estado llevan fecha y no se sobrescriben

Hay dos tipos de documento en un cofre y conviene no confundirlos, porque envejecen distinto. Un
**análisis** responde una pregunta concreta y sigue siendo válido mientras nadie lo refute. Un
**informe de estado** es una foto del proyecto completo en un momento dado (qué se hizo, qué falta,
qué está bloqueado, cuánto cuesta, cuál es la ruta), y caduca apenas el proyecto avanza.

Por eso todo informe de estado lleva fecha en cuatro lugares a la vez:

1. **El nombre del archivo**, con fecha completa (`informe-<tipo>-YYYY-MM-DD`), nunca solo el mes.
   Así conviven varios informes de la serie y se pueden comparar en el tiempo.
2. **El frontmatter**: fecha del informe, corte de datos (hasta dónde se leyó, que puede diferir de
   la fecha de redacción) y número de versión.
3. **El encabezado visible**, con la fecha, el informe anterior de la serie y la próxima revisión
   sugerida.
4. **Toda versión derivada** (una página publicada, un PDF, una presentación), en el encabezado y no
   solo en el pie.

Y una regla que importa más que las cuatro anteriores: **nunca se sobrescribe un informe anterior**.
Se escribe uno nuevo con su propia fecha y se enlaza al previo. La serie completa termina siendo el
registro de cómo evolucionó el proyecto, que suele ser más valioso que cualquiera de los informes
por separado.

Cada informe además declara explícitamente que sus cifras corresponden a esa fecha, y remite a la
bitácora y a la lista de tareas como las fuentes que sí se mantienen al día.

### 1.3 Trazabilidad, fechas, y qué hacer con lo descartado

- **Toda entrada de `notas.md` lleva fecha** (`## [YYYY-MM-DD] Título`) — sin fecha, una decisión no
  se puede ubicar en el tiempo ni saber si sigue vigente.
- **Nunca se reescribe una entrada vieja** para "actualizarla" — si algo cambió, se agrega una
  entrada nueva que referencia a la anterior. El historial completo es lo que permite reconstruir
  *por qué* se decidió algo, no solo el estado actual.
- **Lo que se probó y se descartó se anota como descartado, con fecha y motivo — nunca se borra en
  silencio ni se deja ambiguo.** El riesgo real no es "me olvido de una idea vieja", es lo opuesto:
  un agente (o yo en una sesión futura) lee una idea abandonada sin marcar y la trata como si
  siguiera vigente, repitiendo un camino que ya se probó que no sirve. La entrada de una idea
  descartada dice explícitamente "descartado — no continuar" y por qué.
- Antes de asumir que no hay contexto previo sobre un tema, se lee la bitácora completa del cofre
  correspondiente — no solo las últimas entradas.

## 2. Los tres archivos que sostienen cada cofre

Cada cofre tiene la misma estructura mínima, independiente de su contenido:

| Archivo | Rol |
|---|---|
| `CLAUDE.md` / `AGENTS.md` | Reglas del proyecto: qué va en este cofre, qué esquema de carpetas usa, qué convenciones seguir. Es lo primero que un agente debe leer al abrir el cofre. |
| `notas.md` (o bitácora equivalente) | Registro **append-only** de decisiones, configuraciones y aprendizajes, con fecha. No es un resumen editado — es historial real, para que una sesión futura (u otra persona) entienda *por qué* algo quedó como quedó, no solo *cómo* está ahora. |
| `skills/` (o equivalente por herramienta) | Capacidades reutilizables y documentadas — un flujo que se repite se convierte en skill en vez de volver a explicarlo cada vez. |

La razón de este trío: la memoria interna de cualquier agente de código vive **localmente en el
equipo donde corriste la sesión** (no viaja sola si cambias de máquina, reinstalas o cambias de
herramienta). `CLAUDE.md`/`AGENTS.md` + `notas.md`, en cambio, son texto plano versionado (sincronizado
por iCloud/Drive/lo que uses, y respaldado en Git con historial): esa es la memoria real que
sobrevive a un cambio de equipo o de herramienta.

**Tip:** `CLAUDE.md`/`AGENTS.md` no es solo para reglas del proyecto. También es el lugar para anotar
preferencias personales de cómo querés que el agente escriba o se comunique (tono, formato,
puntuación que no te gusta, variante regional del idioma, etc.) para no tener que repetirlas cada
sesión. Esas preferencias personales conviene guardarlas en un archivo aparte (fuera de este repo
público) si son específicas tuyas y no algo que le sirva a cualquiera que use el sistema.

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

## 4. Captura y triaje: un inbox, no diez lugares sueltos

Cuando hay varios ámbitos activos a la vez (trabajo, estudio, proyectos personales), las tareas e
ideas se dispersan si cada una se anota donde sea más cómodo en el momento. El patrón que uso es
"input mínimo, output máximo":

1. **Un solo punto de captura** (`inbox.md` o equivalente): escribo ahí, sin clasificar, desde
   cualquier dispositivo — una idea suelta, un link, una minuta, una tarea que surge.
2. **Triaje** (lo hace el agente, no yo a mano): lee el inbox, clasifica por tema/ámbito, distribuye
   cada ítem al tablero (kanban) del ámbito correspondiente, y si el ítem conecta con conocimiento
   ya existente en otro cofre, crea la referencia cruzada — un link real, no una copia del contenido.
3. **Registro del triaje**: cada pasada queda anotada en una bitácora de triaje (qué entró, a dónde
   se mandó, qué se archivó) — misma lógica de trazabilidad que el resto del sistema.
4. **Resumen periódico** (ej. semanal): cuántos ítems se triaron, a dónde fueron, qué sigue
   pendiente y qué se cerró — para no tener que releer todo el historial para saber en qué está cada
   cosa.

La regla de fondo es la misma que en el resto del sistema: **el contenido real vive en un solo
lugar** (el cofre/tablero que corresponde al ámbito), y todo lo demás son referencias hacia ahí —
nunca copias que se puedan desincronizar.

## 5. Plantillas reutilizables: el caso de las presentaciones en HTML

El mismo principio de "una plantilla propia, probada, que no se reinventa cada vez" aplica más allá
de las bóvedas de conocimiento. Para presentaciones, uso una plantilla HTML autocontenida con varios
layouts predefinidos (portada, capítulo, comparación, estadísticas, cita, cierre, etc.) — un
vocabulario de formas de mostrar información, no un diseño que se decide de nuevo cada vez:

- Un solo archivo HTML con múltiples `<section>`, cada una un layout distinto e independiente.
- Reglas de contenido no negociables: nunca inventar un dato o una cifra que no exista; distinguir
  visualmente lo propio de lo citado; citar de dónde sale cada cifra; mostrar también lo que se
  probó y se descartó (no solo lo que funcionó) — la credibilidad de un informe/deck se construye
  mostrando el criterio, no solo el resultado.
- Se arma un deck copiando la plantilla (nunca editando la maestra), borrando los layouts que no se
  usan, y verificando en navegador + exportación a PDF antes de dar por terminado.

### Editar esas plantillas sin gastar tokens en cada cambio chico

Para cambios de "texto/imagen" (corregir una palabra, mover un bloque, cambiar o recortar una
imagen) no hace falta volver a invocar un agente cada vez — eso es tokens gastados en algo que un
editor visual resuelve directo. La opción que uso: convertir el HTML a un **canvas editable
multi-artboard** (una diapositiva = un artboard) publicado como página compartible — click para
seleccionar cualquier elemento, panel de propiedades, edición de texto inline, arrastrar para mover,
deshacer/rehacer. Cada "Guardar" publica una versión nueva sin volver a pasar por el agente. Existe
también la alternativa de un editor visual de HTML autoalojado y 100% independiente de cualquier
plataforma de IA (ej. un builder open-source tipo drag-and-drop), para quien prefiera no depender de
ninguna plataforma externa — más control, pero requiere programarlo y mantenerlo.

La idea general — **plantilla fija y probada + edición visual liviana para los ajustes chicos** —
aplica a cualquier HTML reutilizable, no solo a presentaciones.

## 6. Skills reutilizables (públicas)

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
- **`obsidian-task-sync`** — implementa el patrón de captura + triaje de la sección 4: un inbox
  único, clasificación automática por ámbito, distribución a tableros temáticos y referencias
  cruzadas hacia el conocimiento ya existente en otras bóvedas.

## 7. Flujo de investigación académica: Zotero + skill APA 7

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

## 8. Reglas de higiene que aplico antes de publicar algo

- Ningún archivo público lleva credenciales, tokens ni claves — ni siquiera *dónde* viven, para no
  dejar un mapa. Van solo en archivos ignorados por Git (`.env.local`, `*-config.md` fuera del
  repo) y nunca en un cofre que se vaya a compartir.
- Antes de hacer público cualquier cofre o repo, reviso el contenido completo entrada por entrada —
  no alcanza con "no debería tener nada raro", hay que confirmarlo leyendo.
- Información de clientes, empleador o bajo acuerdo de confidencialidad no sale de las bóvedas
  privadas, ni siquiera anonimizada a medias — si hay duda, no se publica.
- Lo que sí es público es el **método**: cómo está armado el sistema, qué convenciones sigo, qué
  skills reutilizo. El contenido real de cada proyecto se queda donde corresponde.

### 8.1 Cómo respaldar un cofre que mezcla contenido propio con material de terceros

Un cofre de investigación acumula dos cosas muy distintas: el conocimiento propio (síntesis,
análisis, decisiones) y el material de terceros que lo alimenta (papers, PDFs, archivos originales).
No se respaldan igual, y tratarlos como una sola cosa lleva a un repositorio inviable.

El problema aparece rápido: un cofre con un par de cientos de fuentes puede pesar varios gigabytes,
y el historial de git conserva cada versión de cada archivo binario, así que el repositorio pesa aún
más que la carpeta. A eso se suma que el texto íntegro de un paper con derechos de autor no debería
vivir en un repositorio remoto, ni siquiera privado, porque eso es redistribución.

La solución que uso es un **espejo liviano**: un repositorio privado que contiene solo el contenido
curado (la wiki, las reglas, las tareas, los documentos propios) y deja fuera, a propósito, la
carpeta de fuentes originales, las credenciales y la configuración local de las apps. Pesa unos
pocos megabytes en vez de gigabytes, y se puede clonar, revisar y respaldar sin fricción.

Reglas prácticas del patrón:

- Cada tipo de material se respalda por la vía que le corresponde: el conocimiento propio en git, las
  fuentes de terceros en el gestor de referencias y en el almacenamiento en la nube, las
  credenciales en ningún lado más que el equipo local.
- El README del espejo dice explícitamente **qué no incluye y por qué**. Un respaldo parcial sin esa
  advertencia se confunde con un respaldo completo, y esa confusión se descubre el día que falla algo.
- La sincronización es manual y deliberada (copiar, revisar el diff, commitear), no automática. Así
  cada actualización pasa por una revisión de qué se está subiendo.
- Antes de cada push, verificación de credenciales por búsqueda de patrones y de archivos pesados.
  Los falsos positivos son normales (una frase, un identificador, un nombre propio) y se revisan uno
  por uno en vez de confiar en el resultado del comando.

## 9. Sincronización Obsidian → Kanban Web (automática)

Sistema completo de captura, clasificación y sincronización sin intervención manual:

- **Captura**: Escribe en Obsidian (`captura/inbox.md`) sin clasificar
- **Sincronización**: AppleScript (cada 5 min) copia a Google Drive → AppScript procesa → Google Sheet
- **Visualización**: Kanban web interactivo con drag-drop, checklist, progreso en %
- **Triaje inteligente**: Claude clasifica por ámbito/tema y distribuye automáticamente

📖 **Documentación completa**: [`docs/SYNC-OBSIDIAN-KANBAN.md`](docs/SYNC-OBSIDIAN-KANBAN.md)

Scripts reutilizables:
- [`scripts/sync-obsidian-to-drive.applescript`](scripts/sync-obsidian-to-drive.applescript)
- [`scripts/com.obsidian.sync.kanban.plist`](scripts/com.obsidian.sync.kanban.plist)
- [`scripts/kanban-appscript-auto-sync.gs`](scripts/kanban-appscript-auto-sync.gs)

## 10. Cómo se mantiene esto actualizado

Cada vez que cambia algo de fondo en el método — una convención nueva, una skill nueva, un ajuste al
esquema de cofres — se refleja acá, filtrando cualquier dato específico de un proyecto privado. Este
repo documenta el *cómo*, no el *qué* de cada proyecto.

---

## 📚 Tutorial Interactivo: Obsidian + Zotero + IAs + Triaje Automático

**Para alguien que quiere replicar el sistema desde cero, sin conocimiento previo.**

Este manual paso a paso cubre:

✅ **Captura sin clasificar** en Obsidian (desde iPhone, iPad, Mac — iCloud sync)  
✅ **4 IAs disponibles:** Claude Code (Anthropic), Codex (OpenAI), Antigravity (Google), OpenClaw (China)  
✅ **Sistema de triaje automático** que distribuye tareas a kanbans personales por ámbito/tema  
✅ **Zotero integrado** para referencias académicas automáticas (APA 7)  
✅ **Multi-plataforma:** Mac, Windows, Linux  
✅ **Descargable y sin datos sensibles** — seguro para usar y compartir

📖 **Abre el tutorial:** [`docs/tutorial-sistema-completo.html`](docs/tutorial-sistema-completo.html)

**O descárgalo completo** desde el navegador (botón derecho → Guardar como HTML) para usarlo offline.

**Tiempo:** ~40 minutos desde cero hasta tener todo funcionando.

**Incluye:**
- Instalación paso a paso de Node.js (todas las plataformas)
- Comparación de IAs con ventajas/desventajas de cada una
- Cómo crear tu primer "cofre" (estructura mínima)
- Obsidian: inbox + captura sin clasificar
- Sistema de triaje explicado (cómo la IA lo distribuye todo automáticamente)
- Integración Zotero + generación de citas APA 7
- Flujo real completo (caso práctico paso a paso)
- Checklist de seguridad antes de compartir un cofre público

El tutorial es **interactivo** (tabs por IA, snippets copiables, ejemplos de flujo real) y está
pensado para que cualquiera pueda replicar el método sin depender de una herramienta específica.
