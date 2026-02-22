import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Settings, Clock, AlertTriangle, Activity, CheckCircle2, FileSpreadsheet, X } from 'lucide-react';

// --- DATOS EXTRAÍDOS DEL EXCEL: HOJA "DETALLE" ---
const DETALLE_INSTRUCCIONES = [
  { id: 1, text: 'Ingresar el % de avance de la actividad, esta puede ir del 0% al 100%' },
  { id: 2, text: 'Ingresar la actividad a realizar' },
  { id: 3, text: 'Ingresar el tiempo programado de la actividad' },
  { id: 4, text: 'Ingresar el tiempo de ejecución real de la actividad' },
  { id: 5, text: 'Ingresar la letra " C " e inmediatamente se pintará del color azul la cual indica el tiempo de la actividad programada' },
  { id: 6, text: 'Ingresar la letra " X " e inmediatamente se pintará del color verde la cual indica el avance real que tiene la actividad / al ingresar la letra "D" indica inmediatamente se pintará de color rojo la cual indica desvió' },
  { id: 7, text: 'Ingresar el día de la actividad programada' },
  { id: 8, text: 'Leyenda: la letra "C " indica el color azul , la letra "X" Indica el color verde, la letra "D" indica el color rojo' },
  { id: 9, text: 'Nombre del formato " Ruta Crítica"' },
  { id: 10, text: 'Logo "SOFTYS"' },
  { id: 11, text: 'Ingresar los horarios definidos' },
  { id: 12, text: 'Responsable de la tarea a ejecutar' },
];

// --- DATOS EXTRAÍDOS DEL EXCEL: HOJA "FORMATO" ---
const INITIAL_TASKS = [
  { id: 1, name: 'Parada de MP01', responsable: 'NOLBER RODRIGUEZ', supervisor: '-', tec1: '-', tec2: '-', tec3: '-', tec4: '-', hInicial: '06:00', hFinal: '08:00', tiempo: '02:00', planned: { '06:00': true, '07:00': true }, actual: {} },
  { id: 2, name: 'Cambio de trasmisor de presión de caja de entrada', responsable: 'JAVIER HURTADO', supervisor: 'JAVIER HURTADO', tec1: 'AHUARCAYA', tec2: '-', tec3: '-', tec4: '-', hInicial: '08:00', hFinal: '09:00', tiempo: '01:00', planned: { '08:00': true }, actual: {} },
  { id: 3, name: 'Inspección de encoders de motor de formador', responsable: 'CHRISTIAN MENDOZA', supervisor: 'CMENDOZA', tec1: 'LPADILLA', tec2: '-', tec3: '-', tec4: '-', hInicial: '09:00', hFinal: '10:00', tiempo: '01:00', planned: { '09:00': true }, actual: {} },
  { id: 4, name: 'Isnpección de Encoders de motor de fieltro', responsable: 'CHRISTIAN MENDOZA', supervisor: 'CMENDOZA', tec1: 'LPADILLA', tec2: '-', tec3: '-', tec4: '-', hInicial: '10:00', hFinal: '11:00', tiempo: '01:00', planned: { '10:00': true }, actual: {} },
  { id: 5, name: 'Inspeción de Encoder de 2 motores de Fan Pump', responsable: 'CHRISTIAN MENDOZA', supervisor: 'CMENDOZA', tec1: 'LPADILLA', tec2: '-', tec3: '-', tec4: '-', hInicial: '11:00', hFinal: '11:30', tiempo: '00:30', planned: { '11:00': true }, actual: {} },
  { id: 6, name: 'Inspección de los difusores de la caja de entrada', responsable: 'FABRICACIÓN', supervisor: 'EGALINDO', tec1: '-', tec2: '-', tec3: '-', tec4: '-', hInicial: '11:00', hFinal: '12:00', tiempo: '01:00', planned: { '11:00': true }, actual: {} },
  { id: 7, name: 'Sellar pequeña fuga pasta en la entrada de bomba FP', responsable: 'JUAN RAMIREZ', supervisor: 'DAVID ACEVEDO', tec1: 'RTELLO', tec2: 'LEONARDO', tec3: 'LFELIX', tec4: '-', hInicial: '09:00', hFinal: '12:00', tiempo: '03:00', planned: { '09:00': true, '10:00': true, '11:00': true }, actual: {} },
  { id: 8, name: 'Validar GAP del Labio', responsable: 'FABRICACIÓN', supervisor: 'EGALINDO', tec1: '-', tec2: '-', tec3: '-', tec4: '-', hInicial: '11:00', hFinal: '11:15', tiempo: '00:15', planned: { '11:00': true }, actual: {} },
  { id: 9, name: 'Validar GAP de Cabecero y formador', responsable: 'FABRICACIÓN', supervisor: 'EGALINDO', tec1: '-', tec2: '-', tec3: '-', tec4: '-', hInicial: '11:15', hFinal: '11:30', tiempo: '00:15', planned: { '11:00': true }, actual: {} },
  { id: 10, name: 'Validar GAP Yankee y Prensa', responsable: 'FABRICACIÓN', supervisor: 'EGALINDO', tec1: '-', tec2: '-', tec3: '-', tec4: '-', hInicial: '11:30', hFinal: '11:45', tiempo: '00:15', planned: { '11:00': true }, actual: {} },
  { id: 11, name: 'Cambiar tela', responsable: 'FABRICACIÓN', supervisor: 'EGALINDO', tec1: '-', tec2: '-', tec3: '-', tec4: '-', hInicial: '08:00', hFinal: '11:00', tiempo: '03:00', planned: { '08:00': true, '09:00': true, '10:00': true }, actual: {} },
  { id: 12, name: 'Validar diametros de rodillos accionados', responsable: 'DIEGO VARGAS', supervisor: 'JERRY PEÑA', tec1: 'CAHUIN', tec2: 'JMARCELO', tec3: 'HQUISPE', tec4: '-', hInicial: '14:00', hFinal: '16:00', tiempo: '02:00', planned: { '14:00': true, '15:00': true }, actual: {} },
  { id: 13, name: 'Cambiar el flujometro de la bomba de pasta (BB 02)', responsable: 'JAVIER HURTADO', supervisor: 'JAVIER HURTADO', tec1: '-', tec2: '-', tec3: '-', tec4: '-', hInicial: '10:00', hFinal: '12:00', tiempo: '02:00', planned: { '10:00': true, '11:00': true }, actual: {} },
  { id: 14, name: 'Vaciar tanque TQ2 de la bomba 02 para inspeccionar', responsable: 'FABRICACIÓN', supervisor: 'EGALINDO', tec1: '-', tec2: '-', tec3: '-', tec4: '-', hInicial: '11:00', hFinal: '12:00', tiempo: '01:00', planned: { '11:00': true }, actual: {} },
  { id: 15, name: 'Abrir la bomba BB02 e inspeccionar', responsable: 'DIEGO VARGAS', supervisor: 'JERRY PEÑA', tec1: 'CAHUIN', tec2: 'DPACHAS', tec3: 'HQUISPE', tec4: '-', hInicial: '08:00', hFinal: '10:30', tiempo: '02:30', planned: { '08:00': true, '09:00': true, '10:00': true }, actual: {} },
  { id: 16, isSubtask: true, name: 'Abrir Bomba BB02', responsable: '-', supervisor: '-', tec1: '-', tec2: '-', tec3: '-', tec4: '-', hInicial: '08:00', hFinal: '09:00', tiempo: '01:00', planned: { '08:00': true }, actual: {} },
  { id: 17, isSubtask: true, name: 'Inspeccionar bomba', responsable: '-', supervisor: '-', tec1: '-', tec2: '-', tec3: '-', tec4: '-', hInicial: '09:00', hFinal: '09:30', tiempo: '00:30', planned: { '09:00': true }, actual: {} },
  { id: 18, isSubtask: true, name: 'Montar bomba', responsable: '-', supervisor: '-', tec1: '-', tec2: '-', tec3: '-', tec4: '-', hInicial: '09:30', hFinal: '10:30', tiempo: '01:00', planned: { '09:00': true, '10:00': true }, actual: {} },
  { id: 19, name: 'Abrir la Fam Pump', responsable: 'DIEGO VARGAS', supervisor: 'JERRY PEÑA', tec1: 'HQUISPE', tec2: 'CSANTAMARIA', tec3: 'CAHUIN', tec4: 'JMARCELO', hInicial: '09:00', hFinal: '17:00', tiempo: '08:00', planned: { '09:00': true, '10:00': true, '11:00': true, '12:00': true, '13:00': true, '14:00': true, '15:00': true, '16:00': true }, actual: {} },
  { id: 20, isSubtask: true, name: 'Despinchar la Fam Pump', responsable: '-', supervisor: '-', tec1: '-', tec2: '-', tec3: '-', tec4: '-', hInicial: '08:00', hFinal: '09:00', tiempo: '01:00', planned: { '08:00': true }, actual: {} },
  { id: 21, isSubtask: true, name: 'Desmontar la Fam Pump', responsable: '-', supervisor: '-', tec1: '-', tec2: '-', tec3: '-', tec4: '-', hInicial: '09:00', hFinal: '13:00', tiempo: '04:00', planned: { '09:00': true, '10:00': true, '11:00': true, '12:00': true }, actual: {} },
  { id: 22, isSubtask: true, name: 'Inspeccionar la Fam pump', responsable: '-', supervisor: '-', tec1: '-', tec2: '-', tec3: '-', tec4: '-', hInicial: '10:00', hFinal: '11:00', tiempo: '01:00', planned: { '10:00': true }, actual: {} },
  { id: 23, isSubtask: true, name: 'Montar la Fam Pump', responsable: '-', supervisor: '-', tec1: '-', tec2: '-', tec3: '-', tec4: '-', hInicial: '11:00', hFinal: '14:00', tiempo: '03:00', planned: { '11:00': true, '12:00': true, '13:00': true }, actual: {} },
  { id: 24, name: 'Validad y calibrar los Dumpers de la capota', responsable: 'JAVIER HURTADO', supervisor: 'JAVIER HURTADO', tec1: 'AHUARCAYA', tec2: '-', tec3: '-', tec4: '-', hInicial: '09:00', hFinal: '15:00', tiempo: '06:00', planned: { '09:00': true, '10:00': true, '11:00': true, '12:00': true, '13:00': true, '14:00': true }, actual: {} },
  { id: 25, name: 'Correctivo en Bomba Aurora', responsable: 'DIEGO VARGAS', supervisor: 'JERRY PEÑA', tec1: 'JMARCELO', tec2: '-', tec3: '-', tec4: '-', hInicial: '08:00', hFinal: '12:00', tiempo: '04:00', planned: { '08:00': true, '09:00': true, '10:00': true, '11:00': true }, actual: {} },
  { id: 26, name: 'Reparación de regadera de MP1', responsable: 'JUAN RAMIREZ', supervisor: 'DAVID ACEVEDO', tec1: 'RTELLO', tec2: 'LEONARDO', tec3: 'LFELIX', tec4: '-', hInicial: '12:00', hFinal: '16:00', tiempo: '04:00', planned: { '12:00': true, '13:00': true, '14:00': true, '15:00': true }, actual: {} },
  { id: 27, name: 'Cambio de manguera valvula VV078', responsable: 'JAVIER HURTADO', supervisor: 'VALERIO RAMIREZ', tec1: 'CMATEO', tec2: '-', tec3: '-', tec4: '-', hInicial: '08:00', hFinal: '11:00', tiempo: '03:00', planned: { '08:00': true, '09:00': true, '10:00': true }, actual: {} },
  { id: 28, name: 'Limpieza de HVAC RTU 101 Y RTU 102', responsable: 'CHRISTIAN MENDOZA', supervisor: 'LPADILLA', tec1: 'LSIFUENTES', tec2: '-', tec3: '-', tec4: '-', hInicial: '08:00', hFinal: '16:00', tiempo: '08:00', planned: { '08:00': true, '09:00': true, '10:00': true, '11:00': true, '12:00': true, '13:00': true, '14:00': true, '15:00': true }, actual: {} },
  { id: 29, isSubtask: true, name: 'Inspección y limpieza', responsable: '-', supervisor: '-', tec1: '-', tec2: '-', tec3: '-', tec4: '-', hInicial: '08:00', hFinal: '13:00', tiempo: '05:00', planned: { '08:00': true, '09:00': true, '10:00': true, '11:00': true, '12:00': true }, actual: {} },
  { id: 30, isSubtask: true, name: 'Cambio de filtro', responsable: '-', supervisor: '-', tec1: '-', tec2: '-', tec3: '-', tec4: '-', hInicial: '13:00', hFinal: '16:00', tiempo: '03:00', planned: { '13:00': true, '14:00': true, '15:00': true }, actual: {} }
];

const HOURS = Array.from({ length: 24 }, (_, i) => `${i.toString().padStart(2, '0')}:00`);

export default function App() {
  const [tasks, setTasks] = useState(INITIAL_TASKS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Referencias y estados para el Scroll Sincronizado
  const topScrollRef = useRef(null);
  const bottomScrollRef = useRef(null);
  const [tableWidth, setTableWidth] = useState(0);

  // Calcula dinámicamente el ancho de la tabla para que la barra de arriba sea exacta
  useEffect(() => {
    if (!bottomScrollRef.current) return;
    const observer = new ResizeObserver(entries => {
      for (let entry of entries) {
        setTableWidth(entry.target.scrollWidth);
      }
    });
    observer.observe(bottomScrollRef.current);
    return () => observer.disconnect();
  }, []);

  // Funciones para sincronizar el movimiento de ambas barras
  const handleTopScroll = () => {
    if (bottomScrollRef.current && topScrollRef.current) {
      bottomScrollRef.current.scrollLeft = topScrollRef.current.scrollLeft;
    }
  };

  const handleBottomScroll = () => {
    if (topScrollRef.current && bottomScrollRef.current) {
      topScrollRef.current.scrollLeft = bottomScrollRef.current.scrollLeft;
    }
  };

  const togglePlanned = (taskId, hour) => {
    setTasks(tasks.map(task => {
      if (task.id === taskId) {
        const isPlanned = !!task.planned[hour];
        const newPlanned = { ...task.planned };
        if (isPlanned) delete newPlanned[hour];
        else newPlanned[hour] = true;
        return { ...task, planned: newPlanned };
      }
      return task;
    }));
  };

  const toggleActual = (taskId, hour) => {
    setTasks(tasks.map(task => {
      if (task.id === taskId) {
        const current = task.actual[hour];
        let next = null;
        if (!current) next = 'X';
        else if (current === 'X') next = 'D';
        else next = null;
        const newActual = { ...task.actual };
        if (next) newActual[hour] = next;
        else delete newActual[hour];
        return { ...task, actual: newActual };
      }
      return task;
    }));
  };

  const getTaskProgress = (task) => {
    const plannedCount = Object.keys(task.planned).length;
    if (plannedCount === 0) return 0;
    const actualCount = Object.values(task.actual).filter(v => v === 'X').length;
    return Math.min(100, Math.round((actualCount / plannedCount) * 100)); 
  };

  const stats = useMemo(() => {
    let totalActividades = tasks.length;
    let totalProgreso = 0;
    let totalDesvios = 0;
    tasks.forEach(t => {
      totalProgreso += getTaskProgress(t);
      Object.values(t.actual).forEach(val => {
        if (val === 'D') totalDesvios++;
      });
    });
    let progresoPromedio = totalActividades > 0 ? Math.round(totalProgreso / totalActividades) : 0;
    return { totalActividades, progresoPromedio, totalDesvios };
  }, [tasks]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans relative">
      {/* HEADER CORPORATIVO */}
      <header className="bg-slate-900 text-white p-4 shadow-md">
        <div className="max-w-[1600px] mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-white text-blue-900 font-black text-xl px-3 py-1 rounded tracking-widest border-2 border-blue-400">
              SOFTYS
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-100">RUTA CRÍTICA MP01</h1>
              <p className="text-sm text-slate-400">Parada de Planta - Control Avanzado</p>
            </div>
          </div>

          <div className="flex gap-6 bg-slate-800 p-2 rounded-lg border border-slate-700">
            <div className="flex items-center gap-2">
              <Activity className="text-blue-400 w-5 h-5" />
              <div>
                <p className="text-xs text-slate-400">Progreso Total</p>
                <p className="text-lg font-bold">{stats.progresoPromedio}%</p>
              </div>
            </div>
            <div className="w-px bg-slate-700"></div>
            <div className="flex items-center gap-2">
              <AlertTriangle className={stats.totalDesvios > 0 ? "text-red-400 w-5 h-5" : "text-slate-500 w-5 h-5"} />
              <div>
                <p className="text-xs text-slate-400">Desvíos (Horas)</p>
                <p className="text-lg font-bold">{stats.totalDesvios}</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* ÁREA PRINCIPAL */}
      <main className="flex-1 p-4 max-w-[1600px] mx-auto w-full flex flex-col gap-4 overflow-hidden">
        
        {/* PANEL DE CONTROL Y LEYENDA */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 flex flex-wrap justify-between items-center gap-4">
          
          <div className="flex items-center gap-4">
            {/* BOTÓN: Diligencia - Detalle */}
            <button 
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg shadow-sm font-semibold transition-colors text-sm border border-green-800"
            >
              <FileSpreadsheet className="w-4 h-4" />
              Diligencia - Detalle
            </button>
            <div className="h-6 w-px bg-gray-300"></div>
            <div className="flex items-center gap-2">
              <Settings className="w-5 h-5 text-gray-500" />
              <span className="font-semibold text-gray-700 text-sm">Cálculo de avance automático basado en la proporción de C vs X.</span>
            </div>
          </div>

          <div className="flex gap-6">
            <div className="flex flex-col text-xs text-gray-500 border-r pr-4 border-gray-200">
              <span className="font-semibold mb-1">Mitad Superior:</span>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-blue-500 text-[8px] text-white flex items-center justify-center font-bold rounded-sm">C</div>
                <span>Programado (Clic para editar)</span>
              </div>
            </div>
            <div className="flex flex-col text-xs text-gray-500">
              <span className="font-semibold mb-1">Mitad Inferior:</span>
              <div className="flex gap-3">
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 bg-green-500 text-[8px] text-white flex items-center justify-center font-bold rounded-sm">X</div>
                  <span>Real (Ejecutado)</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 bg-red-500 text-[8px] text-white flex items-center justify-center font-bold rounded-sm">D</div>
                  <span>Desvío</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CONTENEDOR DEL GANTT */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 flex-1 overflow-hidden flex flex-col relative">
          
          {/* BARRA DE DESPLAZAMIENTO SUPERIOR (Sincronizada) */}
          <div 
            ref={topScrollRef}
            onScroll={handleTopScroll}
            className="w-full overflow-x-auto custom-scrollbar border-b border-gray-200 bg-slate-50 sticky top-0 z-40"
          >
            {/* Div fantasma para igualar el ancho de la tabla inferior */}
            <div style={{ width: `${tableWidth}px`, height: '1px' }}></div>
          </div>

          {/* TABLA PRINCIPAL CON SU PROPIO SCROLL (Inferior) */}
          <div 
            ref={bottomScrollRef}
            onScroll={handleBottomScroll}
            className="overflow-x-auto flex-1 custom-scrollbar"
          >
            <table className="w-full border-collapse text-sm text-left">
              {/* CABECERA DE LA TABLA */}
              <thead className="bg-slate-100 sticky top-0 z-20 text-slate-700">
                <tr>
                  <th className="sticky left-0 bg-slate-100 border-b border-r border-gray-300 p-3 min-w-[90px] z-30 shadow-[2px_0_5px_rgba(0,0,0,0.05)] text-center">
                    % Avance
                  </th>
                  <th className="sticky left-[90px] bg-slate-100 border-b border-r border-gray-400 p-3 min-w-[280px] max-w-[280px] z-30 shadow-[4px_0_6px_rgba(0,0,0,0.05)]">
                    Actividades Principales Parada
                  </th>
                  <th className="bg-slate-50 border-b border-r border-gray-300 p-3 min-w-[120px] font-semibold">Responsable</th>
                  <th className="bg-slate-50 border-b border-r border-gray-300 p-3 min-w-[120px] font-semibold">Supervisor</th>
                  <th className="bg-slate-50 border-b border-r border-gray-300 p-3 min-w-[90px] font-semibold">Tec1</th>
                  <th className="bg-slate-50 border-b border-r border-gray-300 p-3 min-w-[90px] font-semibold">Tec2</th>
                  <th className="bg-slate-50 border-b border-r border-gray-300 p-3 min-w-[90px] text-center font-semibold">H. Inicial</th>
                  <th className="bg-slate-50 border-b border-r border-gray-300 p-3 min-w-[90px] text-center font-semibold">H. Final</th>
                  <th className="bg-slate-50 border-b border-r border-gray-400 p-3 min-w-[80px] text-center font-semibold shadow-[4px_0_6px_rgba(0,0,0,0.05)]">Tiempo</th>
                  
                  {HOURS.map(hour => (
                    <th key={hour} className="border-b border-r border-gray-300 p-1 min-w-[44px] text-center text-xs font-semibold text-slate-600 bg-slate-50">
                      <div className="flex flex-col items-center">
                        <span>{hour.split(':')[0]}</span>
                        <span className="text-[10px] text-slate-400 font-normal">00</span>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>

              {/* CUERPO DE LA TABLA */}
              <tbody>
                {tasks.map((task) => {
                  const progress = getTaskProgress(task);
                  return (
                  <tr key={task.id} className="group hover:bg-blue-50/20 transition-colors border-b border-gray-200">
                    
                    <td className="sticky left-0 bg-white group-hover:bg-blue-50/90 border-r border-gray-200 p-2 z-10 shadow-[2px_0_5px_rgba(0,0,0,0.02)] align-middle">
                      <div className="flex flex-col items-center gap-1 w-full px-2">
                        <div className="flex items-center gap-1 font-bold text-slate-700">
                          {progress === 100 && <CheckCircle2 className="w-4 h-4 text-green-500" />}
                          <span>{progress}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-1.5 overflow-hidden">
                          <div 
                            className={`h-1.5 rounded-full transition-all duration-300 ${progress === 100 ? 'bg-green-500' : progress > 0 ? 'bg-blue-500' : 'bg-transparent'}`} 
                            style={{ width: `${progress}%` }}
                          ></div>
                        </div>
                      </div>
                    </td>

                    <td className={`sticky left-[90px] bg-white group-hover:bg-blue-50/90 border-r border-gray-400 p-2.5 z-10 shadow-[4px_0_6px_rgba(0,0,0,0.05)] text-xs truncate max-w-[280px] ${task.isSubtask ? 'pl-6 font-normal text-slate-600' : 'font-medium text-slate-800'}`} title={task.name}>
                      {task.isSubtask && <span className="text-gray-400 mr-1 font-mono">↳</span>}
                      {task.name}
                    </td>

                    <td className="border-r border-gray-200 p-2 text-[11px] text-slate-600 truncate max-w-[120px] align-middle">{task.responsable}</td>
                    <td className="border-r border-gray-200 p-2 text-[11px] text-slate-600 truncate max-w-[120px] align-middle">{task.supervisor}</td>
                    <td className="border-r border-gray-200 p-2 text-[11px] text-slate-600 truncate max-w-[90px] align-middle">{task.tec1}</td>
                    <td className="border-r border-gray-200 p-2 text-[11px] text-slate-600 truncate max-w-[90px] align-middle">{task.tec2}</td>
                    
                    <td className="border-r border-gray-200 p-2 text-center align-middle">
                      <span className="inline-flex items-center gap-1 text-[11px] bg-slate-100 px-1.5 py-1 rounded text-slate-600 font-medium">
                        <Clock className="w-3 h-3" /> {task.hInicial}
                      </span>
                    </td>
                    <td className="border-r border-gray-200 p-2 text-center align-middle">
                      <span className="inline-flex items-center gap-1 text-[11px] bg-slate-100 px-1.5 py-1 rounded text-slate-600 font-medium">
                        <Clock className="w-3 h-3" /> {task.hFinal}
                      </span>
                    </td>
                    <td className="border-r border-gray-400 p-2 text-center shadow-[4px_0_6px_rgba(0,0,0,0.02)] text-xs font-bold text-slate-600 align-middle bg-slate-50/50">
                      {task.tiempo}
                    </td>

                    {HOURS.map(hour => (
                      <td key={hour} className="border-r border-gray-200 border-dashed p-0 h-full min-w-[44px]">
                        <div className="flex flex-col h-[48px] w-full">
                          <div 
                            onClick={() => togglePlanned(task.id, hour)}
                            className={`flex-1 flex items-center justify-center border-b border-gray-200/50 cursor-pointer transition-colors ${
                              task.planned[hour] ? 'bg-blue-500 text-white shadow-inner font-bold text-[11px]' : 'hover:bg-blue-50/50 text-transparent'
                            }`}
                          >
                            {task.planned[hour] ? 'C' : ''}
                          </div>
                          <div 
                            onClick={() => toggleActual(task.id, hour)}
                            className={`flex-1 flex items-center justify-center cursor-pointer transition-colors ${
                              task.actual[hour] === 'X' ? 'bg-green-500 text-white shadow-inner font-bold text-[11px]' : 
                              task.actual[hour] === 'D' ? 'bg-red-500 text-white shadow-inner font-bold text-[11px]' : 
                              'hover:bg-gray-100 text-transparent'
                            }`}
                          >
                            {task.actual[hour] || ''}
                          </div>
                        </div>
                      </td>
                    ))}
                  </tr>
                )})}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* MODAL / POP-UP: DILIGENCIA - DETALLE */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in duration-200">
            
            {/* Modal Header */}
            <div className="bg-slate-900 text-white p-4 flex justify-between items-center border-b-4 border-green-500">
              <div className="flex items-center gap-2">
                <FileSpreadsheet className="w-6 h-6 text-green-400" />
                <h2 className="text-xl font-bold tracking-wide">Formato Ruta Crítica - Documento Anexo</h2>
              </div>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-white transition-colors bg-slate-800 hover:bg-red-500 p-1.5 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto bg-gray-50 flex-1">
              <div className="bg-white border border-gray-300 rounded-lg overflow-hidden shadow-sm">
                
                {/* Cabecera Tipo Excel */}
                <div className="bg-slate-100 border-b border-gray-300 p-3 grid grid-cols-[60px_1fr] font-bold text-slate-700 text-sm">
                  <div className="text-center border-r border-gray-300 pr-3">N°</div>
                  <div className="pl-4">Procedimiento de Llenado</div>
                </div>
                
                {/* Filas de Instrucciones */}
                <div className="divide-y divide-gray-200 text-sm text-slate-700">
                  {DETALLE_INSTRUCCIONES.map((instruccion) => (
                    <div key={instruccion.id} className="grid grid-cols-[60px_1fr] hover:bg-green-50/50 transition-colors">
                      <div className="p-3 text-center border-r border-gray-200 bg-slate-50 font-medium text-slate-500">
                        {instruccion.id}
                      </div>
                      <div className="p-3 pl-4 leading-relaxed">
                        {/* Pequeño parseo para destacar las letras C, X, D como en el gantt */}
                        {instruccion.text.includes('" C "') ? (
                          <span>
                            Ingresar la letra <span className="inline-block bg-blue-500 text-white px-2 py-0.5 rounded font-bold text-xs mx-1">C</span> e inmediatamente se pintará del color azul la cual indica el tiempo de la actividad programada.
                          </span>
                        ) : instruccion.text.includes('" X "') ? (
                          <span>
                            Ingresar la letra <span className="inline-block bg-green-500 text-white px-2 py-0.5 rounded font-bold text-xs mx-1">X</span> e inmediatamente se pintará del color verde la cual indica el avance real que tiene la actividad / al ingresar la letra <span className="inline-block bg-red-500 text-white px-2 py-0.5 rounded font-bold text-xs mx-1">D</span> indica inmediatamente se pintará de color rojo la cual indica desvió.
                          </span>
                        ) : instruccion.text.includes('Leyenda:') ? (
                           <span>
                            Leyenda: la letra <span className="inline-block bg-blue-500 text-white px-1.5 rounded font-bold text-[10px] mx-1">C</span> indica el color azul, la letra <span className="inline-block bg-green-500 text-white px-1.5 rounded font-bold text-[10px] mx-1">X</span> Indica el color verde, la letra <span className="inline-block bg-red-500 text-white px-1.5 rounded font-bold text-[10px] mx-1">D</span> indica el color rojo.
                           </span>
                        ) : (
                          instruccion.text
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="bg-gray-100 p-4 border-t border-gray-200 flex justify-end">
              <button 
                onClick={() => setIsModalOpen(false)}
                className="bg-slate-800 hover:bg-slate-700 text-white px-6 py-2 rounded-lg shadow font-medium transition-colors"
              >
                Entendido
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Estilos globales inyectados */}
      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar { height: 12px; width: 12px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: #f1f5f9; border-radius: 8px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 8px; border: 3px solid #f1f5f9; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
      `}} />
    </div>
  );
}