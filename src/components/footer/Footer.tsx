const Footer = () => {
  return (
    <footer className="mt-20 border-t border-[#1A2B4C]/10 bg-white px-6 py-8 md:px-16">
      <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-3 text-center md:flex-row md:text-left">
        <p className="font-mono text-xs text-[#6B7280]">
          Your files stay in your browser — nothing is uploaded to a server.
        </p>
        <div className="flex items-center gap-4 font-mono text-xs text-[#6B7280]">
          <a href="https://github.com/patelsweta2/Paperwork-assistant" className="hover:text-[#1A2B4C]">
            GitHub
          </a>
          <span>·</span>
          <span>Built by Sweta</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;