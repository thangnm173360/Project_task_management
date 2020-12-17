<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Validator;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Auth;
use App\Lists;
use App\Checklist;
use App\Task;

class ChecklistController extends Controller {
    public function index($id, $list_id, $task_id) {        
        $checklists = DB::select( DB::raw("SELECT id, task_id, list_checklist, name FROM checklists WHERE task_id = '$task_id'") );
        return response()->json($checklists); 
    }

    public function saveCheckList(Request $request, $id, $list_id, $task_id) {
        $checklist_id = DB::table('checklists')->insertGetId(
            ['name' => $request->name, 'task_id' => $task_id]);
        return response()->json(["id"=>$checklist_id, "name"=>$request->name]);

    }

    public function findOne($id, $list_id, $task_id, $checklist_id) {
        $checklist = Checklist::find($checklist_id);
        return response()->json($checklist); 
    }

    public function updateCheckList(Request $request, $id, $list_id, $task_id, $checklist_id) {
        $checklist = Checklist::find($checklist_id);
        if (isset($request->name)){
            $checklist->name = $request->name;                                                                                                                                                                              
        }
        if (isset($request->list_checklist)) {
            $checklist->list_checklist = json_encode($request->list_checklist);
        }
        $result = $checklist->save();
        if ($result) {
            return response()->json(['status' =>$request]);
        } else {
            return response()->json(['status' => 'fail', 'message' => 'check list updated failure']);
        } 
    }

    public function deleteCheckList($id, $list_id, $task_id, $checklist_id) {
        $checklist = CheckList::find($checklist_id);
        $result = $checklist->delete();
        if ($result) {
            return response()->json(['status' => 'success', 'message' => 'check list deleted successfully']);
        } else {
            return response()->json(['status' => 'fail', 'message' => 'check list deleted failure']);
        }
    }
}
