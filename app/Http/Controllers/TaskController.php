<?php

namespace App\Http\Controllers;
use Illuminate\Support\Facades\Validator;
use Illuminate\Http\Request;
use Auth;
use Illuminate\Support\Facades\DB;
use App\Task;
use App\Lists;

class TaskController extends Controller {
    public function index($id, $list_id) {
        $card = DB::select( DB::raw("SELECT * FROM tasks WHERE lists_id = '$list_id'") );
        return response()->json($card);
    }

    public function saveCard(Request $request, $id, $list_id) {
        $card_id = DB::table('tasks')->insertGetId(
            ['title' => $request->title, "lists_id" => $list_id]);
        return response()->json(["id" => $card_id, "title" => $request->title, "list_id" => $list_id]);
    }

    public function findOne($id, $list_id, $task_id) {
        $card = Task::find($task_id);
        $card->members = DB::select( DB::raw("SELECT name FROM users WHERE id = '$card->user_id'") );
        $card->check_lists = DB::select( DB::raw("SELECT id, list_checklist, name FROM checklists WHERE task_id = '$card->id'") );
        $card->comments = DB::select( DB::raw("SELECT * FROM comments WHERE task_id = '$card->id'") );
        $card->attachment = DB::select( DB::raw("SELECT id, content FROM attachments WHERE card_id = '$card->id'") );
        return response()->json($card);
    }

    public function updateCard(Request $request, $id, $list_id, $task_id) {
        $card = Task::find($task_id);
        if (isset($request->title)){
            $card->title = $request->title;
        }
        $card->description = $request->description;
        if (isset($request->status)){
            $card->status = $request->status;
        }
        if (isset($request->attachment)){
            $card->status = $request->attachment;
        }

        if (isset($request->dead_line)){
            $card->dead_line = $request->dead_line;
        }

        $result = $card->save();
        if ($result) {
            return response()->json(['status' => $request->status, 'message' => 'card updated successfully', 'id'=>8]);
        } else {
            return response()->json(['status' => 'fail', 'message' => 'card updated failure']);
        }
    }

    public function deleteCard($id, $list_id, $task_id) {
        $card = Task::find($task_id);
        $result = $card->delete();
        if ($result) {
            return response()->json(['status' => 'success', 'message' => 'card deleted successfully']);
        } else {
            return response()->json(['status' => 'fail', 'message' => 'card deleted failure']);
        }
    }
}