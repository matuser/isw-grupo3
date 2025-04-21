import React from 'react';
import useMediaQuery from '@mui/material/useMediaQuery';



interface StepperProps {
  currentStep: number;
  onStepClick: (step: number) => void;
  Step2Color?: string; // <-- agregalo acá
}


const Stepper: React.FC<StepperProps> = ({ currentStep = 1, onStepClick }) => {
  const steps = [
    { number: 1, title: 'Paso 1:', subtitle: 'Seleccionar actividad' },
    { number: 2, title: 'Paso 2:', subtitle: 'Inscribir visitantes' },
    { number: 3, title: 'Paso 3:', subtitle: 'Detalle de inscripción' },
  ];

  const getBackgroundColor = (step: number): string => {
    if (step < currentStep) return '#31572C';
    if (step === currentStep) return '#FFB703';
    return '#F4F5F7';
  };

  const getTextColor = (step: number): string => {
    return step < currentStep || step === currentStep ? '#fff' : '#000';
  };

  const shape = 'polygon(0 0, 95% 0, 100% 50%, 95% 100%, 0 100%, 10px 50%)';


  

  const isMobile = useMediaQuery('(max-width: 600px)');

  // Media query en línea (opcional: podés mover a clase o styled-component)
  const responsiveStepStyle = (): React.CSSProperties => ({
    width: isMobile ? '95vw' : 240, // si pones 95vw en donde dice '100%' se ve mas larga la flecha
    minWidth: 180,
    height: isMobile ? 80 : 60,
    position: 'relative',
    cursor: 'pointer',
  });
  
  

  const containerStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: isMobile ? 'column' : 'row', // 👈 cambia según el ancho
    justifyContent: 'center',
    alignItems: 'center',
    padding: '20px',
    gap: '10px',
    flexWrap: 'wrap',
  };
  


  return (
    <div style={containerStyle}>
      {steps.map((step) => (
        <div
          key={step.number}
          onClick={() => onStepClick?.(step.number)}
          style={responsiveStepStyle()}
        >
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
