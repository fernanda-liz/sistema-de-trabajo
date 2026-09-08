# Sincronización Obsidian → Google Sheet → Kanban Web

Automatización completa para capturar tareas en Obsidian y sincronizarlas a un Kanban web interactivo, sin intervención manual.

## Arquitectura

```
┌─────────────────┐
│  Obsidian       │  ← Usuario escribe en captura/inbox.md
│  (iCloud)       │
└────────┬────────┘
         │
    [AppleScript cada 5 min]
         │
         ↓
┌─────────────────┐
│  Google Drive   │  ← Archivo inbox-sync.md
│  Kanban Fernanda│
└────────┬────────┘
         │
    [AppScript cada 5 min]
         │
         ↓
┌─────────────────┐
│  Google Sheet   │  ← Fuente única de verdad
│  (49 tareas)    │     Ámbito | Tarea | Tema | Subtema | Fecha | Estado | Subtareas (JSON) | ID
└────────┬────────┘
         │
         ↓
┌─────────────────┐
│  Kanban Web     │  ← Visualización interactiva
│  (Drag-drop)    │     - 4 columnas (Backlog → En curso → Bloqueado → Terminado)
│  Modal + checklist│   - Modal con checklist de subtareas
└─────────────────┘   - Progreso en % automático
```

## Componentes

### 1. AppleScript (Sincronización iCloud → Google Drive)

**Archivo:** `sync-obsidian-to-drive.applescript`  
**Instalar en:** `~/sync-obsidian-to-drive.applescript`

```applescript
#!/usr/bin/env osascript

use AppleScript version "2.4"
use scripting additions

set iCloudInboxPath to (POSIX path of (path to home folder)) & "Library/Mobile Documents/iCloud~md~obsidian/Documents/Tareas, entrelazadas/captura/inbox.md"
set googleDrivePath to (POSIX path of (path to home folder)) & "Google Drive/Mi unidad/Kanban fernanda/inbox-sync.md"

on sincronizarArchivos()
	try
		set inboxContent to read iCloudInboxPath as «class utf8»
		set googleDriveFile to open for access googleDrivePath with write permission
		set eof googleDriveFile to 0
		write inboxContent to googleDriveFile
		close access googleDriveFile
		log "✅ Sincronizado: " & (current date) & " - " & (length of inboxContent) & " caracteres"
		return true
	on error errMsg
		log "❌ Error: " & errMsg
		return false
	end try
end sincronizarArchivos

sincronizarArchivos()
```

**Instalar LaunchAgent:**

1. Copiar `com.obsidian.sync.kanban.plist` a `~/Library/LaunchAgents/`
2. Ejecutar: `launchctl load ~/Library/LaunchAgents/com.obsidian.sync.kanban.plist`
3. Verificar: `launchctl list | grep obsidian`

**Archivo plist:**

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
	<key>Label</key>
	<string>com.obsidian.sync.kanban</string>
	<key>ProgramArguments</key>
	<array>
		<string>/usr/bin/osascript</string>
		<string>/Users/fcabezas/sync-obsidian-to-drive.applescript</string>
	</array>
	<key>StartInterval</key>
	<integer>300</integer>
	<key>StandardOutPath</key>
	<string>/Users/fcabezas/Library/Logs/obsidian-sync.log</string>
	<key>StandardErrorPath</key>
	<string>/Users/fcabezas/Library/Logs/obsidian-sync-error.log</string>
	<key>RunAtLoad</key>
	<true/>
</dict>
</plist>
```

### 2. Google Apps Script (Procesar → Sheet → Kanban Web)

**Proyecto:** "Kanban Tareas"  
**Sheet ID:** `1rorYYsWsfxXvQxHxISw9EMUcOlTldOggsTWUrOQ_VE4`  
**Drive Folder:** `1TtOXDXtS6evDZiI1WqQWYHzBEodseJUx8usJ4LMvpbVWaceYRUO-nefJ` (Kanban Fernanda)

Pegar el código completo en `https://script.google.com` → Proyecto "Kanban Tareas":

- `sincronizarDesdeObsidian()` — Ejecuta cada 5 min
- `parsearEntradas()` — Divide entradas por `---`
- `procesarEntrada()` — Parsea título, subtareas, ámbito, tema
- `generarID()` — Crea ID único (kebab-case)
- `tareaExiste()` — Evita duplicados
- `crearTriggerAutomatico()` — Ejecutar UNA SOLA VEZ en consola

**Crear trigger:**
```javascript
crearTriggerAutomatico()
```

Ejecutar en la consola de AppScript (Ejecutar → crearTriggerAutomatico).

### 3. Kanban Web (Visualización)

**URL:** https://script.google.com/macros/s/AKfycbzS3lgy6S80QTVmKm5vBR2DgxjZeAKzJG2TDaNijyRkvKaaZikFgiHEEZiTPo71xXgc/exec

**Características:**
- 4 columnas: Backlog → En curso → Bloqueado → Terminado
- Filtro por ámbito (Trabajo, Tesis, Diseño Industrial, Impresión 3D)
- Modal interactivo al hacer clic en tarjeta
- Checklist de subtareas con progreso en %
- Botón para eliminar tarea

## Flujo de Uso

### Captura (Sin clasificar)

1. Abre Obsidian → `captura/inbox.md`
2. Escribe nuevas entradas **AL INICIO** (arriba), separadas por `---`

```markdown
---

## [NUEVAS ENTRADAS - ESCRIBE AQUÍ]

Tarea de prueba para verificar sincronización
- [ ] Subtarea 1
- [ ] Subtarea 2

---

## [Fecha anterior] (✅ TRIADO)
...
```

### Sincronización Automática

- **AppleScript** → Copia `inbox.md` → `inbox-sync.md` (cada 5 min)
- **AppScript** → Lee `inbox-sync.md` → Agrega a Sheet (cada 5 min)
- **Kanban Web** → Actualiza automáticamente al leer Sheet

### Triaje Inteligente (Manual)

Cuando tengas entradas nuevas:

1. Pide: **"triaje"**
2. Claude propone: Ámbito, tema, tipo (tarea/idea)
3. Confirmas o corriges
4. Claude ejecuta: Actualiza `kanban/[ambito].md`, `ambitos/[ambito].md`, `log.md`

## Instalación Completa (macOS)

### Requisitos
- macOS 10.13+
- Obsidian instalado
- Google Drive sincronizado (`~/Google Drive/`)
- Acceso a Google Apps Script

### Pasos

1. **Copiar AppleScript:**
   ```bash
   cp sync-obsidian-to-drive.applescript ~/sync-obsidian-to-drive.applescript
   chmod +x ~/sync-obsidian-to-drive.applescript
   ```

2. **Instalar LaunchAgent:**
   ```bash
   cp com.obsidian.sync.kanban.plist ~/Library/LaunchAgents/
   launchctl load ~/Library/LaunchAgents/com.obsidian.sync.kanban.plist
   ```

3. **Verificar instalación:**
   ```bash
   launchctl list | grep obsidian
   ```
   Debería salir una línea con `com.obsidian.sync.kanban`.

4. **Google Apps Script:**
   - Ir a: https://script.google.com
   - Proyecto: "Kanban Tareas"
   - Pegar código completo de `kanban-appscript-auto-sync.gs`
   - Guardar
   - Ejecutar `crearTriggerAutomatico()` UNA SOLA VEZ en la consola

5. **Crear archivo en Google Drive:**
   - Abrir https://drive.google.com
   - Carpeta: "Kanban fernanda"
   - Nuevo → Crear documento
   - Nombre: `inbox-sync.md`
   - Guardar

6. **Test:**
   - Escribir en `captura/inbox.md` de Obsidian
   - Esperar máximo 5 minutos
   - Abrir Kanban web: https://script.google.com/macros/s/AKfycbzS3lgy6S80QTVmKm5vBR2DgxjZeAKzJG2TDaNijyRkvKaaZikFgiHEEZiTPo71xXgc/exec
   - La tarea debería aparecer en "Backlog"

## Troubleshooting

### AppleScript no sincroniza
```bash
# Verificar si LaunchAgent está cargado
launchctl list | grep obsidian

# Si no está, cargar:
launchctl load ~/Library/LaunchAgents/com.obsidian.sync.kanban.plist

# Ver logs:
tail -f ~/Library/Logs/obsidian-sync.log
```

### Kanban web no actualiza
1. Ejecutar `sincronizarDesdeObsidian()` manualmente en AppScript
2. Verificar que `inbox-sync.md` existe en Google Drive
3. Revisar logs en consola de AppScript (Ejecutar)

### Archivo inbox-sync.md no encontrado
1. Crear manualmente en Google Drive
2. Nombre exacto: `inbox-sync.md`
3. Ubicación: Carpeta "Kanban fernanda"

## Estructura de Datos (Sheet)

| A | B | C | D | E | F | G | H |
|---|---|---|---|---|---|---|---|
| Ámbito | Tarea | Tema | Subtema | Fecha | Estado | Subtareas (JSON) | ID |
| Trabajo | Título de tarea | tema/subtema | - | 2026-09-08 | Backlog | `[{"nombre":"...", "completada":false}]` | tarea-id |

## Notas

- **Nunca borrar** `captura/inbox.md` — archivo es histórico
- **Archivar** después de triaje: crear `captura/inbox-archive-YYYY-MM-DD.md`
- **IDs únicos** generados automáticamente (kebab-case)
- **Trigger automático** ejecuta cada 5 minutos (configurable)
- **Sin costo recurrente** — AppleScript nativo + Google Apps Script gratis

---

**Últimas actualizaciones:** 2026-09-08  
**Autor:** Fernanda Cabezas  
**Generado con Claude Code**
