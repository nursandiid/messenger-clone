<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class GroupRequest extends FormRequest
{
    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name' => 'required|min:4',
            'avatar' => 'nullable|mimes:png,jpg,jpeg|max:2048',
            'description' => 'nullable',
            'group_members' => 'required|array|min:2'
        ];
    }
}
