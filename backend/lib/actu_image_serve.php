<?php

declare(strict_types=1);

function chmc_serve_actu_image(string $filename, int $maxW = 0): void
{
    $f = basename($filename);
    if ($f === '' || !preg_match('/^actu_[a-zA-Z0-9_-]+\.(jpe?g|png|webp|gif)$/i', $f)) {
        http_response_code(404);
        header('Content-Type: text/plain; charset=utf-8');
        echo 'Image invalide';
        exit;
    }

    $uploadDir = realpath(__DIR__ . '/../uploads');
    $path = $uploadDir ? $uploadDir . DIRECTORY_SEPARATOR . $f : '';

    if ($path === '' || !is_file($path)) {
        http_response_code(404);
        header('Content-Type: text/plain; charset=utf-8');
        echo 'Image introuvable sur le serveur';
        exit;
    }

    $maxW = min(1600, max(0, $maxW));
    if ($maxW > 0 && extension_loaded('gd')) {
        $cached = chmc_actu_cached_resize($uploadDir, $path, $f, $maxW);
        if ($cached !== null) {
            chmc_actu_send_file($cached, 'image/webp');
            exit;
        }
    }

    $finfo = new finfo(FILEINFO_MIME_TYPE);
    $mime = $finfo->file($path) ?: 'application/octet-stream';
    $allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!in_array($mime, $allowed, true)) {
        http_response_code(403);
        exit;
    }

    chmc_actu_send_file($path, $mime);
    exit;
}

function chmc_actu_cached_resize(string $uploadDir, string $sourcePath, string $filename, int $maxW): ?string
{
    $cacheDir = $uploadDir . DIRECTORY_SEPARATOR . '.cache';
    if (!is_dir($cacheDir) && !mkdir($cacheDir, 0755, true)) {
        return null;
    }

    $base = preg_replace('/\.[^.]+$/', '', $filename);
    $cachePath = $cacheDir . DIRECTORY_SEPARATOR . $base . '_w' . $maxW . '.webp';

    if (is_file($cachePath) && filemtime($cachePath) >= filemtime($sourcePath)) {
        return $cachePath;
    }

    $src = chmc_actu_load_image($sourcePath);
    if ($src === null) {
        return null;
    }

    $w = imagesx($src);
    $h = imagesy($src);
    if ($w <= 0 || $h <= 0) {
        imagedestroy($src);
        return null;
    }

    if ($w <= $maxW) {
        $nw = $w;
        $nh = $h;
    } else {
        $nw = $maxW;
        $nh = (int) round($h * ($maxW / $w));
    }

    $dst = imagecreatetruecolor($nw, $nh);
    if ($dst === false) {
        imagedestroy($src);
        return null;
    }

    imagealphablending($dst, false);
    imagesavealpha($dst, true);
    $transparent = imagecolorallocatealpha($dst, 0, 0, 0, 127);
    imagefilledrectangle($dst, 0, 0, $nw, $nh, $transparent);
    imagecopyresampled($dst, $src, 0, 0, 0, 0, $nw, $nh, $w, $h);
    imagedestroy($src);

    if (!imagewebp($dst, $cachePath, 82)) {
        imagedestroy($dst);
        return null;
    }
    imagedestroy($dst);

    return is_file($cachePath) ? $cachePath : null;
}

/** @return GdImage|null */
function chmc_actu_load_image(string $path): ?\GdImage
{
    $info = @getimagesize($path);
    if ($info === false) {
        return null;
    }

    return match ($info[2]) {
        IMAGETYPE_JPEG => @imagecreatefromjpeg($path) ?: null,
        IMAGETYPE_PNG  => @imagecreatefrompng($path) ?: null,
        IMAGETYPE_WEBP => @imagecreatefromwebp($path) ?: null,
        IMAGETYPE_GIF  => @imagecreatefromgif($path) ?: null,
        default        => null,
    };
}

function chmc_actu_send_file(string $path, string $mime): void
{
    header('Content-Type: ' . $mime);
    header('Cache-Control: public, max-age=604800, immutable');
    header('Content-Length: ' . (string) filesize($path));
    readfile($path);
}
