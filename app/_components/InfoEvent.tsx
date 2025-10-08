export default function InfoEvent({targetDate}: {targetDate: string}) {
  const date = new Date(targetDate);
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();
  const hours = date.getHours();
  const minutes = date.getMinutes();
  
  // Obtener el nombre del mes en español
  const monthNames = [
    'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
    'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'
  ];
  const monthName = monthNames[date.getMonth()];
  
  // Obtener el nombre del día de la semana en español
  const dayNames = [
    'domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'
  ];
  const dayName = dayNames[date.getDay()];
  
  // Formatear minutos para que siempre tenga 2 dígitos
  const formattedMinutes = minutes.toString().padStart(2, '0');
  
  return (
    <div className="flex flex-col gap-6 my-4">
      <div>
        <p className="font-bold font-mono">{dayName} {day} de {monthName}</p>
        <p>{hours}:{formattedMinutes}</p>
      </div>
      <div>
        <p className="font-bold font-mono">Lugar</p>
        <p>Auditorio Iglesia Vida - Cusco</p>
      </div>
    </div>
  );
}