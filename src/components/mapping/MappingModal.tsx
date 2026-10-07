import type { ExcelRow, PlaceholderMapping } from "../../type/document";
import MappingRow from "./MappingRow";

interface Props {
    isOpen: boolean;
    onClose: () => void;
    mappings: PlaceholderMapping[];
    headers: string[];
    firstRow?: ExcelRow;
    onColumnChange: (placeholder: string, newColumn: string) => void;
    onConfirm: () => void;
    onResetToDefault: (placeholder: string) => void;
    onResetAll: () => void;
}

const MappingModal = ({
    isOpen,
    onClose,
    mappings,
    headers,
    firstRow,
    onColumnChange,
    onConfirm,
    onResetToDefault,
    onResetAll
}: Props) => {
    if (!isOpen) return null;

    const unmatchedCount = mappings.filter((m) => !m.matched).length;

    const handleConfirmClick = () => {
        onConfirm();
        onClose();
    };

    const hasManualEdits = mappings.some((m) => m.source === "manual");

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-[#1A2B4C]/40 px-4">
            <div className="max-h-[85vh] w-full max-w-2xl overflow-hidden rounded-lg bg-white shadow-xl">
                <div className="flex items-center justify-between border-b border-[#1A2B4C]/10 p-6">
                    <div>
                        <p className="font-mono text-xs uppercase tracking-wide text-[#6B7280]">
                            Step 3
                        </p>
                        <h2 className="mt-1 font-serif text-xl text-[#1A2B4C]">
                            Review Mapping
                        </h2>
                    </div>
                    <div className="flex items-center gap-3">
                        {hasManualEdits && (
                            <button
                                type="button"
                                onClick={onResetAll}
                                className="font-mono text-xs text-[#6B7280] underline hover:text-[#1A2B4C] cursor-pointer"
                            >
                                Reset all
                            </button>
                        )}
                        <button onClick={onClose} className="text-[#6B7280] hover:text-[#1A2B4C] cursor-pointer" aria-label="Close">
                            ✕
                        </button>
                    </div>
                </div>

                <div className="max-h-[50vh] overflow-y-auto">
                    {mappings.map((mapping) => (
                        <MappingRow
                            key={mapping.placeholder}
                            mapping={mapping}
                            headers={headers}
                            onColumnChange={onColumnChange}
                            onResetToDefault={onResetToDefault}
                            firstRow={firstRow}
                        />
                    ))}
                </div>

                <div className="flex flex-col items-center gap-2 border-t border-[#1A2B4C]/10 p-6">
                    {unmatchedCount > 0 && (
                        <p className="text-xs text-[#E8A33D]">
                            {unmatchedCount} placeholder{unmatchedCount > 1 ? "s" : ""} will remain as-is in the document.
                        </p>
                    )}
                    <button
                        onClick={handleConfirmClick}
                        className="rounded-lg bg-[#1A2B4C] m-1 px-2 py-1 font-medium text-white transition hover:bg-[#1A2B4C]/90 cursor-pointer"
                    >
                        Confirm Mapping
                    </button>
                </div>
            </div>
        </div>
    );
};

export default MappingModal;