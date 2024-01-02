import { useState, useRef } from 'react'
import DOMPurify from 'dompurify'
import { marked } from 'marked'

marked.use({
  gfm: true,
})


function App() {
  const [serverData, setServerData] = useState([{}])
  const [userPrompt, setUserPrompt] = useState('')
  const inputRef = useRef(null)

  function handleKeyDown(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      inputRef.current.blur()
      handleSubmit()
    }
  }

  function handleSubmit() {
    setServerData('')
    if (userPrompt !== '') {
      fetch('/api', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 'prompt': userPrompt })
      })
        .then((res) => res.json())
        .then((data) => {
          const html = DOMPurify.sanitize(marked(data))
          setServerData({ ...data, html })
          inputRef.current.focus()
          setUserPrompt('')
        })
    }
  }

  return (
    <main style={{ height: '100vh', display: 'flex', flexDirection: 'column', }}>
      <body style={{ backgroundColor: '#9BCCFD' }} ></body>
      <h1 style={{ padding: '10px', margin: '0', color: '#3C71F7' }}>AI Generated Text</h1>
      <p style={{ padding: '10px', margin: '0', color: '#F06048' }}>Powered by Google Gemini PRO</p>
      <div style={{ margin: '0', flexGrow: '1', overflow: 'scroll' }}>
        <div style={{ width: '100%', height: '100%' }}>
          {
            (serverData === '') ? ('Loading...') :
              <article style={{ margin: '0' }} dangerouslySetInnerHTML={{ __html: serverData.html }} />
          }
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'end', backgroundColor: '#111', padding: '10px' }}>
        <textarea onChange={(e) => setUserPrompt(e.target.value)} onKeyDown={handleKeyDown} ref={inputRef} value={userPrompt} style={{ margin: '0', flexGrow: '1', overflowY: 'hidden', color:'whitesmoke' }} placeholder='Type in a prompt...' />
        <button onClick={handleSubmit} style={{ margin: '0', flex: '1', marginLeft: '10px', }}>Go</button>
      </div>
    </main>
  )
}

export default App
