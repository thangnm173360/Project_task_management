let listIndex = 0;

//Nạp và khởi tạo các thành phần của danh sách
function loadCard(list, card) {
	var newCard = document.createElement('div');
	newCard.className = "card";
	newCard.draggable = "true";
	newCard.setAttribute('data-id-board', board.getAttribute('data-id-board'));
	newCard.setAttribute('data-id-list', list.getAttribute('data-id-list'));
	newCard.setAttribute('data-id-card', card.id);
	newCard.setAttribute('data-card', card.title);

	var newCardLabel = document.createElement('div');
	newCardLabel.className = "card-label";
	newCardLabel.innerHTML = card.title;

	var newCardEdit = document.createElement('textarea');
	newCardEdit.className = "card-edit";

	var newCardEditBtn = document.createElement('div');
	newCardEditBtn.className = "btn card-edit-btn";
	newCardEditBtn.innerHTML = "<i class=\"fas fa-pen\"></i>";

	var newCardDeadline = document.createElement('div');
	newCardDeadline.innerHTML = "<i class=\"far fa-clock\"></i><span>" + setDateText(card.dead_line, "") + "</span>";

	newCard.appendChild(newCardLabel);
	newCard.appendChild(newCardEdit);
	newCard.appendChild(newCardEditBtn);

	var newCardDeadline = document.createElement('div');

	if (card.dead_line != null) {
		newCardDeadline.innerHTML = "<i class=\"far fa-clock\"></i><span>" + setDateText(card.dead_line, "") + "</span>";
		if (card.status == "completed") {
			newCardDeadline.className = "date-status is-complete normal";
		} else {
			newCardDeadline.className = setStatusClass(card.dead_line);
		}
	}
	newCard.appendChild(newCardDeadline);
	list.children[1].appendChild(newCard);

	newCard.addEventListener('click', function (e) {
		if (!(e.target.classList.contains("btn"))) {
			let url = "/boards/" + newCard.getAttribute('data-id-board') + "/lists/" + newCard.getAttribute('data-id-list') + "/cards/" + newCard.getAttribute('data-id-card');
			handleAPI(url, {}, "GET", "card");
			card = newCard;
		}
	});

	newCardEditBtn.addEventListener('click', function (e) {
		newCardEdit.style.zIndex = 1;
		newCardEdit.focus();
	});

	newCardEdit.addEventListener('blur', function () {
		if (newCardEdit.value !== "") {
			newCardLabel.innerHTML = newCardEdit.value;
			let url = "/boards/" + newCard.getAttribute('data-id-board') + "/lists/" + newCard.getAttribute('data-id-list') +
				"/cards/" + newCard.getAttribute('data-id-card');
			handleAPI(url, setTokenToData("title", newCardEdit.value), "PUT", "card");
			newCardEdit.value = "";
		}
		newCardEdit.style.zIndex = -1;
	});
	return newCard;
}

function renderListCard(list, list_card) {
	list_card.forEach((card) => {
		loadCard(list, card);
	});
}

function createListHeader(list, title) {
	let listControl = document.getElementById('list-control');
	var newListHeader = document.createElement('div');
	newListHeader.className = "list-header";

	var newListHeaderTitle = document.createElement('div');
	newListHeaderTitle.className = "list-title";

	var newListHeaderTitleLabel = document.createElement('div');
	newListHeaderTitleLabel.className = "list-title-label";
	newListHeaderTitleLabel.innerHTML = title;

	var newListHeaderTitleEdit = document.createElement('textarea');
	newListHeaderTitleEdit.className = "list-title-edit";

	var newListHeaderExtra = document.createElement('div');
	newListHeaderExtra.className = "list-action center";
	newListHeaderExtra.innerHTML = "<i class=\" fas fa-ellipsis-h \"></i>";
	newListHeaderExtra.addEventListener('click', function () {
		listIndex = list.getAttribute('data-id-list');
		let position = this.getBoundingClientRect();
		let positionTop = position.top;
		let positionLeft = position.left + 40;
		listControl.style.top = positionTop + "px";
		listControl.style.left = positionLeft + "px";
		listControl.classList.toggle('hide');
		listControl.setAttribute('data-id-board', list.getAttribute('data-id-board'));
		listControl.setAttribute('data-id-list', listIndex);
	});

	newListHeader.appendChild(newListHeaderTitle);
	newListHeader.appendChild(newListHeaderExtra);
	newListHeaderTitle.appendChild(newListHeaderTitleLabel);
	newListHeaderTitle.appendChild(newListHeaderTitleEdit);

	newListHeaderTitleLabel.addEventListener("dblclick", function () {
		newListHeaderTitleEdit.style.zIndex = 1;
		newListHeaderTitleEdit.focus();
	});

	newListHeaderTitleEdit.addEventListener('blur', function () {
		if (newListHeaderTitleEdit.value !== "") {
			newListHeaderTitleLabel.innerHTML = newListHeaderTitleEdit.value;
			let url = "/boards/" + list.getAttribute('data-id-board') + "/lists/" + list.getAttribute('data-id-list');
			handleAPI(url, setTokenToData("title", newListHeaderTitleEdit.value), "PUT", "list");
		}
		newListHeaderTitleEdit.style.zIndex = -1;
	});

	list.appendChild(newListHeader);
	return newListHeader;
}

function createListCard(list) {
	var newListCard = document.createElement('div');
	newListCard.className = "list-card";
	list.appendChild(newListCard);
	return newListCard;
}

//Nạp danh sách từ JSON trả về
function renderList(list) {
	let boardContent = document.getElementById('board-content');
	let newListWrapper = document.createElement('div');
	newListWrapper.className = "list-wrapper";

	let newList = document.createElement('div');
	newList.className = "list";
	newList.setAttribute('data-id-board', board.getAttribute('data-id-board'));
	newList.setAttribute('data-id-list', list.id);
	newList.setAttribute('data-list', list.title);

	createListHeader(newList, list.title);
	createListCard(newList);
	createCardComposerContainer(newList);

	newListWrapper.appendChild(newList);
	boardContent.insertBefore(newListWrapper, addList);

	return newList;
}

//Thao tác xử lý với danh sách
let deleteListBtn = document.getElementById('delete-list');
let listSort = document.getElementById('list-sort');

deleteListBtn.addEventListener('click', function () {
	let listControl = document.getElementById('list-control');
	listControl.classList.toggle('hide');
	let url = "/boards/" + listControl.getAttribute('data-id-board') + "/lists/" + listControl.getAttribute('data-id-list');
	handleAPI(url, setTokenToData("", ""), "DELETE", "list");
});

let popUpClose = document.querySelectorAll('.popup-close');
popUpClose.forEach(function (item) {
	item.addEventListener('click', function () {
		this.parentElement.classList.add('hide');
	});
});


//Sắp xếp các thẻ trong danh sách
let listSortOption = document.getElementById('list-sort-option');
let sortByDeadlineUp = document.getElementById('sort-deadline-up');
let sortByDeadlineDown = document.getElementById('sort-deadline-down');
let sortByName = document.getElementById('sort-name');

listSort.addEventListener('click', function () {
	setPosition(listSort, listSortOption, 200, -5);
	listSortOption.classList.toggle('hide');
});

function sortListCard(listId, type) {
	let listCard = getList(listId).children[1];
	let numberOfCard = listCard.childElementCount;
	switch (type) {
		case 1:
			break;
		case 2:
			break;
		case 3:
			for (let i = 0; i < numberOfCard - 1; i++) {
				for (let j = i + 1; j < numberOfCard; j++) {
					if(listCard.children[i].getAttribute('data-card') > listCard.children[j].getAttribute('data-card')) {
						listCard.insertBefore(listCard.children[j], listCard.children[i]);
					}
				}
			}
			break;
	}
}

sortByDeadlineDown.addEventListener('click', function () {
	let listId = document.getElementById('list-control').getAttribute('data-id-list');
	sortListCard(listId, 1);
});

sortByDeadlineUp.addEventListener('click', function () {
	let listId = document.getElementById('list-control').getAttribute('data-id-list');
	sortListCard(listId, 2);
});

sortByName.addEventListener('click', function () {
	let listId = document.getElementById('list-control').getAttribute('data-id-list');
	sortListCard(listId, 3);
});