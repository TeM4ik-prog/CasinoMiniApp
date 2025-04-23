import { ReactNode } from "react"

interface Props {
    children: ReactNode,
    className?: string
    lighter?: boolean
}

export const Block = ({ children, className, lighter }: Props) => {
    const bgColor = lighter 
        ? 'bg-casino-secondary border border-casino-border-20' 
        : 'bg-casino-primary border border-casino-border-10'

    return (
        <div className={`${bgColor} relative shadow-lg rounded-lg overflow-hidden w-full p-4 ${className}`}>
            {children}
        </div>
    )
}