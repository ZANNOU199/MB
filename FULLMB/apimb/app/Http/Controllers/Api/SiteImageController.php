<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;

class SiteImageController extends Controller
{
    public function upload(Request $request): JsonResponse
    {
        $file = $request->file('image');

        if (!$file || !$file->isValid()) {
            $message = 'Aucun fichier valide reçu. Vérifiez upload_max_filesize et post_max_size dans la configuration PHP.';
            if ($file) {
                $message = $file->getErrorMessage();
            }

            return response()->json([
                'error' => 'Upload failed',
                'message' => $message,
            ], 422);
        }

        $validator = Validator::make($request->all(), [
            'image' => 'required|image|mimes:jpeg,png,jpg,gif,webp,bmp,tiff,ico|max:10240', // 10MB max, plus de formats
            'type' => 'required|string|in:heroHome,heroGallery,heroBlog,heroReviews,testimonials,logo,presentationImage'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'error' => 'Validation failed',
                'messages' => $validator->errors()
            ], 422);
        }

        try {
            $type = $request->input('type');

            // Generate unique filename
            $filename = $type . '_' . time() . '.' . $file->getClientOriginalExtension();

            // Store in R2
            $path = $file->storeAs('site-images', $filename, 'r2');
            $url = Storage::disk('r2')->url($path);

            return response()->json([
                'success' => true,
                'url' => $url,
                'path' => $path,
                'type' => $type
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Upload failed',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    public function delete(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'path' => 'required|string'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'error' => 'Validation failed',
                'messages' => $validator->errors()
            ], 422);
        }

        try {
            $path = $request->input('path');

            // Delete from R2
            $deleted = Storage::disk('r2')->delete($path);

            return response()->json([
                'success' => $deleted,
                'path' => $path
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Delete failed',
                'message' => $e->getMessage()
            ], 500);
        }
    }
}