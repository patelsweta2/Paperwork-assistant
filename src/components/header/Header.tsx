import { FileText, Check } from "lucide-react";

type HeaderProps = {
    currentStep: number;
};

const navItems = [
    {
        label: "Upload Template",
        id: "upload-template",
    },
    {
        label: "Upload Excel",
        id: "upload-excel",
    },
    {
        label: "Mapping",
        id: "mapping",
    },
    {
        label: "Generate",
        id: "generate",
    },
] as const;

export default function Header({
    currentStep,
}: HeaderProps): React.JSX.Element {
    const scrollToSection = (id: string): void => {
        const element = document.getElementById(id);

        if (element) {
            element.scrollIntoView({
                behavior: "smooth",
                block: "start",
            });
        }
    };

    return (
        <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/90 backdrop-blur-md shadow-sm">
            <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">
                {/* Logo */}
                <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-green-100 p-2">
                        <FileText
                            size={22}
                            className="text-green-700"
                        />
                    </div>

                    <div>
                        <h1 className="text-lg font-semibold">
                            Paperwork Assistant
                        </h1>

                        <p className="text-xs text-gray-500">
                            Automate DOCX Generation
                        </p>
                    </div>
                </div>

                {/* Navigation */}
                <nav className="flex items-center gap-3">
                    {navItems.map((item, index) => {
                        const isCompleted = index < currentStep;
                        const isActive = index === currentStep;
                        const isDisabled = index > currentStep;

                        return (
                            <button
                                key={item.id}
                                disabled={isDisabled}
                                onClick={() => scrollToSection(item.id)}
                                className={`
                  flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-all
                  ${isCompleted
                                        ? "text-green-600 hover:text-green-700"
                                        : isActive
                                            ? "bg-green-100 text-green-700"
                                            : "cursor-not-allowed text-gray-400"
                                    }
                `}
                            >
                                {isCompleted && <Check size={16} />}

                                {item.label}
                            </button>
                        );
                    })}
                </nav>
            </div>
        </header>
    );
}