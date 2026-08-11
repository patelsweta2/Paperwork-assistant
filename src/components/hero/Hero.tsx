import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";

const useTypewriter = (text: string, start: boolean, speed = 40) => {
    const [displayed, setDisplayed] = useState("");

    useEffect(() => {
        if (!start) {
            setDisplayed("");
            return;
        }
        let i = 0;
        const interval = setInterval(() => {
            i++;
            setDisplayed(text.slice(0, i));
            if (i >= text.length) clearInterval(interval);
        }, speed);
        return () => clearInterval(interval);
    }, [start, text]);

    return displayed;
};

const fadeUp = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0 },
};

const slideLeft = {
    hidden: { opacity: 0, x: -30 },
    visible: { opacity: 1, x: 0 },
};

const slideRight = {
    hidden: { opacity: 0, x: 30 },
    visible: { opacity: 1, x: 0 },
};

const Hero = () => {
    const sectionRef = useRef(null);
    const isInView = useInView(sectionRef, { once: false, amount: 0.4 }); // 👈 once: false = replay enabled

    const outputText =
        "Dear Sweta, thank you for joining Acme Co. Effective Aug 2.";
    const typed = useTypewriter(outputText, isInView, 35);

    const prefersReducedMotion =
        typeof window !== "undefined" &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const animState = isInView ? "visible" : "hidden";

    return (
        <section
            ref={sectionRef}
            className="min-h-screen bg-green-100 px-6 py-20 md:px-16 my-9"
        >
            <div className="mx-auto max-w-5xl">
                {/* Eyebrow */}
                <motion.p
                    variants={fadeUp}
                    initial="hidden"
                    animate={animState}
                    transition={{ duration: 0.5 }}
                    className="mb-4 font-mono text-sm uppercase tracking-widest text-green-800"
                >
                    Document automation, simplified
                </motion.p>

                {/* Headline */}
                <motion.h1
                    variants={fadeUp}
                    initial="hidden"
                    animate={animState}
                    transition={{ duration: 0.6, delay: 0.1 }}
                    className="font-serif text-4xl leading-tight text-green-800 md:text-6xl"
                >
                    Your template.
                    <br />
                    Their data.
                    <br />
                    One click.
                </motion.h1>

                {/* Subtext */}
                <motion.p
                    variants={fadeUp}
                    initial="hidden"
                    animate={animState}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="mt-6 max-w-xl text-lg text-[#6B7280]"
                >
                    Upload a Word template and a spreadsheet — get back perfectly
                    filled documents, one for every row.
                </motion.p>

                {/* Merge Demo Section */}
                <div className="mt-16 flex flex-col items-center gap-6 md:flex-row md:items-stretch md:justify-center">
                    {/* DOCX Snippet Card */}
                    <motion.div
                        variants={slideLeft}
                        initial="hidden"
                        animate={animState}
                        transition={{ duration: 0.6, delay: 0.4 }}
                        className="w-full max-w-xs rounded-lg border border-[#1A2B4C]/10 bg-white p-5 shadow-sm"
                    >
                        <p className="mb-3 font-mono text-xs uppercase tracking-wide text-[#6B7280]">
                            Template.docx
                        </p>
                        <p className="font-mono text-sm leading-relaxed text-[#1A2B4C]">
                            Dear{" "}
                            <span className="rounded bg-[#E8A33D]/20 px-1 text-[#E8A33D]">
                                {"{Name}"}
                            </span>
                            ,
                            <br />
                            Thank you for joining{" "}
                            <span className="rounded bg-[#E8A33D]/20 px-1 text-[#E8A33D]">
                                {"{Company}"}
                            </span>
                            .
                            <br />
                            Effective{" "}
                            <span className="rounded bg-[#E8A33D]/20 px-1 text-[#E8A33D]">
                                {"{Date}"}
                            </span>
                            .
                        </p>
                    </motion.div>

                    {/* Connector Arrow */}
                    <div className="flex items-center justify-center">
                        <svg
                            width="60"
                            height="24"
                            viewBox="0 0 60 24"
                            className="rotate-90 text-[#1A2B4C]/40 md:rotate-0"
                        >
                            <motion.line
                                x1="0"
                                y1="12"
                                x2="50"
                                y2="12"
                                stroke="currentColor"
                                strokeWidth="2"
                                variants={{ hidden: { pathLength: 0 }, visible: { pathLength: 1 } }}
                                initial="hidden"
                                animate={animState}
                                transition={{ duration: 0.5, delay: 0.9 }}
                            />
                            <motion.polygon
                                points="50,6 60,12 50,18"
                                fill="currentColor"
                                variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}
                                initial="hidden"
                                animate={animState}
                                transition={{ duration: 0.2, delay: 1.3 }}
                            />
                        </svg>
                    </div>

                    {/* Excel Preview Card */}
                    <motion.div
                        variants={slideRight}
                        initial="hidden"
                        animate={animState}
                        transition={{ duration: 0.6, delay: 0.4 }}
                        className="w-full max-w-xs overflow-hidden rounded-lg border border-[#1A2B4C]/10 bg-white shadow-sm"
                    >
                        <p className="border-b border-[#1A2B4C]/10 bg-[#1A2B4C]/[0.03] p-3 font-mono text-xs uppercase tracking-wide text-[#6B7280]">
                            Data.xlsx
                        </p>
                        <table className="w-full text-left font-mono text-xs">
                            <thead>
                                <tr className="text-[#6B7280]">
                                    <th className="px-3 py-2 font-normal">Name</th>
                                    <th className="px-3 py-2 font-normal">Company</th>
                                    <th className="px-3 py-2 font-normal">Date</th>
                                </tr>
                            </thead>
                            <tbody className="text-[#1A2B4C]">
                                <tr className="border-t border-[#1A2B4C]/5">
                                    <td className="px-3 py-2">Sweta</td>
                                    <td className="px-3 py-2">Acme Co.</td>
                                    <td className="px-3 py-2">Aug 2</td>
                                </tr>
                                <tr className="border-t border-[#1A2B4C]/5 text-[#6B7280]/50">
                                    <td className="px-3 py-2">...</td>
                                    <td className="px-3 py-2">...</td>
                                    <td className="px-3 py-2">...</td>
                                </tr>
                            </tbody>
                        </table>
                    </motion.div>
                </div>

                {/* Merge Output */}
                <motion.div
                    variants={fadeUp}
                    initial="hidden"
                    animate={animState}
                    transition={{ duration: 0.5, delay: 1.5 }}
                    className="mx-auto mt-10 max-w-md rounded-lg border border-[#1A2B4C]/10 bg-white p-5 shadow-sm"
                >
                    <p className="mb-3 font-mono text-xs uppercase tracking-wide text-[#6B7280]">
                        Generated output
                    </p>
                    <p className="min-h-[3rem] font-serif text-base leading-relaxed text-[#1A2B4C]">
                        {prefersReducedMotion ? outputText : typed}
                        {!prefersReducedMotion && typed.length < outputText.length && (
                            <span className="animate-pulse">|</span>
                        )}
                    </p>
                </motion.div>

                {/* CTA */}
                <motion.div
                    variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}
                    initial="hidden"
                    animate={animState}
                    transition={{ duration: 0.5, delay: 2.2 }}
                    className="mt-14 flex justify-center"
                >
                    <button className="rounded-lg bg-green-900 px-8 py-3 font-medium text-white transition hover:bg-green-800">
                        Try it with your files
                    </button>
                </motion.div>
            </div>
        </section>
    );
};

export default Hero;