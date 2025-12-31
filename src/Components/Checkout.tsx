import { useState } from "react";
import { steps } from "../constants";

const Pagination = () => {
  const [currentStep, setCurrentStep] = useState(0); // Current main step
  const [currentSubStep, setCurrentSubStep] = useState(0); // Current sub-step
  const totalSubSteps = 3; 

  const nextSubStep = () => {
    if (currentSubStep < totalSubSteps - 1) {
      setCurrentSubStep((prev) => prev + 1);
    } else if (currentStep < steps.length - 1) {
      setCurrentStep((prev) => prev + 1);
      setCurrentSubStep(0);
    }
  };

  const prevSubStep = () => {
    if (currentSubStep > 0) {
      setCurrentSubStep((prev) => prev - 1);
    } else if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
      setCurrentSubStep(totalSubSteps - 1);
    }
  };


  type stepIndex = number
 
  const getStepStyle = (stepIndex: stepIndex) => {
    const isActiveStep = stepIndex === currentStep;
    const isCompletedStep = stepIndex < currentStep;
    const progress = isActiveStep
      ? (currentSubStep + 1) - totalSubSteps
      : isCompletedStep
      ? 1
      : 0;

    const borderColor = progress === 1 ? "border-l-green-500" : "border-orange-500";
    const borderStyle = progress > 0 ? `border-${Math.floor(progress * 4)}` : "border-none";

    return `w-10 h-10 rounded-full flex items-center justify-center ${
      isActiveStep ? "bg-blue-500 text-white" : "bg-gray-300"
    } ${borderStyle} ${borderColor} transition-all duration-300 ease-in-out`;
  };

  return (
    <div className="max-w-lg mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        {steps?.map((_, index) => (
          <div key={index} className={getStepStyle(index)}>
            {index + 1}
          </div>
        ))}
      </div>

      <div className="border p-6 rounded-lg shadow-md bg-white">
        <label className="block text-lg font-semibold text-gray-700 mb-2">
          {steps[currentStep][currentSubStep].label}
        </label>
        <input
          type={steps[currentStep][currentSubStep].type}
          placeholder={steps[currentStep][currentSubStep].placeholder}
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
        />
      </div>

      <div className="flex justify-between mt-6">
        <button
          onClick={prevSubStep}
          disabled={currentStep === 0 && currentSubStep === 0}
          className={`py-2 px-4 rounded-lg ${
            currentStep === 0 && currentSubStep === 0
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-black text-white hover:bg-gray-800"
          }`}
        >
          Prev
        </button>
        <button
          onClick={nextSubStep}
          disabled={currentStep === steps.length - 1 && currentSubStep === totalSubSteps - 1}
          className={`py-2 px-4 rounded-lg ${
            currentStep === steps.length - 1 && currentSubStep === totalSubSteps - 1
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-black text-white hover:bg-gray-800"
          }`}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Pagination;