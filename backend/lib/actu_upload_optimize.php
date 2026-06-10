<?php

declare(strict_types=1);

require_once __DIR__ . '/actu_image_serve.php';

/** Compresse une image uploadée (max 1600px, JPEG qualité 85). Retourne le nouveau nom de fichier. */
function chmc_optimize_actu_upload(string $filePath): string
{
    if (!extension_loaded('gd') || !is_file($filePath)) {
        return basename($filePath);
    }

    $src = chmc_actu_load_image($filePath);
    if ($src === null) {
        return basename($filePath);
    }

    $w = imagesx($src);
    $h = imagesy($src);
    $maxW = 1600;

    if ($w > $maxW) {
        $nw = $maxW;
        $nh = (int) round($h * ($maxW / $w));
        $dst = imagecreatetruecolor($nw, $nh);
        imagealphablending($dst, false);
        imagesavealpha($dst, true);
        $transparent = imagecolorallocatealpha($dst, 0, 0, 0, 127);
        imagefilledrectangle($dst, 0, 0, $nw, $nh, $transparent);
        imagecopyresampled($dst, $src, 0, 0, 0, 0, $nw, $nh, $w, $h);
        imagedestroy($src);
        $src = $dst;
        $w = $nw;
        $h = $nh;
    }

    $dir = dirname($filePath);
    $newName = 'actu_' . time() . '_' . bin2hex(random_bytes(4)) . '.jpg';
    $newPath = $dir . DIRECTORY_SEPARATOR . $newName;

    $flat = imagecreatetruecolor($w, $h);
    $white = imagecolorallocate($flat, 255, 255, 255);
    imagefilledrectangle($flat, 0, 0, $w, $h, $white);
    imagecopy($flat, $src, 0, 0, 0, 0, $w, $h);
    imagedestroy($src);

    if (!imagejpeg($flat, $newPath, 85)) {
        imagedestroy($flat);
        return basename($filePath);
    }
    imagedestroy($flat);

    if ($newPath !== $filePath) {
        @unlink($filePath);
    }

    return $newName;
}
