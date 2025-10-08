import { Button } from '@/components/ui/button';
import { ArrowUpRightIcon } from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect } from 'react';

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

interface CountdownTimerProps {
  targetDate: string; // Formato: 'YYYY-MM-DD HH:mm:ss' o Date ISO string
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

  useEffect(() => {
    const calculateTimeLeft = (): TimeLeft => {
      const difference = +new Date(targetDate) - +new Date();

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

    const timer = setInterval(() => {
      const newTimeLeft = calculateTimeLeft();
      setTimeLeft(newTimeLeft);

      if (newTimeLeft.days === 0 && newTimeLeft.hours === 0 &&
        newTimeLeft.minutes === 0 && newTimeLeft.seconds === 0) {
        setIsFinished(true);
        clearInterval(timer);
      }
    }, 1000);

    // Calcular tiempo inicial inmediatamente
    setTimeLeft(calculateTimeLeft());

    return () => clearInterval(timer);
  }, [targetDate]);

  if (isFinished) {
    return (
      <div className="text-center">
        <p className="my-2 font-semibold">{title}</p>
        <Link href={linkUrl}>
          <Button variant="outline">{linkText}
            <ArrowUpRightIcon />
          </Button>
        </Link>
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