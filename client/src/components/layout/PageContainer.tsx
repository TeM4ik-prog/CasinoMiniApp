import { motion } from "framer-motion";
import { ReactNode } from "react";

interface Props {
    title?: string;
    children: ReactNode,
    className?: string
}

export const PageContainer = ({ title, children, className }: Props) => {
    return (
        <motion.section
            key={title}
            className={`w-full min-h-screen relative z-0 ${className}`}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
        >
            <div className="w-full h-full">
                {title && (
                    <h1 className="text-4xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 mb-12">
                        {title}
                    </h1>
                )}
                    {children}
            </div>
        </motion.section>
    )
}