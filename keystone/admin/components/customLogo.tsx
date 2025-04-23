import React from 'react'
import Link from 'next/link'

export function CustomLogo() {
    return (
        <Link
            href="/"
            style={{
                backgroundImage: `linear-gradient(to right, #0ea5e9, #6366f1)`,
                backgroundClip: 'text',
                lineHeight: '1.75rem',
                color: 'transparent',
                verticalAlign: 'middle',
                transition: 'color 0.3s ease',
                textDecoration: 'none',
            }}
        >
            <img src='../uploads/images/logo.png'></img>
        </Link>
    )
}