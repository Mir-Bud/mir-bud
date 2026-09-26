<?php
$dir = __DIR__ . '/photos/';
$webDir = 'photos/';
$allowed = ['jpg','jpeg','png','webp','gif','avif'];
$files = [];
if (is_dir($dir)) {
  foreach (scandir($dir) as $f) {
    if ($f === '.' || $f === '..') continue;
    $ext = strtolower(pathinfo($f, PATHINFO_EXTENSION));
    if (in_array($ext, $allowed, true)) $files[] = $f;
  }
}
natsort($files);
$files = array_values($files);
function e($s){ return htmlspecialchars($s, ENT_QUOTES, 'UTF-8'); }
?>
<!doctype html>
<html lang="uk">
<head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>MIRBUD — каталог</title>
<style>
body{margin:0;background:#f4f2ed;color:#171a19;font-family:Arial,sans-serif}.wrap{max-width:1400px;margin:auto;padding:30px 20px}
h1{font-size:clamp(40px,6vw,76px);margin:0 0 12px;letter-spacing:-.06em}.sub{color:#70736f;margin-bottom:30px}.phone{display:inline-block;background:#d49b38;color:#171a19;padding:14px 18px;border-radius:12px;font-weight:800;text-decoration:none;margin-bottom:30px}
.grid{display:grid;grid-template-columns:repeat(4,1fr);gap:18px}.card{background:#fff;border-radius:20px;overflow:hidden}.pic{aspect-ratio:1.15;background:#e9e5dc}.pic img{width:100%;height:100%;object-fit:cover}.body{padding:14px}.name{font-weight:800;margin-bottom:7px}.small{font-size:12px;color:#777}
@media(max-width:800px){.grid{grid-template-columns:repeat(2,minmax(0,1fr));gap:10px}.card{border-radius:14px}.body{padding:10px}.name{font-size:12px}.small{font-size:9px}}
</style></head><body><div class="wrap">
<img src="logo/logo.png" alt="MIRBUD" style="width:70px;height:70px;object-fit:contain" onerror="this.style.display='none'">
<h1>MIRBUD</h1><div class="sub">Каталог будівельних матеріалів</div>
<a class="phone" href="tel:+380966080899">+380 96 608 08 99 · Консультація та замовлення</a>
<div class="grid">
<?php foreach($files as $file): $name=pathinfo($file,PATHINFO_FILENAME); ?>
<article class="card"><div class="pic"><img loading="lazy" src="<?=e($webDir.$file)?>" alt="<?=e($name)?>"></div>
<div class="body"><div class="name"><?=e($name)?></div><div class="small">Ціну та наявність уточнюйте за телефоном.</div></div></article>
<?php endforeach; ?>
</div></div></body></html>
