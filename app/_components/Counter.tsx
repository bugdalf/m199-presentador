import { useState, useEffect } from 'react';

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

interface CountdownTimerProps {
  targetDate: string;
  title?: string;
  linkUrl?: string;
  linkText?: string;
}

export default function Counter({
  targetDate,
  title = '¡El taller ha comenzado!',
  linkUrl = '/presentacion',
  linkText = 'Ir a la presentación'
}: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });
  const [isFinished, setIsFinished] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Validar que targetDate existe y es válido
    if (!targetDate) {
      console.error('targetDate is undefined or empty');
      setIsLoading(false);
      return;
    }
    const calculateTimeLeft = (): TimeLeft => {
      const target = new Date(targetDate);
      const now = new Date();
      
      // Validar que la fecha es válida
      if (isNaN(target.getTime())) {
        console.error('Invalid targetDate:', targetDate);
        return { days: 0, hours: 0, minutes: 0, seconds: 0 };
      }

      const difference = target.getTime() - now.getTime();

      if (difference > 0) {
        return {
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60)
        };
      }

      return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    };

    // Calcular tiempo inicial inmediatamente
    const initialTime = calculateTimeLeft();
    setTimeLeft(initialTime);
    setIsLoading(false);

    // Verificar si ya terminó
    if (initialTime.days === 0 && initialTime.hours === 0 &&
        initialTime.minutes === 0 && initialTime.seconds === 0) {
      setIsFinished(true);
      return;
    }

    const timer = setInterval(() => {
      const newTimeLeft = calculateTimeLeft();
      setTimeLeft(newTimeLeft);

      if (newTimeLeft.days === 0 && newTimeLeft.hours === 0 &&
          newTimeLeft.minutes === 0 && newTimeLeft.seconds === 0) {
        setIsFinished(true);
        clearInterval(timer);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  // Mostrar loading mientras se valida la fecha
  if (isLoading) {
    return (
      <div className="text-center">
        <p className="font-bold font-display">...</p>
      </div>
    );
  }

  if (isFinished) {
    return (
      <div className="text-center">
        <p className="my-2 font-semibold">{title}</p>
        <a href={linkUrl}>
          <button className="inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium border border-gray-300 rounded-md hover:bg-gray-50">
            {linkText}
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M7 7h10v10"/><path d="M7 17 17 7"/>
            </svg>
          </button>
        </a>
      </div>
    );
  }

  return (
    <div>
      <p className="font-bold font-mono">Comienza en</p>
      <div className="flex justify-center py-2">
        {timeLeft.days > 0 && (
          <div className="flex flex-col mr-4 items-center">
            <p className="text-4xl font-bold font-display">{timeLeft.days}</p>
            <span className="text-xs mt-1">
              {timeLeft.days === 1 ? 'Día' : 'Días'}
            </span>
          </div>
        )}

        <div className="flex flex-col mr-4 items-center">
          <p className="text-4xl font-bold font-display">
            {String(timeLeft.hours).padStart(2, '0')}
          </p>
          <span className="text-xs mt-1">
            {timeLeft.hours === 1 ? 'Hora' : 'Horas'}
          </span>
        </div>

        <div className="flex flex-col mr-4 items-center">
          <p className="text-4xl font-bold font-display">
            {String(timeLeft.minutes).padStart(2, '0')}
          </p>
          <span className="text-xs mt-1">
            {timeLeft.minutes === 1 ? 'Minuto' : 'Minutos'}
          </span>
        </div>

        <div className="flex flex-col items-center">
          <p className="text-4xl font-bold font-display">
            {String(timeLeft.seconds).padStart(2, '0')}
          </p>
          <span className="text-xs mt-1">
            {timeLeft.seconds === 1 ? 'Segundo' : 'Segundos'}
          </span>
        </div>
      </div>
    </div>
  );
}