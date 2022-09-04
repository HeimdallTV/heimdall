import './global' // Must be first
import ReactDOM from 'react-dom/client'
import { Router } from './router'

const root = ReactDOM.createRoot(document.getElementById('app') as HTMLElement)
root.render(<Router />)
