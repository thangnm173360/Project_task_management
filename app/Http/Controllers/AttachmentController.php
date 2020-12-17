<?php

namespace App\Http\Controllers;
use Illuminate\Support\Facades\Validator;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Auth;
use App\Attachment;

class AttachmentController extends Controller {
    public function index($id, $list_id, $card_id) {
        $attachment = DB::select( DB::raw("SELECT * FROM attachments WHERE card_id = '$card_id'") );
        return response()->json($attachment);
    }

    public function saveAttachment(Request $request,$id, $list_id, $card_id) {
        $id = DB::table('attachments')->insertGetId(
            ['content' => $request->content,'card_id'=>$card_id]);
        return response()->json(["id"=>$id, "content"=> $request->content]);
    }

    public function findOne($id, $list_id, $task_id, $attachment_id) {
        $attachment = Attachment::find($attachment_id);
        return response()->json($attachment);
    }

    public function updateAttachment(Request $request, $id, $list_id, $task_id, $attachment_id) {
        $attachment = Attachment::find($attachment_id);
        $attachment->content = $request->content;
        $result = $attachment->save();
        if ($result) {
            return response()->json(['status' => 'success', 'message' => 'list updated successfully']);
        } else {
            return response()->json(['status' => 'fail', 'message' => 'list updated failure']);
        }
    }

    public function deleteAttachment($id,$list_id, $task_id, $attachment_id) {
        $attachment = Attachment::find($attachment_id);
        $result = $attachment->delete();
        if ($result) {
            return response()->json(['status' => 'success', 'message' => 'list deleted successfully']);
        } else {
            return response()->json(['status' => 'fail', 'message' => 'list deleted failure']);
        }
    }
}