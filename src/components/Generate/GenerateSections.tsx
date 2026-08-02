interface Props {
  isVisible: boolean;
  isGenerating: boolean;
  rowCount: number;
  onGenerate: () => void;
}

const GenerateSection = ({ isVisible, isGenerating, rowCount, onGenerate }: Props) => {
  if (!isVisible) return null;

  return (
    <div className="mx-auto mt-10 max-w-4xl px-6 md:px-0">
      <div className="flex flex-col items-center gap-4 rounded-lg border border-[#1A2B4C]/10 bg-white p-8 text-center shadow-sm">
        <div>
          <p className="font-mono text-xs uppercase tracking-wide text-[#6B7280]">
            Step 3
          </p>
          <h2 className="mt-1 font-serif text-xl text-[#1A2B4C]">
            Ready to generate
          </h2>
          <p className="mt-2 text-sm text-[#6B7280]">
            {rowCount} document{rowCount > 1 ? "s" : ""} will be created from
            your data.
          </p>
        </div>

        <button
          onClick={onGenerate}
          disabled={isGenerating}
          className="flex items-center gap-2 rounded-lg bg-[#1A2B4C] px-8 py-3 font-medium text-white transition hover:bg-[#1A2B4C]/90 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isGenerating && (
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
          )}
          {isGenerating ? "Generating..." : "Generate & Download"}
        </button>
      </div>
    </div>
  );
};

export default GenerateSection;