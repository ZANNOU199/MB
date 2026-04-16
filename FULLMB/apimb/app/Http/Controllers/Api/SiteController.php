<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\SiteSetting;
use Illuminate\Http\Request;

class SiteController extends Controller
{
    public function show()
    {
        $settings = SiteSetting::latest()->first();
        return response()->json($settings ? $settings->data : [
            'theme' => null,
            'seo' => null,
            'images' => null,
        ]);
    }

    public function update(Request $request)
    {
        $payload = $request->validate([
            'theme' => 'required|array',
            'seo' => 'required|array',
            'images' => 'required|array',
        ]);

        $settings = SiteSetting::create([
            'data' => $payload,
        ]);

        return response()->json($settings->data, 200);
    }
}
