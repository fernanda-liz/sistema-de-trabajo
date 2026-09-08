const SHEET_ID = "1rorYYsWsfxXvQxHxISw9EMUcOlTldOggsTWUrOQ_VE4";
const DRIVE_FOLDER_ID = "1TtOXDXtS6evDZiI1WqQWYHzBEodseJUx8usJ4LMvpbVWaceYRUO-nefJ";
const SYNC_FILE_NAME = "inbox-sync.md";

// ============================================================
// SINCRONIZACIÓN AUTOMÁTICA DESDE OBSIDIAN
// ============================================================

function sincronizarDesdeObsidian() {
  try {
    Logger.log("🔄 Iniciando sincronización...");

    const files = DriveApp.getFolderById(DRIVE_FOLDER_ID)
      .getFilesByName(SYNC_FILE_NAME);

    if (!files.hasNext()) {
      Logger.log("⚠️ Archivo inbox-sync.md no encontrado");
      return { success: false, error: "Archivo no encontrado" };
    }

    const syncFile = files.next();
    const contenido = syncFile.getBlob().getDataAsString("UTF-8");

    Logger.log("📄 Contenido leído: " + contenido.length + " caracteres");

    const entradas = parsearEntradas(contenido);
    Logger.log("📝 Entradas detectadas: " + entradas.length);

    if (entradas.length === 0) {
      Logger.log("✅ Sin entradas nuevas");
      return { success: true, nuevas: 0 };
    }

    let procesadas = 0;
    entradas.forEach(entrada => {
      const resultado = procesarEntrada(entrada);
      if (resultado.success) procesadas++;
      Logger.log("  " + resultado.log);
    });

    Logger.log("✅ Sincronización completada: " + procesadas + " tareas nuevas");
    return { success: true, nuevas: procesadas };

  } catch(e) {
    Logger.log("❌ Error: " + e.toString());
    return { success: false, error: e.toString() };
  }
}

function parsearEntradas(contenido) {
  const lineas = contenido.split("\n");
  const indiceInicio = lineas.findIndex(l => l.trim() === "---");

  if (indiceInicio === -1) return [];

  const entradas = [];
  let bloqueActual = [];

  for (let i = indiceInicio + 1; i < lineas.length; i++) {
    if (lineas[i].trim() === "---") {
      if (bloqueActual.length > 0) {
        entradas.push(bloqueActual.join("\n"));
        bloqueActual = [];
      }
    } else {
      bloqueActual.push(lineas[i]);
    }
  }

  if (bloqueActual.length > 0) {
    entradas.push(bloqueActual.join("\n"));
  }

  return entradas.filter(e => e.trim().length > 20);
}

function procesarEntrada(contenido) {
  try {
    const lineas = contenido.trim().split("\n").filter(l => l.trim());

    if (lineas.length === 0) {
      return { success: false, log: "Entrada vacía" };
    }

    const titulo = extraerTitulo(lineas[0]);
    const subtareas = extraerSubtareas(contenido);
    const ambito = detectarAmbito(contenido);
    const tema = detectarTema(contenido);
    const id = generarID(titulo);

    if (tareaExiste(id)) {
      return { success: false, log: "⚠️ Tarea '" + id + "' ya existe" };
    }

    const sheet = getSheet();
    const fila = [
      ambito,
      titulo,
      tema,
      "",
      new Date().toISOString().split('T')[0],
      "Backlog",
      JSON.stringify(subtareas),
      id
    ];

    sheet.appendRow(fila);

    return {
      success: true,
      log: "✅ Agregada: " + id + " (" + subtareas.length + " subtareas)"
    };

  } catch(e) {
    return { success: false, log: "❌ Error: " + e.toString() };
  }
}

function extraerTitulo(primerLinea) {
  return primerLinea
    .replace(/^##\s+/, "")
    .replace(/^[-*]\s+/, "")
    .substring(0, 100)
    .trim();
}

function extraerSubtareas(contenido) {
  const subtareas = [];
  const lineas = contenido.split("\n");

  lineas.forEach(linea => {
    const match = linea.match(/^[\s]*[-*•]\s+\[?\s*\]?\s*(.+)$/);
    if (match && match[1]) {
      const texto = match[1].trim();
      if (texto.length > 3) {
        subtareas.push({
          nombre: texto.substring(0, 150),
          completada: false
        });
      }
    }
  });

  return subtareas.length > 0 ? subtareas : generarSubtareasAutomaticas(contenido);
}

function generarSubtareasAutomaticas(contenido) {
  const frases = contenido.split(/[.!?]\s+/).filter(f => f.length > 10);
  return frases.slice(0, 5).map(f => ({
    nombre: f.trim().substring(0, 100),
    completada: false
  }));
}

function detectarAmbito(contenido) {
  const ambitoMap = {
    "Trabajo": /trabajo|cema|ma3d|manufactura|site|kanban|impresion/i,
    "Tesis": /tesis|thesis|investigacion|research/i,
    "Diseño Industrial": /diseño|design|app|viewport|plantilla/i,
    "Impresión 3D": /bambu|prusa|printing|3d/i
  };

  for (const [ambito, regex] of Object.entries(ambitoMap)) {
    if (regex.test(contenido)) return ambito;
  }

  return "Trabajo";
}

function detectarTema(contenido) {
  const match = contenido.match(/#(\w+\/\w+)/);
  if (match) return match[1];

  const match2 = contenido.match(/tema:\s*(\w+)/i);
  if (match2) return match2[1];

  return "";
}

function generarID(titulo) {
  return titulo
    .toLowerCase()
    .replace(/[áéíóú]/g, (c) => ({á:'a', é:'e', í:'i', ó:'o', ú:'u'}[c]))
    .replace(/[^a-z0-9\s]/g, "")
    .split(/\s+/)
    .slice(0, 4)
    .join("-");
}

function tareaExiste(id) {
  const sheet = getSheet();
  const datos = sheet.getDataRange().getValues();

  for (let i = 1; i < datos.length; i++) {
    if (datos[i][7] === id) return true;
  }

  return false;
}

function getSheet() {
  return SpreadsheetApp.openById(SHEET_ID).getSheetByName("Hoja 1");
}

function crearTriggerAutomatico() {
  ScriptApp.newTrigger("sincronizarDesdeObsidian")
    .timeBased()
    .everyMinutes(5)
    .create();

  Logger.log("✅ Trigger creado: sincronización cada 5 minutos");
}

// ============================================================
// HTML / KANBAN WEB
// ============================================================

function doGet() {
  const html = `<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Kanban Tareas</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #f5f5f5; color: #333; padding: 20px; }
        .header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 30px; gap: 20px; flex-wrap: wrap; }
        .header h1 { font-size: 28px; font-weight: 700; color: #1a1a1a; }
        .filter-group { display: flex; gap: 10px; align-items: center; flex-wrap: wrap; margin-bottom: 20px; }
        .filter-group select { padding: 8px 12px; border: 2px solid #ddd; border-radius: 4px; }
        .kanban-container { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 20px; }
        .kanban-column { background: white; border-radius: 8px; padding: 15px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
        .kanban-column h3 { font-size: 16px; font-weight: 700; margin-bottom: 15px; display: flex; justify-content: space-between; }
        .kanban-count { background: #4CAF50; color: white; padding: 4px 10px; border-radius: 20px; font-size: 12px; }
        .kanban-items { min-height: 400px; display: flex; flex-direction: column; gap: 10px; }
        .kanban-item { background: #f9f9f9; border-left: 5px solid #4CAF50; padding: 12px; border-radius: 4px; cursor: pointer; transition: all 0.2s; }
        .kanban-item:hover { box-shadow: 0 2px 8px rgba(0,0,0,0.15); transform: translateY(-2px); }
        .kanban-item-title { font-weight: 600; font-size: 14px; margin-bottom: 8px; }
        .kanban-item-meta { font-size: 12px; color: #666; display: flex; flex-wrap: wrap; gap: 8px; }
        .kanban-item-tag { background: #e0e0e0; padding: 4px 10px; border-radius: 12px; font-size: 11px; }
        .stats { display: flex; gap: 20px; margin-bottom: 20px; flex-wrap: wrap; }
        .stat-box { background: white; border-radius: 8px; padding: 15px 20px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); text-align: center; }
        .stat-box .number { font-size: 28px; font-weight: 700; color: #4CAF50; }
        .error { color: #d32f2f; background: #ffebee; padding: 15px; border-radius: 8px; margin: 20px 0; }

        /* Modal */
        .modal { display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); z-index: 1000; align-items: center; justify-content: center; }
        .modal.active { display: flex; }
        .modal-content { background: white; border-radius: 12px; padding: 30px; max-width: 500px; width: 90%; max-height: 80vh; overflow-y: auto; box-shadow: 0 10px 40px rgba(0,0,0,0.2); }
        .modal-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; border-bottom: 2px solid #eee; padding-bottom: 15px; }
        .modal-header h2 { font-size: 20px; font-weight: 700; }
        .modal-close { background: #f0f0f0; border: none; width: 32px; height: 32px; border-radius: 50%; cursor: pointer; font-size: 20px; }
        .modal-close:hover { background: #e0e0e0; }

        .task-meta { background: #f5f5f5; padding: 12px; border-radius: 8px; margin-bottom: 20px; font-size: 13px; }
        .task-meta-item { margin-bottom: 8px; }
        .task-meta-label { font-weight: 600; color: #666; }

        .progress-section { margin-bottom: 20px; }
        .progress-label { font-weight: 600; margin-bottom: 8px; display: flex; justify-content: space-between; }
        .progress-bar { background: #e0e0e0; height: 8px; border-radius: 4px; overflow: hidden; }
        .progress-fill { background: #4CAF50; height: 100%; transition: width 0.3s; }

        .checklist { margin-bottom: 20px; }
        .checklist-item { display: flex; gap: 10px; margin-bottom: 10px; align-items: center; }
        .checklist-item input { cursor: pointer; width: 18px; height: 18px; }
        .checklist-item label { cursor: pointer; flex: 1; font-size: 14px; }
        .checklist-item input:checked + label { text-decoration: line-through; color: #999; }

        .modal-buttons { display: flex; gap: 10px; }
        .btn { padding: 10px 16px; border: none; border-radius: 6px; cursor: pointer; font-weight: 600; font-size: 14px; }
        .btn-primary { background: #4CAF50; color: white; }
        .btn-primary:hover { background: #45a049; }
        .btn-danger { background: #d32f2f; color: white; flex: 1; }
        .btn-danger:hover { background: #c62828; }
    </style>
</head>
<body>
    <div class="header">
        <h1>📋 Kanban Tareas</h1>
    </div>

    <div class="filter-group">
        <label for="filtroAmbito">Filtrar:</label>
        <select id="filtroAmbito" onchange="actualizarKanban()">
            <option value="">Todas</option>
            <option value="Trabajo">🟢 Trabajo</option>
            <option value="Tesis">🔵 Tesis</option>
            <option value="Diseño Industrial">🟠 Diseño Industrial</option>
            <option value="Impresión 3D">🟣 Impresión 3D</option>
        </select>
    </div>
    <div class="stats" id="stats"></div>
    <div id="error"></div>
    <div class="kanban-container" id="kanban"></div>

    <!-- Modal -->
    <div class="modal" id="modal">
        <div class="modal-content">
            <div class="modal-header">
                <h2 id="modalTitle">Tarea</h2>
                <button class="modal-close" onclick="cerrarModal()">✕</button>
            </div>

            <div class="task-meta" id="taskMeta"></div>

            <div class="progress-section">
                <div class="progress-label">
                    <span>Progreso</span>
                    <span id="progressText">0%</span>
                </div>
                <div class="progress-bar">
                    <div class="progress-fill" id="progressFill"></div>
                </div>
            </div>

            <div class="checklist" id="checklist"></div>

            <div class="modal-buttons">
                <button class="btn btn-danger" onclick="eliminarTarea()">🗑️ Descartar</button>
                <button class="btn btn-primary" onclick="guardarProgreso()">💾 Guardar</button>
            </div>
        </div>
    </div>

    <script>
        let todasLasTareas = [];
        let tareaActual = null;
        let subtareasActuales = [];

        const coloresAmbito = {
          "Trabajo": "#4CAF50",
          "Tesis": "#2196F3",
          "Diseño Industrial": "#FF9800",
          "Impresión 3D": "#9C27B0"
        };

        window.addEventListener('load', function() {
            cargarTareas();
        });

        function cargarTareas() {
            google.script.run.withSuccessHandler(function(result) {
                console.log("✅ Tareas cargadas:", result);
                if (result.error) {
                    document.getElementById('error').innerHTML = '<div class="error">❌ Error: ' + result.error + '</div>';
                    todasLasTareas = [];
                } else {
                    todasLasTareas = result.tareas || [];
                }
                actualizarKanban();
            }).withFailureHandler(function(error) {
                console.error("❌ Error:", error);
                document.getElementById('error').innerHTML = '<div class="error">❌ Error al cargar: ' + error + '</div>';
            }).obtenerTareas();
        }

        function actualizarKanban() {
            const filtro = document.getElementById('filtroAmbito').value;
            const tareasFiltradas = filtro ? todasLasTareas.filter(t => t.ambito === filtro) : todasLasTareas;
            renderizarKanban(tareasFiltradas);
            actualizarStats();
        }

        function renderizarKanban(tareas) {
            const estados = ['Backlog', 'En curso', 'Bloqueado', 'Terminado'];
            let html = '';

            estados.forEach(estado => {
                const tareasDelEstado = tareas.filter(t => t.estado === estado);
                html += '<div class="kanban-column"><h3>' + estado + '<span class="kanban-count">' + tareasDelEstado.length + '</span></h3><div class="kanban-items">';

                tareasDelEstado.forEach(tarea => {
                    const colorAmbito = coloresAmbito[tarea.ambito] || '#999';
                    html += '<div class="kanban-item" style="border-left-color: ' + colorAmbito + '" onclick="abrirModal(' + tarea.id.replace('t_', '') + ')"><div class="kanban-item-title">' + tarea.titulo + '</div><div class="kanban-item-meta"><span class="kanban-item-tag">' + tarea.ambito + '</span>' + (tarea.fecha ? '<span class="kanban-item-tag">📅 ' + tarea.fecha + '</span>' : '') + '</div></div>';
                });

                html += '</div></div>';
            });

            document.getElementById('kanban').innerHTML = html || '<div style="text-align:center;padding:40px;color:#999;">Cargando tareas...</div>';
        }

        function actualizarStats() {
            const stats = {
                'Backlog': todasLasTareas.filter(t => t.estado === 'Backlog').length,
                'En curso': todasLasTareas.filter(t => t.estado === 'En curso').length,
                'Bloqueado': todasLasTareas.filter(t => t.estado === 'Bloqueado').length,
                'Terminado': todasLasTareas.filter(t => t.estado === 'Terminado').length,
            };

            let html = '<div class="stat-box"><div class="number">' + todasLasTareas.length + '</div><div class="label">Total</div></div>';
            Object.keys(stats).forEach(estado => {
                html += '<div class="stat-box"><div class="number">' + stats[estado] + '</div><div class="label">' + estado + '</div></div>';
            });

            document.getElementById('stats').innerHTML = html;
        }

        function abrirModal(id) {
            tareaActual = todasLasTareas.find(t => t.id === 't_' + id);
            if (!tareaActual) return;

            document.getElementById('modalTitle').textContent = tareaActual.titulo;

            let metaHtml = '';
            if (tareaActual.ambito) metaHtml += '<div class="task-meta-item"><span class="task-meta-label">Ámbito:</span> ' + tareaActual.ambito + '</div>';
            if (tareaActual.tema) metaHtml += '<div class="task-meta-item"><span class="task-meta-label">Tema:</span> ' + tareaActual.tema + '</div>';
            if (tareaActual.estado) metaHtml += '<div class="task-meta-item"><span class="task-meta-label">Estado:</span> ' + tareaActual.estado + '</div>';
            if (tareaActual.fecha) metaHtml += '<div class="task-meta-item"><span class="task-meta-label">Fecha:</span> ' + tareaActual.fecha + '</div>';

            document.getElementById('taskMeta').innerHTML = metaHtml;

            cargarSubtareas();
            document.getElementById('modal').classList.add('active');
        }

        function cerrarModal() {
            document.getElementById('modal').classList.remove('active');
            tareaActual = null;
        }

        function cargarSubtareas() {
            google.script.run.withSuccessHandler(function(subtareas) {
                subtareasActuales = subtareas;
                renderizarChecklist();
                actualizarProgreso();
            }).obtenerSubtareas(tareaActual.id);
        }

        function renderizarChecklist() {
            let html = '<h3 style="font-weight: 600; margin-bottom: 12px;">✓ Checklist</h3>';

            if (subtareasActuales.length === 0) {
                html += '<p style="color: #999; font-size: 13px;">Sin subtareas registradas</p>';
            } else {
                subtareasActuales.forEach((subtarea, idx) => {
                    html += '<div class="checklist-item">';
                    html += '<input type="checkbox" id="sub_' + idx + '" ' + (subtarea.completada ? 'checked' : '') + ' onchange="actualizarProgreso()">';
                    html += '<label for="sub_' + idx + '">' + subtarea.nombre + '</label>';
                    html += '</div>';
                });
            }

            document.getElementById('checklist').innerHTML = html;
        }

        function actualizarProgreso() {
            const checkboxes = document.querySelectorAll('.checklist-item input');
            const completadas = Array.from(checkboxes).filter(cb => cb.checked).length;
            const total = checkboxes.length;
            const porcentaje = total === 0 ? 0 : Math.round((completadas / total) * 100);

            document.getElementById('progressFill').style.width = porcentaje + '%';
            document.getElementById('progressText').textContent = porcentaje + '%';
        }

        function guardarProgreso() {
            const checkboxes = document.querySelectorAll('.checklist-item input');
            const nuevasSubtareas = subtareasActuales.map((subtarea, idx) => ({
                nombre: subtarea.nombre,
                completada: checkboxes[idx].checked
            }));

            google.script.run.withSuccessHandler(function() {
                alert('✅ Progreso guardado');
                cerrarModal();
                cargarTareas();
            }).guardarSubtareas(tareaActual.id, nuevasSubtareas);
        }

        function eliminarTarea() {
            if (confirm('¿Estás seguro de que quieres descartar esta tarea?')) {
                google.script.run.withSuccessHandler(function() {
                    alert('✅ Tarea eliminada');
                    cerrarModal();
                    cargarTareas();
                }).eliminarTarea(tareaActual.id);
            }
        }

        document.addEventListener('click', function(e) {
            const modal = document.getElementById('modal');
            if (e.target === modal) {
                cerrarModal();
            }
        });
    </script>
</body>
</html>`;

  return HtmlService.createHtmlOutput(html).setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

// ============================================================
// FUNCIONES DE LECTURA DE TAREAS
// ============================================================

function obtenerTareas() {
  try {
    const sheet = getSheet();
    const datos = sheet.getDataRange().getValues();

    if (datos.length < 2) {
      return { error: "El Sheet está vacío", tareas: [] };
    }

    const tareas = [];
    for (let i = 1; i < datos.length; i++) {
      const fila = datos[i];

      if (fila[1] && fila[1].toString().trim()) {
        tareas.push({
          id: 't_' + i,
          fila: i,
          ambito: (fila[0] || "Trabajo").toString().trim(),
          titulo: fila[1].toString().trim(),
          tema: fila[2] ? fila[2].toString().trim() : "",
          subtema: fila[3] ? fila[3].toString().trim() : "",
          fecha: fila[4] ? fila[4].toString().split('T')[0] : "",
          estado: (fila[5] || "Backlog").toString().trim(),
          subtareas: fila[6] ? JSON.parse(fila[6]) : [],
          id_unico: fila[7] ? fila[7].toString().trim() : ""
        });
      }
    }

    return { tareas: tareas };
  } catch(e) {
    Logger.log("❌ Error:", e.toString());
    return { error: e.toString(), tareas: [] };
  }
}

function obtenerSubtareas(tareaId) {
  try {
    const sheet = getSheet();
    const datos = sheet.getDataRange().getValues();
    const fila = parseInt(tareaId.replace('t_', ''));

    if (datos[fila] && datos[fila][6]) {
      return JSON.parse(datos[fila][6]);
    }

    return [];
  } catch(e) {
    return [];
  }
}

function guardarSubtareas(tareaId, subtareas) {
  try {
    const sheet = getSheet();
    const fila = parseInt(tareaId.replace('t_', ''));
    sheet.getRange(fila, 7).setValue(JSON.stringify(subtareas));
    return true;
  } catch(e) {
    return false;
  }
}

function eliminarTarea(tareaId) {
  try {
    const sheet = getSheet();
    const fila = parseInt(tareaId.replace('t_', ''));
    sheet.deleteRow(fila);
    return true;
  } catch(e) {
    return false;
  }
}
