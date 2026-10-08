<?php
// Batlh Studio contact form handler (Aruba, PHP 5.3+ compatible, works on 8.x).
// Anti-spam: same-site check, honeypot, minimum fill time, per-IP rate limit, link limit, header-injection stripping.
// The recipient lives only here, so the address never appears in the page HTML.

$TO = 'farghittone@yahoo.com';
$FROM = 'noreply@virtusvelletri.it';
$SITE_HOST = 'virtusvelletri.it';
$MAX_PER_HOUR = 3;

header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');

function fail($code, $msg) {
    $texts = array(400 => 'Bad Request', 403 => 'Forbidden', 405 => 'Method Not Allowed', 429 => 'Too Many Requests', 500 => 'Internal Server Error');
    header('HTTP/1.1 ' . $code . ' ' . $texts[$code]);
    echo json_encode(array('ok' => false, 'error' => $msg));
    exit;
}
function clean($s) { return trim(preg_replace('/[\r\n\t]+/', ' ', strip_tags((string)$s))); }
function text_len($s) { return function_exists('mb_strlen') ? mb_strlen($s, 'UTF-8') : strlen($s); }

// ---- Content filters (spam that passes the browser-side checks) ----
function has_link($t) {
    if (preg_match('#(https?://|ftp://|www\.|@[a-z0-9-]+\.[a-z]{2,})#i', $t)) return true;
    // bare domains and URL shorteners (shorturl.at, bit.ly, t.co ...)
    return (bool)preg_match('#\b[a-z0-9-]{2,}\.(com|net|org|info|biz|io|ly|at|co|me|xyz|top|site|online|shop|store|link|click|ru|cn|tk|ml|cc|us|to|gl|ws|li|im)\b#i', $t);
}
function spam_phrase($t) {
    $t = strtolower($t);
    $phrases = array('free trial', 'free 7-day', '7-day trial', 'cancel whenever', 'long-term commitment', 'no long-term', 'our ai', 'leads or customers',
        'more leads', 'boost your', 'increase your traffic', 'web traffic', 'backlinks', 'seo services', 'seo audit', 'click here', 'limited time',
        'limited offer', 'buy now', 'act now', 'crypto', 'bitcoin', 'casino', 'viagra', 'cialis', 'forex', 'loan offer', 'make money', 'work from home',
        'earn $', '100% free', 'risk-free', 'dear sir', 'dear friend', 'rank #1', 'first page of google', 'promote your', 'marketing agency',
        'guaranteed results', 'special offer', 'unsubscribe', 'whatsapp me', 'investment opportunity', 'business proposal', 'congratulations you');
    foreach ($phrases as $p) { if (strpos($t, $p) !== false) return true; }
    return false;
}
function looks_english_only($t) {
    $words = preg_split('/[^a-z\']+/i', strtolower($t), -1, PREG_SPLIT_NO_EMPTY);
    $en = array_flip(array('the', 'and', 'your', 'our', 'you', 'with', 'for', 'this', 'that', 'are', 'will', 'can', 'more', 'from', 'have', 'to', 'of', 'is', 'we', 'on'));
    $it = array_flip(array('il', 'la', 'di', 'che', 'per', 'un', 'una', 'sono', 'non', 'vorrei', 'buongiorno', 'buonasera', 'salve', 'ciao', 'del', 'della', 'mio', 'mia', 'ho', 'come', 'con', 'si', 'le', 'i', 'gli', 'in', 'e', 'o', 'ma', 'anche', 'grazie'));
    $e = 0; $i = 0;
    foreach ($words as $w) { if (isset($en[$w])) $e++; if (isset($it[$w])) $i++; }
    return $e >= 3 && $i === 0;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') fail(405, 'Metodo non consentito.');

// Only accept posts coming from our own pages
$origin = isset($_SERVER['HTTP_ORIGIN']) ? $_SERVER['HTTP_ORIGIN'] : (isset($_SERVER['HTTP_REFERER']) ? $_SERVER['HTTP_REFERER'] : '');
$host = parse_url($origin, PHP_URL_HOST);
if (!$host || substr($host, -strlen($SITE_HOST)) !== $SITE_HOST) fail(403, 'Richiesta non valida.');

// Honeypot: real users never fill the hidden field
if (!empty($_POST['sito'])) { echo json_encode(array('ok' => true)); exit; }

// Minimum fill time (3s) and maximum age (2h): bots post instantly
$loaded = isset($_POST['t']) ? (float)$_POST['t'] / 1000 : 0;
$age = time() - $loaded;
if ($loaded <= 0 || $age < 3 || $age > 7200) fail(400, 'Riprova tra qualche secondo.');

// Rate limit per IP
$ip = isset($_SERVER['REMOTE_ADDR']) ? $_SERVER['REMOTE_ADDR'] : 'x';
$file = rtrim(sys_get_temp_dir(), '/\\') . '/vv_batlh_' . md5($ip) . '.txt';
$now = time();
$hits = array();
if (is_file($file)) {
    foreach (explode(',', (string)file_get_contents($file)) as $h) { if ((int)$h > $now - 3600) $hits[] = (int)$h; }
}
if (count($hits) >= $MAX_PER_HOUR) fail(429, 'Hai inviato troppi messaggi. Riprova più tardi.');

$allowed = array('Sito vetrina', 'Restyling di un sito esistente', 'Altro');
$nome = clean(isset($_POST['nome']) ? $_POST['nome'] : '');
$email = clean(isset($_POST['email']) ? $_POST['email'] : '');
$tipo = clean(isset($_POST['tipo']) ? $_POST['tipo'] : '');
$messaggio = trim(strip_tags(isset($_POST['messaggio']) ? (string)$_POST['messaggio'] : ''));
$consenso = !empty($_POST['consenso']);

if (!in_array($tipo, $allowed, true)) $tipo = 'Altro';
if (text_len($nome) < 2 || text_len($nome) > 80) fail(400, 'Inserisci il tuo nome.');
if (!filter_var($email, FILTER_VALIDATE_EMAIL) || strlen($email) > 120) fail(400, 'Inserisci un indirizzo email valido.');
if (text_len($messaggio) < 10 || text_len($messaggio) > 2000) fail(400, 'Il messaggio deve avere tra 10 e 2000 caratteri.');
if (!$consenso) fail(400, 'Devi acconsentire al trattamento dei dati.');
if (has_link($messaggio . ' ' . $nome)) fail(400, 'Per sicurezza non accettiamo link nel messaggio: scrivi il testo senza indirizzi web.');
if (spam_phrase($messaggio . ' ' . $nome)) fail(400, 'Il messaggio sembra pubblicità: se non lo è, riformulalo.');
if (preg_match('/(content-type:|bcc:|cc:|mime-version:)/i', $nome . $email)) fail(400, 'Richiesta non valida.');

$hits[] = $now;
@file_put_contents($file, implode(',', $hits));

$subject = '=?UTF-8?B?' . base64_encode('Batlh Studio - richiesta da ' . $nome) . '?=';
$body = "Nuova richiesta dal modulo di Batlh Studio\n\n"
      . "Nome: $nome\nEmail: $email\nTipo di progetto: $tipo\nIP: $ip\n\n"
      . "Messaggio:\n$messaggio\n";
$headers = "From: Batlh Studio <$FROM>\r\n"
         . "Reply-To: $nome <$email>\r\n"
         . "MIME-Version: 1.0\r\n"
         . "Content-Type: text/plain; charset=UTF-8\r\n"
         . "X-Mailer: batlh-studio-contatti\r\n";

if (!@mail($TO, $subject, $body, $headers)) fail(500, 'Invio non riuscito. Riprova più tardi.');
echo json_encode(array('ok' => true));
