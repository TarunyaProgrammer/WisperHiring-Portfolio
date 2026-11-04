import React from 'react'
import { createRoot } from 'react-dom/client'
import '@fontsource/instrument-serif/latin-400.css'
import '@fontsource/instrument-serif/latin-400-italic.css'
import '@fontsource-variable/inter'
import { App } from './App'
import './styles.css'
createRoot(document.getElementById('root')!).render(<React.StrictMode><App/></React.StrictMode>)
