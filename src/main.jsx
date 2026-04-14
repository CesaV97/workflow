import React from 'react'
import ReactDOM from 'react-dom/client'

function App() {
  return (
    <div>
      <h1>WorkFlow App</h1>
      <p>Welcome to the WorkFlow application</p>
    </div>
  )
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
