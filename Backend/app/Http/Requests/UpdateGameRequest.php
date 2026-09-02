<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateGameRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'title' => ['sometimes', 'required', 'string', 'max:255'],
            'genre' => ['sometimes', 'required', 'string', 'max:100'],
            'platform' => ['sometimes', 'required', 'string', 'max:100'],
            'developer' => ['nullable', 'string', 'max:255'],
            'release_year' => ['nullable', 'integer', 'between:1950,2100'],
            'rating' => ['nullable', 'numeric', 'between:0,5'],
            'status' => ['nullable', 'string', 'in:wishlist,playing,completed,backlog'],
            'cover_url' => ['nullable', 'url', 'max:500'],
            'description' => ['nullable', 'string', 'max:2000'],
        ];
    }
}