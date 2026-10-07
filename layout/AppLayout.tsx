import Header from './../src/components/header/Header';
type AppLayoutProps = {
  currentStep: number;
  children: React.ReactNode;
  onReset: () => void;
};

export default function AppLayout({
  currentStep,
  onReset,
  children,
}: AppLayoutProps) {
  return (
    <>
      <Header currentStep={currentStep} onReset={onReset}/>
      <main className="mx-auto max-w-6xl px-8 py-8">
        {children}
      </main>
    </>
  );
}