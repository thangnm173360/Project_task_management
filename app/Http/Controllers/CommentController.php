<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Validator;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Auth;
use App\Lists;
use App\Comment;
use App\Task;

class CommentController extends Controller {
    public function index($id, $list_id, $task_id) {        
        $comments = DB::select( DB::raw("SELECT * FROM comments WHERE task_id = '$task_id'") );
        return response()->json($comments); 
    }

    public function saveComment(Request $request, $id, $list_id, $task_id) {
        $id = DB::table('comments')->insertGetId(
            ['content' => $request->content,'task_id'=> $task_id]);
        return response()->json(["id"=>$id, "content"=>$request->content]);
    }

    public function findOne($id, $list_id, $task_id, $comment_id) {
        $comment = Comment::find($comment_id);
        return response()->json($comment); 
    }

    public function updateComment(Request $request, $id, $list_id, $task_id, $comment_id) {
        $comment = Comment::find($comment_id);
        $comment->content = $request->content;
        $result = $comment->save();
        if ($result) {
            return response()->json(['status' => 'success', 'message' => 'comment updated successfully']);
        } else {
            return response()->json(['status' => 'fail', 'message' => 'comment updated failure']);
        } 
    }

    public function deleteComment($id, $list_id, $task_id, $comment_id) {
        $comment = Comment::find($comment_id);
        $result = $comment->delete();
        if ($result) {
            return response()->json(['status' => 'success', 'message' => 'comment deleted successfully']);
        } else {
            return response()->json(['status' => 'fail', 'message' => 'comment deleted failure']);
        }
    }
}
