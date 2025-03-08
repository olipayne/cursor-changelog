/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: {
                    50: '#e6f7f7',
                    100: '#ccefef',
                    200: '#99dfdf',
                    300: '#66cfcf',
                    400: '#33bfbf',
                    500: '#00afaf',
                    600: '#008c8c',
                    700: '#006969',
                    800: '#004646',
                    900: '#002323',
                    950: '#001111',
                },
                cursor: {
                    dark: '#0c0c0c',      // Near black background
                    darker: '#050505',    // Darker near-black 
                    light: '#ffffff',     // White text
                    muted: '#999999',     // Muted text
                    border: '#333333',    // Border color
                    accent: '#00afaf',    // Teal accent color
                }
            },
            fontFamily: {
                sans: ['Inter', 'system-ui', 'sans-serif'],
                mono: ['JetBrains Mono', 'Menlo', 'Monaco', 'Consolas', 'monospace'],
            },
            backgroundImage: {
                'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
            },
        },
    },
    plugins: [],
} 