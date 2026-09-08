#!/usr/bin/env osascript

-- Sincronizador Obsidian → Google Drive (Automático)
-- Ejecuta: osascript /path/to/sync-obsidian-to-drive.applescript

use AppleScript version "2.4"
use scripting additions

-- Variables
set iCloudInboxPath to (POSIX path of (path to home folder)) & "Library/Mobile Documents/iCloud~md~obsidian/Documents/Tareas, entrelazadas/captura/inbox.md"
set googleDrivePath to (POSIX path of (path to home folder)) & "Google Drive/Mi unidad/Kanban fernanda/inbox-sync.md"

-- Función principal
on sincronizarArchivos()
	try
		-- Leer contenido de inbox.md desde iCloud
		set inboxContent to read iCloudInboxPath as «class utf8»

		-- Escribir en Google Drive
		set googleDriveFile to open for access googleDrivePath with write permission
		set eof googleDriveFile to 0
		write inboxContent to googleDriveFile
		close access googleDriveFile

		-- Log de éxito
		log "✅ Sincronizado: " & (current date) & " - " & (length of inboxContent) & " caracteres"

		return true

	on error errMsg
		log "❌ Error: " & errMsg
		return false
	end try
end sincronizarArchivos

-- Ejecutar
sincronizarArchivos()
