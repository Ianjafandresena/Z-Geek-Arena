<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Jeu;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class JeuController extends Controller
{
    public function index(): JsonResponse
    {
        return response()->json(Jeu::with('regles')->get());
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'nom'        => 'required|string|max:100',
            'slug'       => 'required|string|max:100|unique:jeux',
            'plateforme' => 'nullable|string|max:50',
            'image'      => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:2048',
        ]);

        // Upload image
        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('jeux', 'public');
            $validated['image_url'] = '/storage/' . $path;
        }

        unset($validated['image']);
        $jeu = Jeu::create($validated);

        return response()->json($jeu, 201);
    }

    public function show(Jeu $jeu): JsonResponse
    {
        return response()->json($jeu->load(['regles', 'tournois.event']));
    }

    public function update(Request $request, Jeu $jeu): JsonResponse
    {
        $validated = $request->validate([
            'nom'        => 'string|max:100',
            'slug'       => 'string|max:100|unique:jeux,slug,' . $jeu->id,
            'plateforme' => 'nullable|string|max:50',
            'image'      => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:2048',
        ]);

        // Upload nouvelle image
        if ($request->hasFile('image')) {
            // Supprimer l'ancienne
            if ($jeu->image_url) {
                $oldPath = str_replace('/storage/', '', $jeu->image_url);
                Storage::disk('public')->delete($oldPath);
            }
            $path = $request->file('image')->store('jeux', 'public');
            $validated['image_url'] = '/storage/' . $path;
        }

        unset($validated['image']);
        $jeu->update($validated);

        return response()->json($jeu->load('regles'));
    }

    public function destroy(Jeu $jeu): JsonResponse
    {
        // Supprimer l'image associée
        if ($jeu->image_url) {
            $path = str_replace('/storage/', '', $jeu->image_url);
            Storage::disk('public')->delete($path);
        }

        $jeu->delete();

        return response()->json(null, 204);
    }
}
