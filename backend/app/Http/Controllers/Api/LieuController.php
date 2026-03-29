<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Lieu;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class LieuController extends Controller
{
    public function index(): JsonResponse
    {
        return response()->json(Lieu::all());
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'nom'         => 'required|string|max:100',
            'adresse'     => 'nullable|string|max:255',
            'ville'       => 'required|string|max:100',
            'code_postal' => 'nullable|string|max:10',
            'pays'        => 'string|max:50',
        ]);

        $lieu = Lieu::create($validated);

        return response()->json($lieu, 201);
    }

    public function show(Lieu $lieu): JsonResponse
    {
        return response()->json($lieu->load('events'));
    }

    public function update(Request $request, Lieu $lieu): JsonResponse
    {
        $validated = $request->validate([
            'nom'         => 'string|max:100',
            'adresse'     => 'nullable|string|max:255',
            'ville'       => 'string|max:100',
            'code_postal' => 'nullable|string|max:10',
            'pays'        => 'string|max:50',
        ]);

        $lieu->update($validated);

        return response()->json($lieu);
    }

    public function destroy(Lieu $lieu): JsonResponse
    {
        $lieu->delete();

        return response()->json(null, 204);
    }
}
