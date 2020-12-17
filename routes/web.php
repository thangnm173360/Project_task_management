<?php

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

/*Auth::routes();
Route::get('/', 'HomeController@index')->name('dashboard');
Auth::routes();*/

Route::get('/', 'HomeController@index')->name('dashboard');


Auth::routes();
Route::get('/board/{id}', 'GeneralController@main');
Route::get('/home', 'GeneralController@home');

Route::get('/profile', 'UserController@profile');
Route::post('/profile', 'UserController@update_avatar');

Route::group(['prefix' => 'boards'], function() {
  Route::get('/', 'BoardController@index');
  Route::post('/','BoardController@saveBoard');

//  Route::get('/{id}','BoardController@findOne');
  Route::put('/{id}','BoardController@updateBoard');
  Route::delete('/{id}','BoardController@deleteBoard');

	Route::group(['prefix' => '/{board_id}/lists'], function() {
    Route::get('/','ListsController@index');
    Route::post('/','ListsController@saveList');

    Route::get('/{list_id}','ListsController@findOne');
    Route::put('/{list_id}','ListsController@updateList');
    Route::delete('/{list_id}','ListsController@deleteList');

    Route::group(['prefix' => '/{list_id}/cards'], function() {
      Route::get('/','TaskController@index');
      Route::post('/','TaskController@saveCard');
  
      Route::get('/{task_id}','TaskController@findOne');
      Route::put('/{task_id}','TaskController@updateCard');
      Route::delete('/{task_id}','TaskController@deleteCard');
      Route::group(['prefix' => '/{task_id}/attachments'], function() {
        Route::get('/','AttachmentController@index');
        Route::post('/','AttachmentController@saveAttachment');

        Route::get('/{attachment_id}','AttachmentController@findOne');
        Route::put('/{attachment_id}','AttachmentController@updateAttachment');
        Route::delete('/{attachment_id}','AttachmentController@deleteAttachment');
      });
      Route::group(['prefix' => '/{task_id}/checklists'], function() {
        Route::get('/','CheckListController@index');
        Route::post('/','CheckListController@saveCheckList');
    
        Route::get('/{checklist_id}','CheckListController@findOne');
        Route::put('/{checklist_id}','CheckListController@updateCheckList');
        Route::delete('/{checklist_id}','CheckListController@deleteCheckList');
      });

      Route::group(['prefix' => '/{task_id}/comments'], function() {
        Route::get('/','CommentController@index');
        Route::post('/','CommentController@saveComment');
    
        Route::get('/{comment_id}','CommentController@findOne');
        Route::put('/{comment_id}','CommentController@updateComment');
        Route::delete('/{comment_id}','CommentController@deleteComment');
      });

    });

  });
});
Auth::routes();