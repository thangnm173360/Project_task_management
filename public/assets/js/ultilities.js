//Thay phiên phần tử hiển thị, ví dụ như nhãn và ô text box
function swapElement(fisrt, second) {
	fisrt.classList.toggle('hide');
	second.classList.toggle('hide');
}

//Đặt vị trí cho các popup theo vị trí click chuột
function setPosition(first, second, offsetX, offsetY) {
	let position = first.getBoundingClientRect();
	let positionLeft = position.left + offsetX;
	let positionTop = position.top + offsetY;
	second.style.top = positionTop + "px";
	second.style.left = positionLeft + "px";
}

//Xử lý các truy vấn API tới cho server và nhận phản hồi về để hiển thị ra màn hình
function handleAPI(url, data, method, type) {
	$.ajax({
		url: url,
		type: method,
		data: data,
		success: function (response) {
			//Xử lý các truy vấn vơis bảng
			if (type == "board") {
				switch (method) {
					case "GET":
						for (let i = 0; i < response.length; i++) {
							renderBoard(response[i].id, response[i].title);
						}
						break;
					case "POST":
						renderBoard(response.id, response.title);
						setPopupMessage("Add board successfully !!!", true);
						break;
					case "PUT":
						setPopupMessage("Update board successfully !!!", true);
						break;
					case "DELETE":
						deleteBoard();
						setPopupMessage("Delete board successfully !!!", true);
						break;
				}

			//Xử lý các truy vấn vơi danh sách
			} else if (type == "list") {
				switch (method) {
					case "GET":
						let board = document.getElementById('board');
						board.setAttribute('data-id-board', document.URL.split("/")[4]);
						response.forEach(item => {
							let list = renderList(item);
							renderListCard(list, item.card);
						});
						break;
					case "POST":
						let list = setEmptyList(response);
						renderList(list);
						setPopupMessage("Add board successfully !!!", true);
						break;
					case "PUT":
						setPopupMessage("Update list successfully !!!", true);
						break;
					case "DELETE":
						deleteList();
						setPopupMessage("Delete list successfully !!!", true);
						break;
				}

			//Xử lý các truy vấn vơis thẻ
			} else if (type == "card") {
				switch (method) {
					case "GET":
						renderCardInfo(response);
						break;
					case "POST":
						let list = getList(response.list_id);
						let card = setEmptyCard(response);
						loadCard(list, card);
						setPopupMessage("Add card successfully !!!", true);
						break;
					case "PUT":
						setPopupMessage("Update card successfully !!!", true);
						break;
					case "DELETE":
						setPopupMessage("Delete card successfully !!!", true);
						break;
				}
			//Xử lý các truy vấn linh tinh
			} else if (type == "comment") {
				switch (method) {
					case "POST":
						renderComment(response, new Date());
						break;
				}
			} else if (type == "attachment") {
				switch (method) {
					case "POST":
						renderAttachment(response);
						break;
				}
			} else if (type == "checklist") {
				switch (method) {
					case "POST":
						console.log(response);
						renderCheckList(response);
						break;
					case "PUT":
						console.log(response);
						break;
				}
			}
		},
		error: function (request, status, error) {
			setPopupMessage(status, false);
		}
	});
}

//Trả về các định dạng text theo ý muốn từ ngày giơ
function setDateText(date, format) {
	let d = new Date(date);
	let hour = (d.getHours() < 10) ? ("0" + d.getHours()) : (d.getHours());
	let minute = (d.getMinutes() < 10) ? ("0" + d.getMinutes()) : (d.getMinutes());
	let second = (d.getSeconds() < 10) ? ("0" + d.getSeconds()) : (d.getSeconds());
	if (format == "y-m-d h:i:s") {
		return d.getFullYear() + "-" + `${d.getMonth() + 1}` + "-" + d.getDate() +
			" " + hour + ":" + minute + ":" + second;
	} else if (format == "d/m/y h:i") {

		return d.getDate() + "/" + `${d.getMonth() + 1}` + "/" + d.getFullYear() +
			" " + hour + ":" + minute;
	} else if (format == "d/m h:i") {
		return `${d.getDate()}` + " Month " + `${d.getMonth() + 1}` + " at " + hour + ":" + minute;
	} else {
		return `${d.getDate()}` + " Month " + `${d.getMonth() + 1}`;
	}
}

//Thêm token vào cho các truy vấn gưi request lên server
function setTokenToData(tag, data) {
	let json;
	if (data != "") {
		if (tag != "list_checklist") {
			let token = $('meta[name="csrf-token"]').attr('content');
			json = "{\"" + tag + "\":\"" + data + "\",\"_token\":\"" + token + "\"}";
		} else {
			let token = $('meta[name="csrf-token"]').attr('content');
			json = "{\"" + tag + "\":[" + data + "],\"_token\":\"" + token + "\"}";
		}
		return JSON.parse(json);
	} else {
		let token = $('meta[name="csrf-token"]').attr('content');
		json = "{\"_token\":\"" + token + "\"}";
		return JSON.parse(json);
	}
}

//Đặt đuong dẫn tơi các API xử lý
function setURLCard(boardId, listId, cardId) {
	let url = "/boards/" + boardId + "/lists/" + listId + "/cards/" + cardId;
	return url;
}

//Xoá danh sách trên bang
function deleteList() {
	let boardContent = document.getElementById('board-content');
	let listControl = document.getElementById('list-control');
	for (let i = 0; i < boardContent.childElementCount - 1; i++) {
		if (boardContent.children[i].children[0].getAttribute('data-id-list') == listControl.getAttribute('data-id-list')) {
			boardContent.removeChild(boardContent.children[i]);
		}
	}
}

//Xóa bang
function deleteBoard() {
	let boardWrapper = document.getElementById('board-wrapper');
	let popupAction = document.getElementById('popup-action');
	for (let i = 0; i < boardWrapper.childElementCount; i++) {
		if (boardWrapper.children[i].getAttribute('data-id-board') == popupAction.getAttribute('data-id-board')) {
			boardWrapper.removeChild(boardWrapper.children[i]);
		}
	}
}

//Lấy danh sách từ listId
function getList(listId) {
	let boardContent = document.getElementById('board-content');
	for (let i = 0; i < boardContent.childElementCount - 1; i++) {
		if (boardContent.children[i].children[0].getAttribute('data-id-list') == listId) {
			let list = boardContent.children[i].children[0];
			return list;
		}
	}
}

//Lấy thẻ từ listId và cardId
function getCard(listId, cardId) {
	let boardContent = document.getElementById('board-content');

	for (let i = 0; i < boardContent.childElementCount - 1; i++) {
		if (boardContent.children[i].children[0].getAttribute('data-id-list') == listId) {
			let list = boardContent.children[i].children[0];
			for (let j = 0; j < list.children[1].childElementCount; j++) {
				let card = list.children[1].children[j];
				if (card.getAttribute('data-id-card') == cardId) {
					return card;
				}
			}
		}
	}
}

//Đặt giá tri trôngs cho 1 thẻ
function setEmptyCard(response) {
	let cardJson = { id: response.id, title: response.title, lists_id: response.list_id, dead_line: null, status: "", description: "", attachment: null, check_lists: [], comments: [] };
	return cardJson;
}

//Đặt giá trị trong cho danh sach
function setEmptyList(response) {
	let listJson = { id: response.id, title: response.title, board_id: 0, card: [] };
	return listJson;
}

//Đặt hinh nen cho the
function setUrlBackground(boardId) {
	let index = parseInt(boardId) % 10;
	let url = "../../assets/img/bg" + index + ".jpg";
	return url;
}

//Hiển thi thong diep cho các tác vụ xử lý trên server
function setPopupMessage(msg, isSuccess) {
	let popupMessage = document.getElementById('popup-message');
	if (isSuccess == true) {
		popupMessage.className = "popup popup-message success";
	} else {
		popupMessage.className = "popup popup-message fail";
	}
	popupMessage.innerHTML = "<span>" + msg + "</span>";
	setTimeout(function () {
		popupMessage.className = "popup popup-message hidden";
	}, 2000);
}