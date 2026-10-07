import { RotateCcw } from "lucide-react";
import type { ExcelRow, PlaceholderMapping } from "../../type/document";

interface Props {
    mapping: PlaceholderMapping;
    headers: string[];
    firstRow?: ExcelRow;
    onColumnChange: (placeholder: string, newColumn: string) => void;
    onResetToDefault: (placeholder: string) => void;
}

const getConfidenceBadge = (mapping: PlaceholderMapping) => {
    if (mapping.source === "manual") {
        return { label: "Manually set", color: "text-[#1A2B4C] bg-[#1A2B4C]/5" };
    }
    if (!mapping.matched) {
        return { label: "No match", color: "text-[#C0392B] bg-[#C0392B]/10" };
    }
    const confidence = mapping.confidence ?? 0;
    if (confidence >= 0.75) {
        return { label: `${Math.round(confidence * 100)}% match`, color: "text-[#2F6E4E] bg-[#2F6E4E]/10" };
    }
    return { label: `${Math.round(confidence * 100)}% match — verify`, color: "text-[#E8A33D] bg-[#E8A33D]/10" };
};

const getSampleValue = (column: string | null, firstRow?: ExcelRow): string | null => {
    if (!column || !firstRow) return null;
    const value = firstRow[column];
    if (value === undefined || value === null || value === "") return "(empty)";
    return String(value);
};

const MappingRow = ({ mapping, headers, firstRow, onColumnChange, onResetToDefault }: Props) => {
    const badge = getConfidenceBadge(mapping);
    const sampleValue = getSampleValue(mapping.column, firstRow);
    const canReset = mapping.source === "manual";

    return (
        <div className="grid grid-cols-[1fr,1.2fr,auto] items-center gap-3 border-b border-[#1A2B4C]/5 px-4 py-3 last:border-b-0">
            <div>
                <select
                    value={mapping.column ?? ""}
                    onChange={(e) => onColumnChange(mapping.placeholder, e.target.value)}
                    className="rounded-md border border-[#1A2B4C]/15 bg-white px-2 py-1.5 font-mono text-sm text-[#1A2B4C] focus:border-[#E8A33D] focus:outline-none"
                >
                    <option value="" disabled hidden>
                        -- select column --
                    </option>
                    {headers.map((header) => (
                        <option key={header} value={header}>
                            {header}
                        </option>
                    ))}
                    <option value="__none__" className="text-blue-950">Leave as placeholder</option>
                </select>
                {sampleValue !== null && (
                    <p className="mt-1 truncate font-mono text-xs text-[#6B7280]">
                        e.g. {sampleValue}
                    </p>
                )}

            </div>
            <span className={`whitespace-nowrap rounded-full px-2 py-1 text-xs font-medium ${badge.color}`}>
                {badge.label}
            </span>
            {canReset ? (
                <button
                    type="button"
                    onClick={() => onResetToDefault(mapping.placeholder)}
                    title="Reset to suggested match"
                    className="text-[#6B7280] transition hover:text-[#1A2B4C] cursor-pointer"
                >
                    <RotateCcw size={14} />
                </button>
            ) : (
                <span className="w-[14px]" />
            )}
        </div>
    );
};

export default MappingRow;