import { cn } from "@/lib/utils";
import { InputHTMLAttributes, forwardRef } from "react";

interface Props extends InputHTMLAttributes<HTMLInputElement> {
    error?: string;
    label?: string;
}

export const Input = forwardRef<HTMLInputElement, Props>(
    ({ className, error, label, ...props }, ref) => {
        return (
            <div className="w-full">
                {label && (
                    <label className="block text-sm font-medium text-gray-400 mb-1">
                        {label}
                    </label>
                )}
                <input
                    className={cn(
                        "w-full bg-white/5 border-2 border-transparent rounded-md px-4 py-2",
                        "text-white placeholder:text-gray-500",
                        "transition-all duration-200",
                        "focus:outline-none focus:border-casino-gold",
                        "disabled:opacity-50 disabled:cursor-not-allowed",
                        error && "border-red-500 focus:border-red-500",
                        className
                    )}
                    ref={ref}
                    {...props}
                />
                {error && (
                    <p className="mt-1 text-sm text-red-500">{error}</p>
                )}
            </div>
        );
    }
);
