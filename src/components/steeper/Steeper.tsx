type StepStatus = "upcoming" | "active" | "completed";

type Step = {
  label: string;
};

const steps: Step[] = [
  { label: "Upload Template" },
  { label: "Upload Excel" },
  { label: "Generate & Download" },
];

type StepperProps = {
  currentStep: number; // 0-indexed
  onStepClick?: (step: number) => void;
};

const getStatus = (index: number, currentStep: number): StepStatus => {
  if (index < currentStep) return "completed";
  if (index === currentStep) return "active";
  return "upcoming";
};

const Stepper = ({ currentStep, onStepClick }: StepperProps) => {
  return (
    <div className="sticky top-20 z-50 border-b border-[#1A2B4C]/10 bg-green-50 backdrop-blur-sm">
      <div className="mx-auto max-w-5xl px-6 py-4 md:px-16">
        <div className="flex items-center">
          {steps.map((step, index) => {
            const status = getStatus(index, currentStep);
            const isClickable = status === "completed" && onStepClick;

            return (
              <div key={step.label} className="flex flex-1 items-center last:flex-none">
                {/* Step Circle + Label */}
                <button
                  type="button"
                  disabled={!isClickable}
                  onClick={() => isClickable && onStepClick?.(index)}
                  className={`flex items-center gap-2 ${
                    isClickable ? "cursor-pointer" : "cursor-default"
                  }`}
                >
                  <span
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 font-mono text-sm transition-colors duration-300 ${
                      status === "completed"
                        ? "border-[#1A2B4C] bg-[#1A2B4C] text-white"
                        : status === "active"
                        ? "border-[#E8A33D] bg-[#E8A33D]/10 text-[#E8A33D]"
                        : "border-[#1A2B4C]/20 text-[#1A2B4C]/40"
                    }`}
                  >
                    {status === "completed" ? "✓" : index + 1}
                  </span>
                  <span
                    className={`hidden text-sm font-medium sm:inline ${
                      status === "upcoming" ? "text-[#1A2B4C]/40" : "text-[#1A2B4C]"
                    }`}
                  >
                    {step.label}
                  </span>
                </button>

                {/* Connecting Line */}
                {index < steps.length - 1 && (
                  <div className="mx-3 h-[2px] flex-1 bg-[#1A2B4C]/10">
                    <div
                      className="h-full bg-[#1A2B4C] transition-all duration-500 ease-out"
                      style={{
                        width: status === "completed" ? "100%" : "0%",
                      }}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Stepper;