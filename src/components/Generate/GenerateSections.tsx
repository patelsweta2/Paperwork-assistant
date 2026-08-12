interface Props {
  isVisible: boolean;
  isGenerating: boolean;
  rowCount: number;
  progress: { current: number; total: number };
  isReadyToDownload: boolean;
  onGenerate: () => void;
  onDownload: () => void;
  onReset: () => void;
}

const GenerateSection = ({
  isVisible,
  isGenerating,
  rowCount,
  progress,
  isReadyToDownload,
  onGenerate,
  onDownload,
  onReset,
}: Props) => {
  if (!isVisible) return null;

  const percent =
    progress.total > 0 ? Math.round((progress.current / progress.total) * 100) : 0;

  return (
    <div className="mx-auto mt-10 max-w-4xl px-6 md:px-0">
      <div className="flex flex-col items-center gap-4 rounded-lg border border-[#1A2B4C]/10 bg-white p-8 text-center shadow-sm">
        <div>
          <p className="font-mono text-xs uppercase tracking-wide text-[#6B7280]">
            Step 3
          </p>
          <h2 className="mt-1 font-serif text-xl text-[#1A2B4C]">
            {isReadyToDownload ? "Documents ready" : "Ready to generate"}
          </h2>
          <p className="mt-2 text-sm text-[#6B7280]">
            {isGenerating
              ? `${progress.current} of ${progress.total} documents created`
              : isReadyToDownload
                ? `${rowCount} document${rowCount > 1 ? "s" : ""} bundled and ready.`
                : `${rowCount} document${rowCount > 1 ? "s" : ""} will be created from your data.`}
          </p>
        </div>

        {isGenerating && (
          <div className="w-full max-w-sm">
            <div className="h-2 w-full overflow-hidden rounded-full bg-[#1A2B4C]/10">
              <div
                className="h-full rounded-full bg-[#E8A33D] transition-all duration-200 ease-out"
                style={{ width: `${percent}%` }}
              />
            </div>
            <p className="mt-2 font-mono text-xs text-[#6B7280]">{percent}%</p>
          </div>
        )}

        <div className="flex gap-3">
          <button
            onClick={onGenerate}
            disabled={isGenerating}
            className="flex cursor-pointer items-center gap-2 rounded-lg bg-[#1A2B4C] px-8 py-3 font-medium text-white transition hover:bg-[#1A2B4C]/90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isGenerating && (
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
            )}
            {isGenerating ? "Generating..." : isReadyToDownload ? "Regenerate" : "Generate"}
          </button>

          {isReadyToDownload && (
            <button
              onClick={onDownload}
              className="rounded-lg cursor-pointer bg-[#2F6E4E] px-8 py-3 font-medium text-white transition hover:bg-[#2F6E4E]/90"
            >
              Download ZIP
            </button>
          )}
          {isReadyToDownload && (
            <button
              onClick={onReset}
              className="rounded-lg cursor-pointer border border-[#1A2B4C]/20 px-6 py-3 font-medium text-[#1A2B4C] transition hover:bg-[#1A2B4C]/5"
            >
              Start New Batch
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default GenerateSection;