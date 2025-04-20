import React from 'react';

interface StepperProps {
  currentStep?: number;
  onStepClick?: (step: number) => void;
}

const Stepper: React.FC<StepperProps> = ({ currentStep = 1, onStepClick }) => {
  const steps = [
    { number: 1, title: 'Paso 1:', subtitle: 'Seleccionar actividad' },
    { number: 2, title: 'Paso 2:', subtitle: 'Inscribir visitantes' },
    { number: 3, title: 'Paso 3:', subtitle: 'Detalle de inscripción' },
  ];

  const getBackgroundColor = (step: number): string => {
    if (step < currentStep) return '#31572C';     // verde
    if (step === currentStep) return '#FFB703';   // amarillo
    return '#F4F5F7';                             // gris claro
  };

  const getTextColor = (step: number): string => {
    return step < currentStep || step === currentStep ? '#fff' : '#000';
  };

  const shape = 'polygon(0 0, 95% 0, 100% 50%, 95% 100%, 0 100%, 10px 50%)';

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '20px',
      gap: '10px',
    }}>
      {steps.map((step) => (
        <div
          key={step.number}
          onClick={() => onStepClick?.(step.number)}
          style={{
            width: 290,
            height: 60,
            position: 'relative',
            cursor: 'pointer',
          }}
        >
          {/* Capa externa con borde */}
          <div style={{
            backgroundColor: '#D2D6DC',
            clipPath: shape,
            width: '100%',
            height: '100%',
            position: 'absolute',
            top: 0,
            left: 0,
            zIndex: 0,
          }} />

          {/* Capa interna con relleno, un poco más chica para mostrar borde */}
          <div style={{
            backgroundColor: getBackgroundColor(step.number),
            clipPath: shape,
            width: 'calc(100% - 2px)',
            height: 'calc(100% - 2px)',
            margin: '1px',
            position: 'absolute',
            top: 0,
            left: 0,
            zIndex: 1,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            color: getTextColor(step.number),
            fontWeight: 600,
            fontSize: 14,
          }}>
            <div>{step.title}</div>
            <div style={{ fontSize: 12, fontWeight: 400 }}>{step.subtitle}</div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Stepper;
