<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Profile</title>
    <!-- Bootstrap CSS -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/4.0.0/css/bootstrap.min.css" />
    <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.7.0/css/all.css">
    <link href="{{ asset('auth/main.css') }}" rel="stylesheet">
    <script src="{{ asset('assets/js/jquery-3.5.1.js') }}"></script>
</head>
<body>   
<div class="container">
    @if ($message = Session::get('success'))
        <div class="alert alert-success">
            <button type="button" class="close" data-dismiss="alert">×</button>
            <strong>{{ $message }}</strong>
        </div>
    @endif

    @if (count($errors) > 0)
        <div class="alert alert-danger">
            <strong>Whoops!</strong> There were some problems with your input.<br>
            <ul>
                @foreach ($errors->all() as $error)
                    <li>{{ $error }}</li>
                @endforeach
            </ul>
        </div>
    @endif
</div>
<div class="card user-card-full">
    <div class="row m-l-0 m-r-0 container1">
        <div class="col-sm-4 bg-c-lite-green user-profile">
            <div class="card-block text-center text-white">
                <div class="m-b-20"> <img src="uploads/{{ $user->avatar }}" class="img-radius" alt="Choose a picture"> </div>
                <h5 class="f-w-600 m-b-20">{{ $user->name }}</h5>

                <form action="/profile" method="POST" enctype="multipart/form-data">
                    <label for="upload-photo"><i class="fas fa-upload"></i></label>
                    <input type="file" name="avatar" id="upload-photo"/>
                    <button id="change-profile" type="submit" class="btn btn-outline-light btn-sm" disabled=''>Change</button>
                </form>
            </div>
            <div class="card-block text-center">
                <a href="/home">
                    <i class="fas fa-arrow-circle-left text-white" style='font-size:24px;'>  Home</i>
                </a>
            </div>
        </div>
        <div class="col-sm-8">
            <div class="card-block">
                <br>
                <h5 class="m-b-20 p-b-5 b-b-default f-w-600"><i class="fas fa-info-circle"> Information</i></h5>
                <div class="row">
                    <div class="col-sm-6">
                        <p class="m-b-10 f-w-600"><i class="fas fa-mail-bulk"></i> Email</p>
                        <h6 class="text-muted f-w-400">{{ $user->email }}</h6>
                    </div>
                    <div class="col-sm-6">
                        <p class="m-b-10 f-w-600"><i class="fas fa-phone-volume"></i> Phone</p>
                        <h6 class="text-muted f-w-400">0983769104</h6>
                    </div>
                </div>
                <br>
                <h5 class="m-b-20 m-t-40 p-b-5 b-b-default f-w-600"><i class="fas fa-tasks"></i> Boards</h5>
                <div class="row">
                    <div class="col-sm-6">
                        <p class="m-b-10 f-w-600"><i class="far fa-clipboard"></i> My boards</p>
                        @foreach($user->boards as $board)
                            <li class="text-secondary f-w-400">
                                <a href="/board/{{ $board->id }}" class="custom-href">{{ $board->title }}</a>
                            </li>
                        @endforeach
                    </div>
                    <div class="col-sm-6">
                        <p class="m-b-10 f-w-600"><i class="fas fa-recycle"></i> Recently</p>
                        @foreach ($user->boards as $board)
                            @if ($loop->last)
                                <li class="text-secondary f-w-400">
                                    <a href="/board/{{ $board->id }}" class="custom-href">{{ $board->title }}</a>
                                </li>
                            @endif
                        @endforeach
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

<script type= text/javascript>
    $(document).ready(function() {
        $('#upload-photo').change(function() {
            if ($(this) != null) {
                $('#change-profile').removeAttr('disabled');
            } else {               
                $('#change-profile').attr('disabled', '');
            }
        });
    });
</script>
</body>
</html>