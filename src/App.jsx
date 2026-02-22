import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Settings, Clock, AlertTriangle, Activity, CheckCircle2, FileSpreadsheet, X, Plus, Minus, Download, Upload, PlusCircle, Trash2, Edit, UserPlus, Flame } from 'lucide-react';

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

// --- NUEVOS DATOS EXTRAÍDOS DEL EXCEL: HOJA "FORMATO" (CON ESPECIALIDAD Y HORAS EXTENDIDAS) ---
const INITIAL_TASKS = [
  { id: 1, name: 'Parada de MP01', especialidad: 'FABRICACIÓN', responsable: 'NOLBER RODRIGUEZ', supervisor: '-', tec1: '-', tec2: '-', hInicial: '06:00', hFinal: '08:00', tiempo: '02:00', planned: { '06:00': true, '07:00': true }, actual: {} },
  { id: 2, name: 'Cambio de trasmisor de presión de caja de entrada', especialidad: 'INSTRUMENTACIÓN', responsable: 'JAVIER HURTADO', supervisor: 'JAVIER HURTADO', tec1: 'AHUARCAYA', tec2: '-', hInicial: '08:00', hFinal: '09:00', tiempo: '01:00', planned: { '08:00': true }, actual: {} },
  { id: 3, name: 'Inspección de encoders de motor de formador', especialidad: 'ELECTRICIDAD', responsable: 'CHRISTIAN MENDOZA', supervisor: 'CMENDOZA', tec1: 'LPADILLA', tec2: '-', hInicial: '09:00', hFinal: '10:00', tiempo: '01:00', planned: { '09:00': true }, actual: {} },
  { id: 4, name: 'Isnpección de Encoders de motor de fieltro', especialidad: 'ELECTRICIDAD', responsable: 'CHRISTIAN MENDOZA', supervisor: 'CMENDOZA', tec1: 'LPADILLA', tec2: '-', hInicial: '10:00', hFinal: '11:00', tiempo: '01:00', planned: { '10:00': true }, actual: {} },
  { id: 5, name: 'Inspeción de Encoder de 2 motores de Fan Pump', especialidad: 'ELECTRICIDAD', responsable: 'CHRISTIAN MENDOZA', supervisor: 'CMENDOZA', tec1: 'LPADILLA', tec2: '-', hInicial: '11:00', hFinal: '11:30', tiempo: '00:30', planned: { '11:00': true }, actual: {} },
  { id: 6, name: 'Inspección de los difusores de la caja de entrada', especialidad: 'FABRICACIÓN', responsable: 'FABRICACIÓN', supervisor: 'EGALINDO', tec1: '-', tec2: '-', hInicial: '11:00', hFinal: '12:00', tiempo: '01:00', planned: { '11:00': true }, actual: {} },
  { id: 7, name: 'Sellar pequeña fuga pasta en entrada de bomba FP', especialidad: 'INFRAESTRUCTURA', responsable: 'JUAN RAMIREZ', supervisor: 'DAVID ACEVEDO', tec1: 'RTELLO', tec2: 'LEONARDO', tec3: 'LFELIX', hInicial: '09:00', hFinal: '12:00', tiempo: '03:00', planned: { '09:00': true, '10:00': true, '11:00': true }, actual: {} },
  { id: 8, name: 'Validar GAP del Labio', especialidad: 'FABRICACIÓN', responsable: 'FABRICACIÓN', supervisor: 'EGALINDO', tec1: '-', tec2: '-', hInicial: '11:00', hFinal: '11:15', tiempo: '00:15', planned: { '11:00': true }, actual: {} },
  { id: 9, name: 'Validar GAP de Cabecero y formador', especialidad: 'FABRICACIÓN', responsable: 'FABRICACIÓN', supervisor: 'EGALINDO', tec1: '-', tec2: '-', hInicial: '11:15', hFinal: '11:30', tiempo: '00:15', planned: { '11:00': true }, actual: {} },
  { id: 10, name: 'Validar GAP Yankee y Prensa', especialidad: 'FABRICACIÓN', responsable: 'FABRICACIÓN', supervisor: 'EGALINDO', tec1: '-', tec2: '-', hInicial: '11:30', hFinal: '11:45', tiempo: '00:15', planned: { '11:00': true }, actual: {} },
  { id: 11, name: 'Cambiar tela', especialidad: 'FABRICACIÓN', responsable: 'FABRICACIÓN', supervisor: 'EGALINDO', tec1: '-', tec2: '-', hInicial: '08:00', hFinal: '11:00', tiempo: '03:00', planned: { '08:00': true, '09:00': true, '10:00': true }, actual: {} },
  { id: 12, name: 'Validar diametros de rodillos accionados', especialidad: 'MECÁNICO', responsable: 'DIEGO VARGAS', supervisor: 'JERRY PEÑA', tec1: 'CAHUIN', tec2: 'JMARCELO', tec3: 'HQUISPE', hInicial: '14:00', hFinal: '16:00', tiempo: '02:00', planned: { '14:00': true, '15:00': true }, actual: {} },
  { id: 13, name: 'Cambiar el flujometro de la bomba de pasta (BB 02)', especialidad: 'INSTRUMENTACIÓN', responsable: 'JAVIER HURTADO', supervisor: 'JAVIER HURTADO', tec1: '-', tec2: '-', hInicial: '10:00', hFinal: '12:00', tiempo: '02:00', planned: { '10:00': true, '11:00': true }, actual: {} },
  { id: 14, name: 'Vaciar tanque TQ2 de bomba 02 para inspeccionar', especialidad: 'FABRICACIÓN', responsable: 'FABRICACIÓN', supervisor: 'EGALINDO', tec1: '-', tec2: '-', hInicial: '11:00', hFinal: '12:00', tiempo: '01:00', planned: { '11:00': true }, actual: {} },
  
  { id: 15, hasSubtasks: true, name: 'Abrir la bomba BB02 e inspeccionar', especialidad: 'MECÁNICO', responsable: 'DIEGO VARGAS', supervisor: 'JERRY PEÑA', tec1: 'CAHUIN', tec2: 'DPACHAS', tec3: 'HQUISPE', hInicial: '08:00', hFinal: '10:30', tiempo: '02:30', planned: { '08:00': true, '09:00': true, '10:00': true }, actual: {} },
  { id: 16, isSubtask: true, parentId: 15, name: 'Abrir Bomba BB02', especialidad: 'MECÁNICO', responsable: 'DIEGO VARGAS', supervisor: 'JERRY PEÑA', tec1: 'CAHUIN', tec2: 'DPACHAS', tec3: 'HQUISPE', hInicial: '08:00', hFinal: '09:00', tiempo: '01:00', planned: { '08:00': true }, actual: {} },
  { id: 17, isSubtask: true, parentId: 15, name: 'Inspeccionar bomba', especialidad: 'MECÁNICO', responsable: 'DIEGO VARGAS', supervisor: 'JERRY PEÑA', tec1: 'CAHUIN', tec2: 'DPACHAS', tec3: 'HQUISPE', hInicial: '09:00', hFinal: '09:30', tiempo: '00:30', planned: { '09:00': true }, actual: {} },
  { id: 18, isSubtask: true, parentId: 15, name: 'Montar bomba', especialidad: 'MECÁNICO', responsable: 'DIEGO VARGAS', supervisor: 'JERRY PEÑA', tec1: 'CAHUIN', tec2: 'DPACHAS', tec3: 'HQUISPE', hInicial: '09:30', hFinal: '10:30', tiempo: '01:00', planned: { '09:00': true, '10:00': true }, actual: {} },
  
  // TAREA CRUCIAL RESALTADA
  { id: 19, isCrucial: true, hasSubtasks: true, name: 'Abrir la Fam Pump', especialidad: 'MECÁNICO', responsable: 'DIEGO VARGAS', supervisor: 'JERRY PEÑA', tec1: 'HQUISPE', tec2: 'CSANTAMARIA', tec3: 'CAHUIN', tec4: 'JMARCELO', hInicial: '09:00', hFinal: '17:00', tiempo: '08:00', planned: { '09:00': true, '10:00': true, '11:00': true, '12:00': true, '13:00': true, '14:00': true, '15:00': true, '16:00': true }, actual: {} },
  { id: 20, isCrucial: true, isSubtask: true, parentId: 19, name: 'Despinchar la Fam Pump', especialidad: 'MECÁNICO', responsable: 'DIEGO VARGAS', supervisor: 'JERRY PEÑA', tec1: 'HQUISPE', tec2: 'CSANTAMARIA', tec3: 'CAHUIN', tec4: 'JMARCELO', hInicial: '08:00', hFinal: '09:00', tiempo: '01:00', planned: { '08:00': true }, actual: {} },
  { id: 21, isCrucial: true, isSubtask: true, parentId: 19, name: 'Desmontar la Fam Pump', especialidad: 'MECÁNICO', responsable: 'DIEGO VARGAS', supervisor: 'JERRY PEÑA', tec1: 'HQUISPE', tec2: 'CSANTAMARIA', tec3: 'CAHUIN', tec4: 'JMARCELO', hInicial: '09:00', hFinal: '13:00', tiempo: '04:00', planned: { '09:00': true, '10:00': true, '11:00': true, '12:00': true }, actual: {} },
  { id: 22, isCrucial: true, isSubtask: true, parentId: 19, name: 'Inspeccionar la Fam pump', especialidad: 'MECÁNICO', responsable: 'DIEGO VARGAS', supervisor: 'JERRY PEÑA', tec1: 'HQUISPE', tec2: 'CSANTAMARIA', tec3: 'CAHUIN', tec4: 'JMARCELO', hInicial: '10:00', hFinal: '11:00', tiempo: '01:00', planned: { '10:00': true }, actual: {} },
  { id: 23, isCrucial: true, isSubtask: true, parentId: 19, name: 'Montar la Fam Pump', especialidad: 'MECÁNICO', responsable: 'DIEGO VARGAS', supervisor: 'JERRY PEÑA', tec1: 'HQUISPE', tec2: 'CSANTAMARIA', tec3: 'CAHUIN', tec4: 'JMARCELO', hInicial: '11:00', hFinal: '14:00', tiempo: '03:00', planned: { '11:00': true, '12:00': true, '13:00': true }, actual: {} },
  
  { id: 24, name: 'Validad y calibrar los Dumpers de la capota', especialidad: 'INSTRUMENTACIÓN', responsable: 'JAVIER HURTADO', supervisor: 'JAVIER HURTADO', tec1: 'AHUARCAYA', tec2: '-', hInicial: '09:00', hFinal: '15:00', tiempo: '06:00', planned: { '09:00': true, '10:00': true, '11:00': true, '12:00': true, '13:00': true, '14:00': true }, actual: {} },
  { id: 25, name: 'Correctivo en Bomba Aurora', especialidad: 'MECÁNICO', responsable: 'DIEGO VARGAS', supervisor: 'JERRY PEÑA', tec1: 'JMARCELO', tec2: '-', hInicial: '08:00', hFinal: '12:00', tiempo: '04:00', planned: { '08:00': true, '09:00': true, '10:00': true, '11:00': true }, actual: {} },
  { id: 26, name: 'Reparación de regadera de MP1', especialidad: 'INSFRAESTRUCTURA', responsable: 'JUAN RAMIREZ', supervisor: 'DAVID ACEVEDO', tec1: 'RTELLO', tec2: 'LEONARDO', tec3: 'LFELIX', hInicial: '12:00', hFinal: '16:00', tiempo: '04:00', planned: { '12:00': true, '13:00': true, '14:00': true, '15:00': true }, actual: {} },
  { id: 27, name: 'Cambio de manguera valvula VV078', especialidad: 'INSTRUMENTACIÓN', responsable: 'JAVIER HURTADO', supervisor: 'VALERIO RAMIREZ', tec1: 'CMATEO', tec2: '-', hInicial: '08:00', hFinal: '11:00', tiempo: '03:00', planned: { '08:00': true, '09:00': true, '10:00': true }, actual: {} },
  
  { id: 28, hasSubtasks: true, name: 'Limpieza de HVAC RTU 101 Y RTU 102', especialidad: 'CONFIABILIDAD', responsable: 'CHRISTIAN MENDOZA', supervisor: 'LPADILLA', tec1: 'LSIFUENTES', tec2: '-', hInicial: '08:00', hFinal: '16:00', tiempo: '08:00', planned: { '08:00': true, '09:00': true, '10:00': true, '11:00': true, '12:00': true, '13:00': true, '14:00': true, '15:00': true }, actual: {} },
  { id: 29, isSubtask: true, parentId: 28, name: 'Inspección y limpieza', especialidad: 'CONFIABILIDAD', responsable: 'CHRISTIAN MENDOZA', supervisor: 'LPADILLA', tec1: 'LSIFUENTES', tec2: '-', hInicial: '08:00', hFinal: '13:00', tiempo: '05:00', planned: { '08:00': true, '09:00': true, '10:00': true, '11:00': true, '12:00': true }, actual: {} },
  { id: 30, isSubtask: true, parentId: 28, name: 'Cambio de filtro', especialidad: 'CONFIABILIDAD', responsable: 'CHRISTIAN MENDOZA', supervisor: 'LPADILLA', tec1: 'LSIFUENTES', tec2: '-', hInicial: '13:00', hFinal: '16:00', tiempo: '03:00', planned: { '13:00': true, '14:00': true, '15:00': true }, actual: {} }
];

// Generar ciclo de 24 horas iniciando desde las 06:00 y terminando a las 05:00
const HOURS = [
  '06:00', '07:00', '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', 
  '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', 
  '22:00', '23:00', '00:00', '01:00', '02:00', '03:00', '04:00', '05:00'
];

export default function App() {
  const [tasks, setTasks] = useState(INITIAL_TASKS);
  
  // Modos de Vista
  const [isPlanningMode, setIsPlanningMode] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Control de grupos expandidos (por defecto inician colapsados)
  const [expandedGroups, setExpandedGroups] = useState({});

  // Control de cantidad de columnas "Técnico"
  const [techCount, setTechCount] = useState(4); 

  // Referencias y estados para el Scroll Sincronizado
  const topScrollRef = useRef(null);
  const bottomScrollRef = useRef(null);
  const fileInputRef = useRef(null);
  const [tableWidth, setTableWidth] = useState(0);

  // Modales personalizados
  const [taskToDelete, setTaskToDelete] = useState(null);
  const [notification, setNotification] = useState('');

  // Calcula dinámicamente el ancho de la tabla
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

  const toggleGroup = (groupId) => {
    setExpandedGroups(prev => ({ ...prev, [groupId]: !prev[groupId] }));
  };

  // --- LÓGICA DE EDICIÓN MODO PLANEAMIENTO ---
  const updateTaskField = (taskId, field, value) => {
    setTasks(tasks.map(t => t.id === taskId ? { ...t, [field]: value } : t));
  };

  const addTask = () => {
    const newTask = {
      id: Date.now(),
      name: 'Nueva Actividad',
      especialidad: '-',
      responsable: '-', supervisor: '-',
      hInicial: '00:00', hFinal: '00:00', tiempo: '00:00',
      planned: {}, actual: {}
    };
    
    for (let i = 1; i <= techCount; i++) {
      newTask[`tec${i}`] = '-';
    }

    setTasks([...tasks, newTask]);
    setTimeout(() => {
      bottomScrollRef.current?.scrollTo({ top: bottomScrollRef.current.scrollHeight, behavior: 'smooth' });
    }, 100);
  };

  const confirmDelete = () => {
    if (taskToDelete !== null) {
      setTasks(tasks.filter(t => t.id !== taskToDelete && t.parentId !== taskToDelete));
      setTaskToDelete(null);
    }
  };

  // --- EXPORTAR E IMPORTAR JSON ---
  const exportJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(tasks, null, 2));
    const downloadNode = document.createElement('a');
    downloadNode.setAttribute("href", dataStr);
    downloadNode.setAttribute("download", `ruta_critica_mp01_${new Date().toISOString().slice(0,10)}.json`);
    document.body.appendChild(downloadNode);
    downloadNode.click();
    downloadNode.remove();
  };

  const importJSON = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const imported = JSON.parse(event.target.result);
        if(Array.isArray(imported)){
          
          let maxTec = 2;
          imported.forEach(t => {
            Object.keys(t).forEach(k => {
              if (k.startsWith('tec')) {
                const n = parseInt(k.replace('tec', ''));
                if (!isNaN(n) && n > maxTec) maxTec = n;
              }
            });
          });
          setTechCount(maxTec);

          setTasks(imported);
          setNotification('Datos cargados exitosamente.');
          setTimeout(() => setNotification(''), 3000);
        } else {
          setNotification('Formato JSON inválido.');
          setTimeout(() => setNotification(''), 3000);
        }
      } catch (err) {
        setNotification('Error al leer el archivo JSON');
        setTimeout(() => setNotification(''), 3000);
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  // --- LOGICA DE CLICS EN HORAS ---
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
      <header className="bg-slate-900 text-white p-4 shadow-md z-50">
        <div className="max-w-[1600px] mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-white text-blue-900 font-black text-xl px-3 py-1 rounded tracking-widest border-2 border-blue-400">
              SOFTYS
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-100">RUTA CRÍTICA MP01</h1>
              <p className="text-sm text-slate-400">Control Avanzado y Monitoreo</p>
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

      <main className="flex-1 p-4 max-w-[1600px] mx-auto w-full flex flex-col gap-4 overflow-hidden">
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 flex flex-col gap-4 transition-all">
          
          <div className="flex flex-wrap justify-between items-center gap-4">
            <div className="flex bg-gray-100 p-1 rounded-lg border border-gray-200">
              <button 
                onClick={() => setIsPlanningMode(false)}
                className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-bold transition-all ${!isPlanningMode ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
              >
                Modo Visual
              </button>
              <button 
                onClick={() => setIsPlanningMode(true)}
                className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-bold transition-all ${isPlanningMode ? 'bg-blue-900 text-white shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
              >
                <Edit className="w-4 h-4" />
                Planeamiento (Admin)
              </button>
            </div>

            <div className="flex gap-6">
              <div className="flex flex-col text-xs text-gray-500 border-r pr-4 border-gray-200">
                <span className="font-semibold mb-1">Mitad Superior:</span>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 bg-blue-500 text-[8px] text-white flex items-center justify-center font-bold rounded-sm">C</div>
                  <span>Programado {isPlanningMode ? '(Clic para asignar hora)' : ''}</span>
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

          {isPlanningMode && (
            <div className="flex flex-wrap gap-3 pt-3 border-t border-gray-100 animate-in fade-in slide-in-from-top-2 duration-300">
              <button 
                onClick={() => setIsModalOpen(true)}
                className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg shadow-sm font-semibold transition-colors text-sm border border-green-800"
              >
                <FileSpreadsheet className="w-4 h-4" />
                Diligencia - Detalle
              </button>
              
              <div className="w-px bg-gray-300 mx-1"></div>

              <button 
                onClick={addTask}
                className="flex items-center gap-2 bg-blue-50 hover:bg-blue-100 text-blue-700 px-4 py-2 rounded-lg font-semibold transition-colors text-sm border border-blue-200"
              >
                <PlusCircle className="w-4 h-4" />
                Añadir Fila / Tarea
              </button>

              <button 
                onClick={() => setTechCount(prev => prev + 1)}
                className="flex items-center gap-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 px-4 py-2 rounded-lg font-semibold transition-colors text-sm border border-indigo-200"
              >
                <UserPlus className="w-4 h-4" />
                Añadir Columna Técnico
              </button>

              <div className="flex-1"></div>

              <input type="file" accept=".json" ref={fileInputRef} onChange={importJSON} className="hidden" />
              
              <button 
                onClick={() => fileInputRef.current.click()}
                className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded-lg font-semibold transition-colors text-sm border border-slate-300"
              >
                <Upload className="w-4 h-4" />
                Cargar JSON
              </button>
              
              <button 
                onClick={exportJSON}
                className="flex items-center gap-2 bg-slate-800 hover:bg-slate-900 text-white px-4 py-2 rounded-lg font-semibold transition-colors text-sm border border-slate-900 shadow-sm"
              >
                <Download className="w-4 h-4" />
                Descargar JSON
              </button>
            </div>
          )}
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 flex-1 overflow-hidden flex flex-col relative">
          
          <div 
            ref={topScrollRef}
            onScroll={handleTopScroll}
            className="w-full overflow-x-auto custom-scrollbar border-b border-gray-200 bg-slate-50 sticky top-0 z-40"
          >
            <div style={{ width: `${tableWidth}px`, height: '1px' }}></div>
          </div>

          <div 
            ref={bottomScrollRef}
            onScroll={handleBottomScroll}
            className="overflow-x-auto flex-1 custom-scrollbar pb-10"
          >
            <table className="w-full border-collapse text-sm text-left">
              <thead className="bg-slate-100 sticky top-0 z-20 text-slate-700">
                <tr>
                  <th rowSpan={2} className="sticky left-0 bg-slate-100 border-b border-r border-gray-300 p-3 min-w-[90px] z-30 shadow-[2px_0_5px_rgba(0,0,0,0.05)] text-center">
                    % Avance
                  </th>
                  <th rowSpan={2} className="sticky left-[90px] bg-slate-100 border-b border-r border-gray-400 p-3 min-w-[280px] max-w-[280px] z-30 shadow-[4px_0_6px_rgba(0,0,0,0.05)]">
                    Actividades Principales Parada
                  </th>
                  <th rowSpan={2} className="bg-slate-50 border-b border-r border-gray-300 p-3 min-w-[120px] font-semibold">Especialidad</th>
                  <th rowSpan={2} className="bg-slate-50 border-b border-r border-gray-300 p-3 min-w-[120px] font-semibold">Responsable</th>
                  <th rowSpan={2} className="bg-slate-50 border-b border-r border-gray-300 p-3 min-w-[120px] font-semibold">Supervisor</th>
                  
                  {Array.from({ length: techCount }).map((_, i) => (
                    <th key={`head-tec-${i+1}`} rowSpan={2} className="bg-slate-50 border-b border-r border-gray-300 p-3 min-w-[90px] font-semibold">
                      Tec{i + 1}
                    </th>
                  ))}

                  <th rowSpan={2} className="bg-slate-50 border-b border-r border-gray-300 p-3 min-w-[90px] text-center font-semibold">H. Inicial</th>
                  <th rowSpan={2} className="bg-slate-50 border-b border-r border-gray-300 p-3 min-w-[90px] text-center font-semibold">H. Final</th>
                  <th rowSpan={2} className="bg-slate-50 border-b border-r border-gray-400 p-3 min-w-[80px] text-center font-semibold shadow-[4px_0_6px_rgba(0,0,0,0.05)]">Tiempo</th>
                  
                  <th colSpan={24} className="border-b border-r border-gray-300 p-2 text-center bg-blue-900 text-white text-xs font-black tracking-widest uppercase">
                    DÍA: 23 de Febrero 2026
                  </th>
                </tr>
                <tr>
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

              <tbody>
                {tasks.map((task) => {
                  if (task.isSubtask && !expandedGroups[task.parentId]) return null;

                  const progress = getTaskProgress(task);

                  // Determinación de clases según si es crucial o subtarea
                  const bgClass = task.isCrucial 
                    ? (isPlanningMode ? 'bg-amber-100 hover:bg-amber-200' : 'bg-amber-50 hover:bg-amber-100')
                    : (task.isSubtask ? 'bg-slate-50 hover:bg-slate-100' : (isPlanningMode ? 'hover:bg-blue-50/40' : 'hover:bg-blue-50/20'));
                  
                  const borderClass = task.isCrucial ? 'border-amber-300' : 'border-gray-200';

                  return (
                  <tr key={task.id} className={`group transition-colors border-b ${borderClass} ${bgClass}`}>
                    
                    {/* % AVANCE */}
                    <td className={`sticky left-0 ${task.isCrucial ? 'bg-amber-50 group-hover:bg-amber-100' : 'bg-white group-hover:bg-blue-50/90'} border-r ${borderClass} p-2 z-10 shadow-[2px_0_5px_rgba(0,0,0,0.02)] align-middle transition-colors`}>
                      <div className="flex flex-col items-center gap-1 w-full px-2">
                        <div className="flex items-center gap-1 font-bold text-slate-700">
                          {progress === 100 && <CheckCircle2 className="w-4 h-4 text-green-500" />}
                          <span>{progress}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-1.5 overflow-hidden">
                          <div 
                            className={`h-1.5 rounded-full transition-all duration-300 ${progress === 100 ? 'bg-green-500' : progress > 0 ? (task.isCrucial ? 'bg-amber-500' : 'bg-blue-500') : 'bg-transparent'}`} 
                            style={{ width: `${progress}%` }}
                          ></div>
                        </div>
                      </div>
                    </td>

                    {/* ACTIVIDAD */}
                    <td className={`sticky left-[90px] ${task.isCrucial ? 'bg-amber-50 group-hover:bg-amber-100' : 'bg-white group-hover:bg-blue-50/90'} border-r border-gray-400 p-2.5 z-10 shadow-[4px_0_6px_rgba(0,0,0,0.05)] text-xs max-w-[280px] ${task.isSubtask ? 'font-normal text-slate-700' : 'font-bold text-slate-900'} transition-colors`}>
                      <div className={`flex items-center gap-1.5 min-w-0 ${task.isSubtask ? 'pl-6' : ''}`}>
                        
                        {isPlanningMode && (
                          <button onClick={() => setTaskToDelete(task.id)} className="text-gray-400 hover:text-red-500 p-0.5 rounded transition-colors" title="Eliminar fila">
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}

                        {task.hasSubtasks && (
                          <button 
                            onClick={() => toggleGroup(task.id)}
                            className={`flex items-center justify-center p-0.5 rounded shadow-sm transition-colors ${task.isCrucial ? 'bg-amber-600 hover:bg-amber-700 text-white' : 'bg-blue-900 hover:bg-blue-800 text-white'}`}
                          >
                            {expandedGroups[task.id] ? <Minus className="w-3 h-3" /> : <Plus className="w-3 h-3" />}
                          </button>
                        )}
                        
                        {task.isSubtask && <span className="text-gray-400 font-mono">↳</span>}
                        {task.isCrucial && !task.isSubtask && <Flame className="w-4 h-4 text-amber-600 animate-pulse" />}
                        
                        {isPlanningMode ? (
                          <input 
                            value={task.name} 
                            onChange={(e) => updateTaskField(task.id, 'name', e.target.value)}
                            className={`w-full flex-1 border ${task.isCrucial ? 'border-amber-400 bg-amber-50/50' : 'border-blue-300 bg-blue-50/50'} rounded px-1 py-0.5 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 font-medium`}
                          />
                        ) : (
                          <span className="truncate flex-1" title={task.name}>{task.name}</span>
                        )}
                      </div>
                    </td>

                    {/* ESPECIALIDAD */}
                    <td className={`border-r ${borderClass} p-2 text-[11px] align-middle min-w-[120px] ${task.isCrucial ? 'text-amber-900' : 'text-slate-600'}`}>
                      {isPlanningMode ? <input value={task.especialidad || ''} onChange={(e) => updateTaskField(task.id, 'especialidad', e.target.value)} className="w-full border border-gray-300 rounded px-1 py-0.5" /> : <div className="truncate font-semibold">{task.especialidad}</div>}
                    </td>

                    <td className={`border-r ${borderClass} p-2 text-[11px] align-middle min-w-[120px] ${task.isCrucial ? 'text-amber-900' : 'text-slate-600'}`}>
                      {isPlanningMode ? <input value={task.responsable || ''} onChange={(e) => updateTaskField(task.id, 'responsable', e.target.value)} className="w-full border border-gray-300 rounded px-1 py-0.5" /> : <div className="truncate">{task.responsable}</div>}
                    </td>
                    <td className={`border-r ${borderClass} p-2 text-[11px] align-middle min-w-[120px] ${task.isCrucial ? 'text-amber-900' : 'text-slate-600'}`}>
                      {isPlanningMode ? <input value={task.supervisor || ''} onChange={(e) => updateTaskField(task.id, 'supervisor', e.target.value)} className="w-full border border-gray-300 rounded px-1 py-0.5" /> : <div className="truncate">{task.supervisor}</div>}
                    </td>
                    
                    {Array.from({ length: techCount }).map((_, i) => {
                      const tecKey = `tec${i + 1}`;
                      return (
                        <td key={`cell-${task.id}-${tecKey}`} className={`border-r ${borderClass} p-2 text-[11px] align-middle min-w-[90px] ${task.isCrucial ? 'text-amber-900' : 'text-slate-600'}`}>
                          {isPlanningMode ? (
                            <input 
                              value={task[tecKey] || ''} 
                              onChange={(e) => updateTaskField(task.id, tecKey, e.target.value)} 
                              className="w-full border border-gray-300 rounded px-1 py-0.5" 
                            />
                          ) : (
                            <div className="truncate">{task[tecKey] || '-'}</div>
                          )}
                        </td>
                      );
                    })}
                    
                    <td className={`border-r ${borderClass} p-2 text-center align-middle`}>
                      {isPlanningMode ? (
                        <input type="time" value={task.hInicial || ''} onChange={(e) => updateTaskField(task.id, 'hInicial', e.target.value)} className="w-[70px] border border-gray-300 rounded px-0.5 py-0.5 text-xs text-center" /> 
                      ) : (
                        <span className={`inline-flex items-center gap-1 text-[11px] px-1.5 py-1 rounded font-medium ${task.isCrucial ? 'bg-amber-200/50 text-amber-800' : 'bg-slate-100 text-slate-600'}`}>
                          <Clock className="w-3 h-3" /> {task.hInicial}
                        </span>
                      )}
                    </td>
                    <td className={`border-r ${borderClass} p-2 text-center align-middle`}>
                      {isPlanningMode ? (
                        <input type="time" value={task.hFinal || ''} onChange={(e) => updateTaskField(task.id, 'hFinal', e.target.value)} className="w-[70px] border border-gray-300 rounded px-0.5 py-0.5 text-xs text-center" /> 
                      ) : (
                        <span className={`inline-flex items-center gap-1 text-[11px] px-1.5 py-1 rounded font-medium ${task.isCrucial ? 'bg-amber-200/50 text-amber-800' : 'bg-slate-100 text-slate-600'}`}>
                          <Clock className="w-3 h-3" /> {task.hFinal}
                        </span>
                      )}
                    </td>
                    <td className={`border-r border-gray-400 p-2 text-center shadow-[4px_0_6px_rgba(0,0,0,0.02)] text-xs font-bold align-middle ${task.isCrucial ? 'bg-amber-100/50 text-amber-900' : 'bg-slate-50/50 text-slate-600'}`}>
                      {isPlanningMode ? (
                        <input value={task.tiempo} onChange={(e) => updateTaskField(task.id, 'tiempo', e.target.value)} className="w-[60px] border border-gray-300 rounded px-1 py-0.5 text-center bg-white" placeholder="00:00" />
                      ) : (
                        task.tiempo
                      )}
                    </td>

                    {/* HORAS INTERACTIVAS */}
                    {HOURS.map(hour => (
                      <td key={hour} className={`border-r ${borderClass} border-dashed p-0 h-full min-w-[44px]`}>
                        <div className="flex flex-col h-[48px] w-full">
                          <div 
                            onClick={() => togglePlanned(task.id, hour)}
                            className={`flex-1 flex items-center justify-center border-b ${task.isCrucial ? 'border-amber-200/50' : 'border-gray-200/50'} cursor-pointer transition-colors ${
                              task.planned[hour] ? 'bg-blue-500 text-white shadow-inner font-bold text-[11px]' : (task.isCrucial ? 'hover:bg-amber-200/50 text-transparent' : 'hover:bg-blue-50/50 text-transparent')
                            }`}
                          >
                            {task.planned[hour] ? 'C' : ''}
                          </div>
                          <div 
                            onClick={() => toggleActual(task.id, hour)}
                            className={`flex-1 flex items-center justify-center cursor-pointer transition-colors ${
                              task.actual[hour] === 'X' ? 'bg-green-500 text-white shadow-inner font-bold text-[11px]' : 
                              task.actual[hour] === 'D' ? 'bg-red-500 text-white shadow-inner font-bold text-[11px]' : 
                              (task.isCrucial ? 'hover:bg-amber-100 text-transparent' : 'hover:bg-gray-100 text-transparent')
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

      {/* MODALES REUTILIZADOS DEL CÓDIGO ANTERIOR */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in duration-200">
            
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

            <div className="p-6 overflow-y-auto bg-gray-50 flex-1">
              <div className="bg-white border border-gray-300 rounded-lg overflow-hidden shadow-sm">
                <div className="bg-slate-100 border-b border-gray-300 p-3 grid grid-cols-[60px_1fr] font-bold text-slate-700 text-sm">
                  <div className="text-center border-r border-gray-300 pr-3">N°</div>
                  <div className="pl-4">Procedimiento de Llenado</div>
                </div>
                <div className="divide-y divide-gray-200 text-sm text-slate-700">
                  {DETALLE_INSTRUCCIONES.map((instruccion) => (
                    <div key={instruccion.id} className="grid grid-cols-[60px_1fr] hover:bg-green-50/50 transition-colors">
                      <div className="p-3 text-center border-r border-gray-200 bg-slate-50 font-medium text-slate-500">
                        {instruccion.id}
                      </div>
                      <div className="p-3 pl-4 leading-relaxed">
                        {instruccion.text.includes('" C "') ? (
                          <span>Ingresar la letra <span className="inline-block bg-blue-500 text-white px-2 py-0.5 rounded font-bold text-xs mx-1">C</span> e inmediatamente se pintará del color azul la cual indica el tiempo de la actividad programada.</span>
                        ) : instruccion.text.includes('" X "') ? (
                          <span>Ingresar la letra <span className="inline-block bg-green-500 text-white px-2 py-0.5 rounded font-bold text-xs mx-1">X</span> e inmediatamente se pintará del color verde la cual indica el avance real que tiene la actividad / al ingresar la letra <span className="inline-block bg-red-500 text-white px-2 py-0.5 rounded font-bold text-xs mx-1">D</span> indica inmediatamente se pintará de color rojo la cual indica desvió.</span>
                        ) : instruccion.text.includes('Leyenda:') ? (
                           <span>Leyenda: la letra <span className="inline-block bg-blue-500 text-white px-1.5 rounded font-bold text-[10px] mx-1">C</span> indica el color azul, la letra <span className="inline-block bg-green-500 text-white px-1.5 rounded font-bold text-[10px] mx-1">X</span> Indica el color verde, la letra <span className="inline-block bg-red-500 text-white px-1.5 rounded font-bold text-[10px] mx-1">D</span> indica el color rojo.</span>
                        ) : (
                          instruccion.text
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

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

      {taskToDelete !== null && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-sm overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="bg-red-500 text-white p-4 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5" />
              <h2 className="font-bold">Eliminar Fila</h2>
            </div>
            <div className="p-4 text-slate-700 text-sm">
              ¿Estás seguro que deseas eliminar esta fila? Si es una actividad principal, también se eliminarán sus subtareas.
            </div>
            <div className="bg-gray-50 p-3 flex justify-end gap-2 border-t border-gray-200">
              <button onClick={() => setTaskToDelete(null)} className="px-4 py-2 text-slate-600 hover:bg-slate-200 rounded-lg text-sm font-medium transition-colors">Cancelar</button>
              <button onClick={confirmDelete} className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm font-medium transition-colors">Eliminar</button>
            </div>
          </div>
        </div>
      )}

      {notification && (
        <div className="fixed top-4 right-4 bg-slate-800 text-white px-6 py-3 rounded-lg shadow-xl z-[70] flex items-center gap-3 animate-in fade-in slide-in-from-top-4">
          <span className="text-sm font-medium">{notification}</span>
          <button onClick={() => setNotification('')} className="text-gray-400 hover:text-white"><X className="w-4 h-4" /></button>
        </div>
      )}

      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar { height: 12px; width: 12px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: #f1f5f9; border-radius: 8px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 8px; border: 3px solid #f1f5f9; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
        
        input[type="time"]::-webkit-calendar-picker-indicator {
          background: none;
          display: none;
        }
      `}} />
    </div>
  );
}