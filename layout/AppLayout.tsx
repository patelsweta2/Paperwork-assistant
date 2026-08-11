import Header from './../src/components/header/Header';
type AppLayoutProps = {
  currentStep: number;
  children: React.ReactNode;
  // onUploadClick: () => void;
};

export default function AppLayout({
  currentStep,
  children,
}: AppLayoutProps) {
  return (
    <>
      <Header currentStep={currentStep} />

      <main className="mx-auto max-w-6xl px-8 py-8">
        {children}
      </main>
    </>
  );
}