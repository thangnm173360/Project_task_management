<!DOCTYPE html>
<html lang="{{ app()->getLocale() }}">

<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>Board</title>

    <!-- Styles -->
    <link href="{{ asset('assets/css/general.css') }}" rel="stylesheet">
    <link href="{{ asset('assets/css/board.css') }}" rel="stylesheet">
    <link href="{{ asset('assets/css/list.css') }}" rel="stylesheet">
    <link href="{{ asset('assets/css/card.css') }}" rel="stylesheet">
    <link href="{{ asset('assets/fontawesome/css/all.min.css') }}" rel="stylesheet">
    <link rel="stylesheet" href="{{ asset('assets/css/jquery.datetimepicker.min.css') }}">

</head>

<body>
    <div id="root" class="root">

        <!-- Hiển thị các danh sách thẻ việc làm -->
        <div class="board-container">
            <div class="nav">
                <a href="/home" class="nav-board nav-btn" style="width: fit-content;">
                    <i class="fab fa-trello"></i>
                    <span style="margin-left: 10px">Home</span>
                </a>
                <div class="nav-search">
                    <input type="text" name="" id="">
                    <i class="fas fa-search"></i>
                </div>
                <div class="nav-icon nav-btn">
                    <i class="fas fa-jedi"></i>
                    <span style="margin-left: 10px">Nhóm 12</span>
                </div>

                <div class="member-badge mod-round center">
                    <span>{{ str_split(Auth::user()->name)[0] }}</span>
                </div>
            </div>
            <div id="board" class="board">
                <div class="board-header">

                    <div class="board-name">
                        <div id="board-label" class="board-label">
                            <span id="board_title">{{ $board->title }}</span>
                        </div>
                        <textarea id="board-name-edit" class="board-name-edit" name="" id="" cols="30" rows="10" spellcheck="false"></textarea>
                    </div>

                    <div id="board-header-fav " class="board-header-fav">
                        <i class="far fa-star"></i>
                    </div>
                </div>

                <div id="board-content" class="board-content">
                    <div id="add-list" class="add-list">
                        <div id="open-list-box" class="open-list-box">
                            <span style="line-height: 40px;"><i class="fas fa-plus"></i></span><span style="line-height: 40px;margin-left: 10px;font-size: 18px;">Add another list</span>
                        </div>

                        <div id="list-add-controls" class="list-add-controls hide">
                            <input type="text" id="list-name-input" class="list-name-input" placeholder="Enter list title..." autocomplete="off">
                            <div style="display: flex;margin-top: 8px;">
                                <div id="list-add-btn" class="list-add-btn center">
                                    Add list
                                </div>
                                <a id="list-close-btn" class="btn list-close-btn" href="#"><i class="fas fa-times"></i></a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Hiển thị thông tin chi tiết của 1 thẻ -->
        <div class="window-overlay hide" id="window-overlay">
            <div id="card-info" class="card-info">
                <div class="card-close-btn center">
                    <i class="fas fa-times"></i>
                </div>
                <div class="window-card-detail">
                    <div class="window-header">
                        <div id="card-header-label" class="card-header-label">
                            <span></span>
                        </div>
                        <textarea id="card-header-edit" class="card-header-edit hide" spellcheck="false" autocomplete="off">
                        </textarea>
                    </div>
                    <div id="window-main-col" class="window-main-content">
                        <div class="window-main-col">

                            <!-- Hiển thị deadline -->
                            <div id="card-detail" class="window-module card-detail">
                                <div id="date-section" class="card-detail-item hide">
                                    <span class="card-detail-item-header">Deadline</span>
                                    <div class="card-detail-due-date">
                                        <div id="date-checkbox" class="card-date-checkbox">
                                            <i class="fas fa-check"></i>
                                        </div>
                                        <div id="card-date-button" class="card-date-button">
                                            <span id="date-text" class="date-text"></span>
                                            <span id="date-status" class="date-status"></span>
                                            <i class="fas fa-angle-down"></i>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- Mô tả -->
                            <div id="card-desc" class="window-module">
                                <div class="window-module-header">
                                    <span style="width: 32px;height: 32px;"><i class="fa fa-bars"></i></span>
                                    <span>Description</span>
                                    <div id="clear-desc-btn" class="normal-btn" style="width: 90px; margin-left: 10px;">
                                        Reset
                                    </div>
                                </div>

                                <div class="window-module-content" style="padding-left: 40px;">
                                    <div id="desc-empty" class="empty-desc">
                                        <span>Add more description</span>
                                    </div>
                                    <div id="desc-label" class="desc-label hide">
                                        <p></p>
                                    </div>
                                    <div id="desc-edit-section" class="desc-edit hide" style="height: auto;">
                                        <textarea id="desc-edit-textarea" style="width: 100%;line-height: 20px;font-size: 14px;" rows="3" spellcheck="false" placeholder="Add a more detailed description..."></textarea>
                                        <div style="height: 32px;display: flex;">
                                            <div id="desc-save-btn" class="change-btn" style="width: 50px;">
                                                Save
                                            </div>
                                            <div id="desc-cancel-btn" class="unchange-btn">
                                                <i class="fas fa-times"></i>
                                            </div>
                                        </div>
                                    </div>

                                </div>
                            </div>

                            <!-- Linh đính kèm -->
                            <div id="attachment" class="window-module hide">
                                <div class="window-module-header">
                                    <span style="width: 32px;height: 32px;"><i class="fas fa-paperclip"></i></span>
                                    <span>List of attachment</span>
                                </div>

                                <div class="window-module-content" style="padding-left: 40px;">
                                    <div id="attachment-list" class="attachment-list" style="height: auto;">
                                    </div>
                                    <div style="height: auto;display: block;">
                                        <div id="open-new-attachment-btn" class="normal-btn" style="margin: 0;">
                                            Add attachment
                                        </div>
                                        <div id="new-attachment-section" class="hide">
                                            <div style="display: flex;flex-direction: column;margin-bottom: 10px;">
                                                <label>Link attachment</label>
                                                <input id="new-attachment-input" type="text" name="attachment-link" placeholder="Dán liên kết ở đây" style="width:70%">
                                            </div>
                                            <div style="height: 32px;display: flex;">
                                                <div id="attachment-save-btn" class="change-btn" style="width: 90px;">
                                                    Save
                                                </div>
                                                <div id="attachment-cancel-btn" class="unchange-btn">
                                                    <i class="fas fa-times"></i>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                </div>
                            </div>

                            <!-- Danh sách việc làm nhỏ -->
                            <div id="list-todo-list" class="list-todo-list">

                            </div>

                            <!-- Hiển thị các bình luận -->
                            <div id="action" class="window-module">
                                <div class="window-module-header">
                                    <span><i class="fa fa-comments"></i></span>
                                    <span>Action</span>
                                    <div id="hide-all-comment" class="normal-btn" style="width: fit-content; margin-left: 10px;">
                                        <span>Hide details</span>
                                    </div>
                                    <div id="show-all-comment" class="normal-btn hide" style="width: fit-content; margin-left: 10px;">
                                        <span>Show details</span>
                                    </div>
                                </div>
                                <div class="window-module-content" style="padding-left: 0px;">
                                    <div style="height: auto;display: flex;margin-bottom: 10px;">
                                        <div class="member-badge mod-round center">
                                            <span>{{ str_split(Auth::user()->name)[0] }}</span>
                                        </div>
                                        <div class="comment-box" style="margin-left: 5px;">
                                            <textarea id="comment-input" class="comment-input" rows="1" placeholder="Viết bình luận..."></textarea>
                                            <div class="hide" style="display: flex;margin: 8px; margin-top: 0px;">
                                                <div class="change-btn" style="width: 50px;">
                                                    <span>Lưu</span>
                                                </div>
                                                <div class="unchange-btn">
                                                    <i class="fas fa-times"></i>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div id="list-comment" class="list-comment">
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Thao tác chi tiết với thẻ -->
                        <div class="window-side-bar">
                            <div class="extend">
                                <span>ADD TO CARD</span>
                                <div id="add-member-btn" class="extend-btn hide">
                                    <span><i class="far fa-user"></i></span>
                                    <span>Add member</span>
                                </div>
                                <div id="add-todo-btn" class="extend-btn">
                                    <span><i class="far fa-check-square"></i></span>
                                    <span>Todo list</span>
                                </div>
                                <div id="add-due-date" class="extend-btn">
                                    <span><i class="far fa-clock"></i></span>
                                    <span">Deadline</span>
                                </div>
                                <div id="add-attachment-btn" class="extend-btn">
                                    <span><i class="fas fa-paperclip"></i></span>
                                    <span>Attachment</span>
                                </div>
                            </div>

                            <div class="extend">
                                <span>ACTION</span>
                                <div id="move-card-btn" class="extend-btn">
                                    <span><i class="fas fa-arrow-right"></i></span>
                                    <span style="margin-left: 5px;">Move</span>
                                </div>
                                <div id="copy-card-btn" class="extend-btn">
                                    <span><i class="far fa-copy"></i></span>
                                    <span style="margin-left: 5px;">Copy</span>
                                </div>
                                <div id="delete-card-btn" class="extend-btn">
                                    <span><i class="far fa-trash-alt"></i></span>
                                    <span style="margin-left: 5px;">Delete</span>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>

        <!-- Popup chọn ngày giờ-->
        <div id="datetimepicker" class="datetimepicker">

        </div>

        <!-- Popup thêm việc cần làm -->
        <div id="new-todo-list-box" class="new-todo-list-box hide">
            <div class="new-todo-list-label">
                <span>Add checklist</span>
            </div>
            <div class="popup-horizontal"></div>
            <input id="new-todo-list-box-input" type="text" class="new-todo-list-input" spellcheck="false" placeholder="Add title...">
            <div class="new-todo-list-control" style="display: flex;width: 100%">
                <div id="new-todo-list-box-add" class="change-btn" style="width: 50px;">
                    <span>Save</span>
                </div>
                <div id="new-todo-list-box-cancel" class="unchange-btn">
                    <i class="fas fa-times"></i>
                </div>
            </div>
        </div>

        <!-- Popup thêm việc các nút thao tác với danh sách (nhưng chưa làm kịp) -->
        <div id="list-control" class="popup list-control hide">
            <div class="popup-icon popup-close">
                <i class="fas fa-minus"></i>
            </div>
            <div class="popup-title">
                <span>List Actions</span>
            </div>
            <div class="popup-horizontal">
            </div>
            <div id="list-sort" class="popup-btn">Sort by ...</div>

            <div class="popup-horizontal">
            </div>

            <div id="move-list" class="popup-btn">Move list</div>
            <div id="copy-list" class="popup-btn">Copy list</div>
            <div id="delete-list" class="popup-btn delete">Delete list</div>
        </div>

        <!-- Các thẻ trong danh sách -->
        <div id="list-sort-option" class="popup popup-sort hide">
            <div class="popup-icon popup-back">
                <i class="fas fa-chevron-left"></i>
            </div>
            <div class="popup-icon popup-close">
                <i class="fas fa-minus"></i>
            </div>
            <div class="popup-title">
                <span>Sort list</span>
            </div>
            <div class="popup-horizontal">
            </div>
            <div id="sort-deadline-up" class="popup-btn"><span>Sort by deadline (Newest first)</span></div>
            <div id="sort-deadline-down" class="popup-btn"><span>Sort by deadline (Older first)</span></div>
            <div id="sort-name" class="popup-btn"><span>Sort by name (Alphabetically)</span></div>
        </div>

        <!-- Popup hiển thị thông diệp trả về -->
        <div id="popup-message" class="popup popup-message hide">
            <span></span>
        </div>
    </div>

    <!-- Scripts -->
    <script src="{{ asset('assets/js/jquery-3.5.1.js') }}"></script>
    <script src="{{ asset('assets/js/jquery.datetimepicker.full.min.js') }}"></script>
    <script src="{{ asset('assets/js/ultilities.js') }}"></script>
    <script src="{{ asset('assets/js/card.js') }}"></script>
    <script src="{{ asset('assets/js/list.js') }}"></script>
    <script src="{{ asset('assets/js/board.js') }}"></script>
    <script type="text/javascript">
        handleAPI("/boards/" + document.URL.split("/")[4] + "/lists", {}, "GET", "list");
        let classNameRoot = "bg" + (document.URL.split("/")[4] % 10);
        document.getElementById('root').classList.add(classNameRoot);
    </script>
</body>

</html>