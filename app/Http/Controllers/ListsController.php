<?php

namespace App\Http\Controllers;
use Illuminate\Support\Facades\Validator;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Auth;
use App\Lists;
use App\Board;

class ListsController extends Controller {
    public function index($board_id) {
        $list = DB::select( DB::raw("SELECT id, title, board_id FROM lists WHERE board_id = '$board_id'") );
        for($i=0; $i<count($list); $i++){
            $list_id = $list[$i]->id;
            $list[$i]->card = DB::select( DB::raw("SELECT id, title, dead_line, status FROM tasks WHERE lists_id = '$list_id'") );
        }
//        $list[2]->cards = DB::select( DB::raw("SELECT * FROM tasks WHERE lists_id = '24'") );

        return response()->json($list);
    }

    public function saveList(Request $request, $board_id) {
        $id = DB::table('lists')->insertGetId(
            ['title' => $request->title,'board_id'=>$board_id]);
        return response()->json(["id"=>$id, "title"=>$request->title]);
    }

    public function findOne($id, $list_id) {
        $list = Lists::find($list_id);
        return response()->json($list);
    }

    public function updateList(Request $request, $id, $list_id) {
        $list = Lists::find($list_id);
        $list->title = $request->title;
        $result = $list->save();
        if ($result) {
            return response()->json(['status' => 'success', 'message' => 'list updated successfully']);
        } else {
            return response()->json(['status' => 'fail', 'message' => 'list updated failure']);
        }
    }

    public function deleteList($id, $list_id) {
        $list = Lists::find($list_id);
        $result = $list->delete();
        if ($result) {
            return response()->json(['status' => 'success', 'message' => 'list deleted successfully']);
        } else {
            return response()->json(['status' => 'fail', 'message' => 'list deleted failure']);
        }
    }
}