import type { Placeholder } from "../type/document";

interface Props {
    isOpen: boolean;
    onClose: () => void;
    placeholders: Placeholder[];
}

const PlaceholderModal = ({ isOpen, onClose, placeholders }: Props) => {
    if (!isOpen) return null;

    const handleCopy = (name: string) => {
        navigator.clipboard.writeText(name);
    };

    const handleCopyAll = () => {
        navigator.clipboard.writeText(placeholders.map((p) => p.name).join("\n"));
    };

    const handleDownloadCsv = () => {
        const csv = "Placeholder\n" + placeholders.map((p) => p.name).join("\n");
        const blob = new Blob([csv], { type: "text/csv" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "placeholders.csv";
        a.click();
        URL.revokeObjectURL(url);
    };

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-[#1A2B4C]/40 px-4">
            <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
                <div className="mb-4 flex items-center justify-between">
                    <h3 className="font-serif text-lg text-[#1A2B4C]">
                        Template Placeholders
                    </h3>
                    <button
                        onClick={onClose}
                        className="text-[#6B7280] hover:text-[#1A2B4C]"
                        aria-label="Close"
                    >
                        ✕
                    </button>
                </div>

                <div className="max-h-64 space-y-2 overflow-y-auto">
                    {placeholders.map((p) => (
                        <div
                            key={p.name}
                            className="flex items-center justify-between rounded-md bg-green-100 px-3 py-2"
                        >
                            <span className="font-mono text-sm text-[#1A2B4C]">
                                {`{${p.name}}`}
                            </span>
                            <button
                                onClick={() => handleCopy(p.name)}
                                className="font-mono cursor-pointer text-xs text-[#6B7280] hover:text-green-800"
                            >
                                Copy
                            </button>
                        </div>
                    ))}
                </div>

                <div className="mt-5 flex gap-3">
                    <button
                        onClick={handleCopyAll}
                        className="flex-1 rounded-md border cursor-pointer border-[#1A2B4C]/20 py-2 font-mono text-xs text-[#1A2B4C] hover:bg-[#1A2B4C]/5"
                    >
                        Copy all
                    </button>
                    <button
                        onClick={handleDownloadCsv}
                        className="flex-1 rounded-md bg-green-700 py-2 font-mono text-xs cursor-pointer text-white hover:bg-green-800"
                    >
                        Download CSV
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PlaceholderModal;