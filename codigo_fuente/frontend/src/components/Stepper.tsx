import React, { useState } from 'react';

interface StepperProps {
  currentStep?: number;
  onStepClick?: (step: number) => void;
}

const Stepper: React.FC<StepperProps> = ({ currentStep: initialStep = 1, onStepClick }) => {
  const [currentStep, setCurrentStep] = useState<number>(initialStep);

  const handleStepClick = (stepNumber: number) => {
    setCurrentStep(stepNumber);
    if (onStepClick) {
      onStepClick(stepNumber);
    }
  };

  const getStepBackgroundColor = (stepNumber: number): string => {
    return stepNumber === currentStep ? '#009ADA' : '#32A430';
  };

  const getTextColor = (stepNumber: number): string => {
    return 'white';
  };

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '20px',
      width: '100%',
      overflow: 'hidden',
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
      }}>
        {/* Paso 1 */}
        <div
          onClick={() => handleStepClick(1)}
          style={{
            backgroundColor: getStepBackgroundColor(1),
            color: getTextColor(1),
            padding: '15px 30px',
            borderTopLeftRadius: '8px',
            borderBottomLeftRadius: '8px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            cursor: 'pointer',
            position: 'relative',
          }}
        >
          <div style={{ fontSize: '14px', fontWeight: '500', textAlign: 'center' }}>Paso 1:</div>
          <div style={{ fontSize: '12px', textAlign: 'center' }}>Seleccionar actividad</div>
          {currentStep < 2 && (
            <div style={{
              width: 0,
              height: 0,
              borderTop: '30px solid transparent',
              borderBottom: '30px solid transparent',
              borderLeft: `20px solid ${getStepBackgroundColor(1)}`,
              position: 'absolute',
              right: '-20px',
              top: '50%',
              transform: 'translateY(-50%)',
              zIndex: 0,
            }} />
          )}
        </div>

        {/* Paso 2 */}
        <div
          onClick={() => handleStepClick(2)}
          style={{
            backgroundColor: getStepBackgroundColor(2),
            color: getTextColor(2),
            padding: '15px 30px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            cursor: 'pointer',
            position: 'relative',
          }}
        >
          {currentStep > 1 && (
            <div style={{
              width: 0,
              height: 0,
              borderTop: '30px solid transparent',
              borderBottom: '30px solid transparent',
              borderRight: `20px solid ${getStepBackgroundColor(2)}`,
              position: 'absolute',
              left: '-20px',
              top: '50%',
              transform: 'translateY(-50%)',
              zIndex: 0,
            }} />
          )}
          <div style={{ fontSize: '14px', fontWeight: '500', textAlign: 'center' }}>Paso 2:</div>
          <div style={{ fontSize: '12px', textAlign: 'center' }}>Inscribir visitantes</div>
          {currentStep < 3 && (
            <div style={{
              width: 0,
              height: 0,
              borderTop: '30px solid transparent',
              borderBottom: '30px solid transparent',
              borderLeft: `20px solid ${getStepBackgroundColor(2)}`,
              position: 'absolute',
              right: '-20px',
              top: '50%',
              transform: 'translateY(-50%)',
              zIndex: 0,
            }} />
          )}
        </div>

        {/* Paso 3 */}
        <div
          onClick={() => handleStepClick(3)}
          style={{
            backgroundColor: getStepBackgroundColor(3),
            color: getTextColor(3),
            padding: '15px 30px',
            borderTopRightRadius: '8px',
            borderBottomRightRadius: '8px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            cursor: 'pointer',
            position: 'relative',
          }}
        >
          {currentStep > 2 && (
            <div style={{
              width: 0,
              height: 0,
              borderTop: '30px solid transparent',
              borderBottom: '30px solid transparent',
              borderRight: `20px solid ${getStepBackgroundColor(3)}`,
              position: 'absolute',
              left: '-20px',
              top: '50%',
              transform: 'translateY(-50%)',
              zIndex: 0,
            }} />
          )}
          <div style={{ fontSize: '14px', fontWeight: '500', textAlign: 'center' }}>Paso 3:</div>
          <div style={{ fontSize: '12px', textAlign: 'center' }}>Detalle de inscripción</div>
        </div>
      </div>
    </div>
  );
};

export default Stepper;