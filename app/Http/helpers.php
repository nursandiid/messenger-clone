<?php

use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

if (!function_exists('upload_file')) {
    /**
     *
     * @param \Illuminate\Http\UploadedFile $file
     * @param string $directory
     * @return string
     */
    function upload_file($file, $directory)
    {
        $extension = $file->getClientOriginalExtension();
        $fileName = Str::uuid() . '.' . $extension;

        Storage::disk('public')->putFileAs($directory, $file, $fileName);

        return "/storage/$directory/$fileName";
    }
}

if (!function_exists('remove_file')) {
    /**
     *
     * @param string $filePath
     * @return boolean
     */
    function remove_file($filePath)
    {
        if ($filePath && Storage::disk('public')->exists($filePath)) {
            return Storage::disk('public')->delete($filePath);
        }

        return false;
    }
}

if (!function_exists('markdown_template')) {
    /**
     *
     * @param string $text
     * @return string
     */
    function markdown_template($text)
    {
        $text = preg_replace("/\n/", "<br>", $text);
        $text = preg_replace("/\*(.*?)\*/", "<b>$1</b>", $text);
        $text = preg_replace("/__(.*?)__/", "<em>$1</em>", $text);
        $text = preg_replace("/~(.*?)~/", "<del>$1</del>", $text);

        return $text;
    }
}