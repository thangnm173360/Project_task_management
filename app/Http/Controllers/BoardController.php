<?php

namespace App\Http\Controllers;
use Illuminate\Support\Facades\Validator;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Auth;
use App\Board;

class BoardController extends Controller {
    public function index() {
        $user = Auth::user();
        $user_id = $user->id;
        $board = DB::select( DB::raw("SELECT id, title FROM boards WHERE user_id = '$user_id'") );
        return response()->json($board);
    }

    public function saveBoard(Request $request) {
        $id = DB::table('boards')->insertGetId(
            ['title' => $request->title, 'user_id' => Auth::user()->id]);
        return response()->json(["id"=>$id, "title"=>$request->title]);
    }

    public function findOne($id) {
        $board = DB::select( DB::raw("SELECT id, title FROM boards WHERE id = '$id'") );
//        $board = Board::find($id);
        return response()->json($board);
    }

    public function updateBoard(Request $request, $id) {
        //$board = DB::select( DB::raw("SELECT * FROM boards WHERE id = '$id'") );
        $board = Board::find($id);
        $board->title = $request->title;
        $result = $board->save();
        if ($result) {
            return response()->json(['status' => 'success', 'message' => 'board updated successfully']);
        } else {
            return response()->json(['status' => 'fail', 'message' => 'board updated failure']);
        }
    }

    public function deleteBoard($id) {
        //$board = DB::select( DB::raw("SELECT * FROM boards WHERE id = '$id'") );
        $board = Board::find($id);
        $result = $board->delete();
        if ($result) {
            return response()->json(['status' => 'success', 'message' => 'board deleted successfully']);
        } else {
            return response()->json(['status' => 'fail', 'message' => 'board deleted failure']);
        }
    }
}