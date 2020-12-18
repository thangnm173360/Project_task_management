<!DOCTYPE html>
<html lang="en">

<head>
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<meta name="csrf-token" content="{{ csrf_token() }}">

	<title>Home</title>
	<link href="{{ asset('assets/css/general.css') }}" rel="stylesheet">
	<link href="{{ asset('assets/css/home.css') }}" rel="stylesheet">
	<link href="{{ asset('assets/fontawesome/css/all.css') }}" rel="stylesheet">
	<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css">
</head>

<body>
	<div id="root" class="root">
		<div class="nav">
			<div class="logo">
				<i class="fas fa-jedi"></i>
				<span>Nhóm 12</span>
			</div>
		</div>
		<div class="main-content">
			<div class="sidebar">
				<div class="user-section">
					<div id="avatar" class="avatar">
						<span>{{ str_split(Auth::user()->name)[0] }}</span>
						<div id="camera" class="camera">
							<i class="fas fa-camera"></i>
						</div>
					</div>
					<div style="width: 80%;height: 2px; background-color: dimgray;margin: 20px 0;">
					</div>
					<div class="btn">
						<i class="fab fa-trello"></i>
						<span>Boards</span>
					</div>
					<div class="btn">
						<i class="glyphicon glyphicon-user"></i>
						<a href="/profile">Profile</a>
					</div>
					<div class="btn">
						<i class="fas fa-door-open"></i>
						<a id="logout" href="{{ route('logout') }}" style="text-decoration: none;" onclick="event.preventDefault();
										document.getElementById('logout-form').submit();">
							Logout
						</a>
						<form id="logout-form" action="{{ route('logout') }}" method="POST" style="display: none;">
							{{ csrf_field() }}
						</form>
					</div>
				</div>
			</div>
			<div class="container">
				<div class="board-section">
					<div class="board-title">
						<span><i class="fas fa-user"></i></span>
						<span>Personal boards</span>
					</div>

					<div id="board-wrapper" class="board-wrapper">
						<div id="new-board" class="board new-board">
							<i class="fas fa-plus"></i>
							<span>Create new board</span>
						</div>
					</div>

				</div>
			</div>
		</div>

		<div id="popup" class="popup hide">
			<div class="new-board-box">
				<input type="text" name="" id="input-name-board" placeholder="Add board title" autocomplete="off" spellcheck="false">
				<div class="popup-control">
					<button id="save-board" class="change-btn" type="button">Save</button>
					<button id="cancel-board" class="unchange-btn" type="button"><i class="fas fa-times"></i></button>
				</div>
			</div>
		</div>

		<div id="popup-action" class="popup-action hide" data-id-board="">
			<div class="popup-title">
				<span>List actions</span>
			</div>
			<div class="popup-horizontal">
			</div>
			<div id="change-title-btn" class="popup-btn">Change title</div>
			<div id="delete-board-btn" class="popup-btn delete"><span>Delete board</span></div>
		</div>

		<div id="color-picker" class="color-picker hide">
			<div class="popup-close">
				<span>X</span>
			</div>
			<div class="popup-title">
				<span>Pick a color</span>
			</div>
			<div class="popup-horizontal">
			</div>
			<div class="color-palette">
			</div>
		</div>

		<!-- Popup hiển thị thông diệp trả về -->
		<div id="popup-message" class="popup popup-message hide">
			<span></span>
		</div>
	</div>

	<script src="{{ asset('assets/js/jquery-3.5.1.js') }}"></script>
	<script src="{{ asset('assets/js/ultilities.js') }}"></script>
	<script src="{{ asset('assets/js/home.js') }}"></script>
	<script type="text/javascript">
		handleAPI("/boards/", {}, "GET", "board");
		createColorPalatte();
	</script>
</body>

</html>