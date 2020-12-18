<?php

namespace App\Http\Controllers;
use Illuminate\Http\Request;
use Auth;
use File;

class UserController extends Controller {
    public function profile() {
        $user = Auth::user();
        return view('profile', compact('user', $user));
    }

    public function update_avatar(Request $request){
        $request->validate([
            'avatar' => 'required|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
        ]);

        $user = Auth::user();
        if ($user->avatar != null) {
            $avatarExist = $user->avatar;
            File::delete('uploads/'.$avatarExist);
        }

        $avatarName = $user->id.'_avatar'.time().'.'.request()->avatar->getClientOriginalExtension();
        $request->avatar->move("uploads", $avatarName);
        $user->avatar = $avatarName;
        $user->save();
        return back()
            ->with('success','You have successfully upload image.');
    }

}