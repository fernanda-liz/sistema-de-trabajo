# Plantilla de reglas de cofre (AGENTS.md / CLAUDE.md)

Copiá este archivo como punto de partida para un cofre nuevo y reemplazá cada sección por las reglas
reales de tu proyecto. Es el archivo que cualquier agente (Claude Code, Codex, Antigravity) lee
antes de empezar a trabajar en la carpeta.

---

## Qué es este cofre

Una frase describiendo el dominio/proyecto y por qué existe como cofre separado de los demás.

## Qué va acá / qué no va acá

- Lista explícita de qué tipo de contenido corresponde a este cofre.
- Lista explícita de qué NO va acá (y a qué otro cofre debería ir en su lugar).

Esta sección es la que evita que el agente mezcle contenido de dominios distintos "porque fue el
lugar más rápido de guardarlo a mitad de sesión".

## Estructura de carpetas

```
cofre/
├── AGENTS.md / CLAUDE.md   ← este archivo
├── notas.md                ← bitácora append-only, ver convención abajo
├── raw/                    ← (opcional) fuentes originales sin procesar
├── wiki/                   ← (opcional) contenido curado/sintetizado
└── .claude/skills/         ← (opcional) skills copiadas para este cofre específico
```

Ajustar según si el cofre necesita esquema de ingestión de fuentes (`raw/`+`wiki/`) o es más simple
(notas planas sin subcarpetas).

## Convención de entradas en `notas.md`

```
## [YYYY-MM-DD] Título breve
Contenido de la entrada — qué se decidió, qué se aprendió, qué quedó pendiente.
```

Append-only: nunca se edita ni se borra una entrada vieja, solo se agregan nuevas al final. Es
historial real, no un resumen que se reescribe.

## Reglas de integraciones externas (si aplica)

- Qué gestor de referencias/servicio externo usa este cofre (si aplica) y la regla de exclusividad
  si corresponde (ej. "solo este cofre sube contenido a X, ningún otro").
- Dónde viven las credenciales de esas integraciones (siempre fuera del control de versiones,
  nunca en este archivo ni en `notas.md`).

## Continuidad entre equipos / herramientas

Nota para una sesión futura (de cualquier agente) sobre qué leer primero al abrir este cofre después
de un tiempo sin tocarlo — normalmente: este archivo completo, después `notas.md` completo antes de
asumir que no hay contexto previo.
