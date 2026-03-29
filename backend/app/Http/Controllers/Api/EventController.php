<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Event;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class EventController extends Controller
{
    public function index(): JsonResponse
    {
        $events = Event::with(['lieu', 'tournois'])->orderBy('date_debut')->get();

        return response()->json($events);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'lieu_id'     => 'required|exists:lieux,id',
            'nom'         => 'required|string|max:150',
            'slug'        => 'required|string|max:150|unique:events',
            'description' => 'nullable|string',
            'date_debut'  => 'required|date',
            'date_fin'    => 'required|date|after_or_equal:date_debut',
            'statut'      => 'in:a_venir,inscriptions_ouvertes,en_cours,termine,annule',
            'gradient'    => 'nullable|string|max:255',
            'image'       => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:2048',
        ]);

        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('events', 'public');
            $validated['image_url'] = '/storage/' . $path;
        }

        $event = Event::create($validated);

        return response()->json($event->load('lieu'), 201);
    }

    public function show(string $slug): JsonResponse
    {
        $event = Event::with(['lieu', 'tournois.jeu.regles', 'actualites'])
                      ->where('slug', $slug)
                      ->firstOrFail();

        return response()->json($event);
    }

    public function update(Request $request, Event $event): JsonResponse
    {
        $validated = $request->validate([
            'lieu_id'     => 'exists:lieux,id',
            'nom'         => 'string|max:150',
            'slug'        => 'string|max:150|unique:events,slug,' . $event->id,
            'description' => 'nullable|string',
            'date_debut'  => 'date',
            'date_fin'    => 'date|after_or_equal:date_debut',
            'statut'      => 'in:a_venir,inscriptions_ouvertes,en_cours,termine,annule',
            'gradient'    => 'nullable|string|max:255',
            'image'       => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:2048',
        ]);

        if ($request->hasFile('image')) {
            // Supprimer l'ancienne image
            if ($event->image_url && Storage::disk('public')->exists(str_replace('/storage/', '', $event->image_url))) {
                Storage::disk('public')->delete(str_replace('/storage/', '', $event->image_url));
            }
            $path = $request->file('image')->store('events', 'public');
            $validated['image_url'] = '/storage/' . $path;
        }

        $event->update($validated);

        return response()->json($event->load('lieu'));
    }

    public function destroy(Event $event): JsonResponse
    {
        if ($event->image_url && Storage::disk('public')->exists(str_replace('/storage/', '', $event->image_url))) {
            Storage::disk('public')->delete(str_replace('/storage/', '', $event->image_url));
        }
        $event->delete();

        return response()->json(null, 204);
    }
}
