let windowOverlay = document.getElementById('window-overlay');
let cardInfo = document.getElementById('card-info');
let cardHeaderLabel = document.getElementById('card-header-label');
let cardHeaderEdit = document.getElementById('card-header-edit');
let cardCloseBtn = document.getElementsByClassName("card-close-btn")[0];
let board = document.getElementById('board');

//Hiển thị thông tin chi tiết của thẻ
cardInfo.parentElement.addEventListener("click", (e) => {
	if (e.target.classList.contains("window-overlay")) {
		cardInfo.parentElement.classList.toggle('hide');
		clearDetail();
	}
});

//Thay đổi tên thẻ từ bảng chi tiết
cardHeaderLabel.addEventListener('dblclick', function () {
	swapElement(cardHeaderEdit, cardHeaderLabel);
	cardHeaderEdit.focus();
});

cardHeaderEdit.addEventListener('blur', function () {
	if (cardHeaderEdit.value !== "") {
		cardHeaderLabel.firstElementChild.innerHTML = cardHeaderEdit.value;
		let url = setURLCard(cardInfo.getAttribute('data-id-board'), cardInfo.getAttribute('data-id-list'), cardInfo.getAttribute('data-id-card'));
		let data = setTokenToData("title", cardHeaderEdit.value);
		handleAPI(url, data, "PUT", "card");

		let card = getCard(cardInfo.getAttribute('data-id-list'), cardInfo.getAttribute('data-id-card'));
		card.firstElementChild.innerHTML = cardHeaderEdit.value;
	}
	swapElement(cardHeaderEdit, cardHeaderLabel);
});


cardCloseBtn.addEventListener('click', function () {
	windowOverlay.classList.toggle('hide');
	cardHeaderEdit.value = "";
	cardHeaderLabel.firstElementChild.innerHTML = "";
	clearDetail();
});

//Card deadline
var dateSection = document.getElementById('date-section');
var dateCheckbox = document.getElementById('date-checkbox');
var dateStatus = document.getElementById('date-status');
var dateText = document.getElementById('date-text');

//Bảng chọn ngày giờ lấy từ Jquery
$('.datetimepicker').datetimepicker({
	step: 30,
	minDate: 0,
	onChangeDateTime: function (dp, $input) {
		let date = new Date($input.val());
		dateText.innerHTML = setDateText(date, "d/m h:i");
		dateText.setAttribute('data-deadline', setDateText(date, "y-m-d h:i:s"));
		dateCheckbox.classList.remove('is-checked');
		checkDeadline(dateStatus, date);

		let url = setURLCard(cardInfo.getAttribute('data-id-board'), cardInfo.getAttribute('data-id-list'), cardInfo.getAttribute('data-id-card'));
		handleAPI(url, setTokenToData("dead_line", setDateText(date, "y-m-d h:i:s")), "PUT", "card");
		handleAPI(url, setTokenToData("status", "pending"), "PUT", "card");

		let card = getCard(cardInfo.getAttribute('data-id-list'), cardInfo.getAttribute('data-id-card'));
		card.children[3].innerHTML = "<i class=\"far fa-clock\"></i><span>" + setDateText(date, "") + "</span>";
		card.children[3].className = setStatusClass(date);
	}
});

let cardDateButton = document.getElementById('card-date-button');
cardDateButton.addEventListener('click', function () {
	$('.datetimepicker').datetimepicker('show');
});

//Đặt màu trạng thái cho text hiển thị deadline
function setStatusClass(date) {
	let d = new Date(date).getTime();
	let current = new Date().getTime();
	let minuteDiff = Math.round((d - current) / (1000 * 60));
	if (minuteDiff > 2880) {
		return "date-status";
	} else if (minuteDiff < 2880 && minuteDiff > 0) {
		return "date-status almost-due";
	} else {
		return "date-status overdue";
	}
}

//Kiểm tra deadline và trả về class cho text hiển thị
function checkDeadline(dateStatus, deadline) {
	let d = new Date(deadline).getTime();
	let current = new Date().getTime();
	let minuteDiff = Math.round((d - current) / (1000 * 60));
	if (minuteDiff > 2880) {
		dateStatus.className = "date-status";
		dateStatus.innerHTML = "";
	} else if (minuteDiff < 2880 && minuteDiff > 0) {
		dateStatus.className = "date-status almost-due";
		dateStatus.innerHTML = "DUE SOON";
	} else {
		dateStatus.className = "date-status overdue";
		dateStatus.innerHTML = "OVERDUE";
	}
}

//Nạp deadline vào trong thẻ chi tiết
function renderDeadline(deadline, status) {
	if (deadline != null) {
		dateSection.className = "card-detail-item";
		dateText.innerHTML = setDateText(deadline, "d/m h:i");
		dateText.setAttribute('data-deadline', deadline);
		if (status == "completed") {
			dateCheckbox.className = "card-date-checkbox is-checked";
			dateStatus.innerHTML = "Complete";
			dateStatus.className = "date-status is-complete";
		} else {
			dateCheckbox.className = "card-date-checkbox";
			checkDeadline(dateStatus, deadline);
		}
	} else {
		dateSection.className = "card-detail-item hide";
		dateText.innerHTML = "";
		dateStatus.className = "date-status";
		dateStatus.innerHTML = "";
	}
}

// Check box để đánh dấu hoan thanh
dateCheckbox.addEventListener('click', function () {
	let card = getCard(cardInfo.getAttribute('data-id-list'), cardInfo.getAttribute('data-id-card'));
	if (dateText.innerHTML != "") {
		if (dateCheckbox.classList.contains('is-checked')) {
			dateCheckbox.className = "card-date-checkbox";
			checkDeadline(dateStatus, dateText.getAttribute('data-deadline'));

			let url = setURLCard(cardInfo.getAttribute('data-id-board'), cardInfo.getAttribute('data-id-list'), cardInfo.getAttribute('data-id-card'));
			let data = setTokenToData("status", "pending");
			handleAPI(url, data, "PUT", "card");
			card.children[3].className = setStatusClass(dateText.getAttribute('data-deadline'));
		} else {
			dateCheckbox.className = "card-date-checkbox is-checked";
			dateStatus.innerHTML = "Complete";
			dateStatus.className = "date-status is-complete";
			let url = setURLCard(cardInfo.getAttribute('data-id-board'), cardInfo.getAttribute('data-id-list'), cardInfo.getAttribute('data-id-card'));
			let data = setTokenToData("status", "completed");
			handleAPI(url, data, "PUT", "card");
			card.children[3].className = "date-status is-complete";
		}
	}
});

//Mô tả thẻ
let cardDescription = document.getElementById('card-desc');
let clearDescBtn = document.getElementById('clear-desc-btn');
let descContent = document.getElementById('desc-label');
let descEditSection = document.getElementById('desc-edit-section');
let descEditTextarea = document.getElementById('desc-edit-textarea');
let descSaveBtn = document.getElementById('desc-save-btn');
let descCancelBtn = document.getElementById('desc-cancel-btn');
let descEmpty = document.getElementById('desc-empty');

descEmpty.addEventListener('click', function () {
	swapElement(descEditSection, descEmpty);
	descEditTextarea.focus();
});

clearDescBtn.addEventListener('click', function () {
	if (descContent.firstElementChild.innerHTML != "") {
		descContent.firstElementChild.innerHTML = "";
		descEditTextarea.value = "";
		descEmpty.classList.toggle('hide');
		descContent.classList.toggle('hide');
		let url = "/boards/" + cardInfo.getAttribute('data-id-board') + "/lists/" + cardInfo.getAttribute('data-id-list') + "/cards/" + cardInfo.getAttribute('data-id-card');
		handleAPI(url, setTokenToData("description", ""), "PUT", "card");
	}
});

descSaveBtn.addEventListener('click', function () {
	if (descEditTextarea.value != "") {
		descContent.firstElementChild.innerHTML = descEditTextarea.value;
		swapElement(descContent, descEditSection);

		let url = "/boards/" + cardInfo.getAttribute('data-id-board') + "/lists/" + cardInfo.getAttribute('data-id-list') + "/cards/" + cardInfo.getAttribute('data-id-card');
		handleAPI(url, setTokenToData("description", descEditTextarea.value), "PUT", "card");
	}
});

descContent.addEventListener('click', function () {
	descEditTextarea.value = descContent.firstElementChild.innerHTML;
	swapElement(descEditSection, descContent);
	descEditTextarea.focus();
});

descCancelBtn.addEventListener('click', function () {
	if (descContent.firstElementChild.innerHTML == "") {
		descEditSection.className = "desc-edit-section hide";
		descContent.className = "desc-label hide";
		descEmpty.className = "desc-empty";
	} else {
		descEditSection.className = "desc-edit-section hide";
		descContent.className = "desc-label";
		descEmpty.className = "desc-empty hide";
	}
});

function renderDescription(description) {
	if (description != null) {
		descContent.className = "desc-label";
		descContent.firstElementChild.innerHTML = description;
		descEmpty.className = "empty-desc hide";
	} else {
		descEmpty.className = "empty-desc";
		descContent.className = "desc-label hide";
	}
}

//Linh đính kèm cho thẻ
let attachmentSection = document.getElementById('attachment');
const attachmentList = document.getElementById('attachment-list');
let openNewAttachmentBtn = document.getElementById('open-new-attachment-btn');
let newAttachmentSection = document.getElementById('new-attachment-section');
let newAttachmentInput = document.getElementById('new-attachment-input');
let attachmentSaveBtn = document.getElementById('attachment-save-btn');
let attachmentCancelBtn = document.getElementById('attachment-cancel-btn');

//Nạp linh đính kèm
function renderAttachment(attachment) {

	if (attachmentSection.classList.contains('hide')) {
		attachmentSection.classList.toggle('hide');
	}

	let newAttachmentThumbnail = document.createElement('div');
	newAttachmentThumbnail.className = "attachment-thumbnail";
	newAttachmentThumbnail.title = attachment.content;
	newAttachmentThumbnail.setAttribute('data-id-attachment', attachment.id);

	let newThumbnailPreview = document.createElement('div');
	newThumbnailPreview.className = "thumbnail-preview";
	if (attachment.content.includes('github.com')) {
		newThumbnailPreview.innerHTML = "<i class=\"fas fa-code-branch\"></i>";
		newThumbnailPreview.style.backgroundColor = "#000";
		newThumbnailPreview.style.color = "#fff";
	} else if (attachment.content.includes('drive.google.com')) {
		newThumbnailPreview.innerHTML = "<i class=\"fab fa-google-drive\"></i>";
		newThumbnailPreview.style.backgroundColor = "#fff";
		newThumbnailPreview.style.color = "#000";
	} else if (attachment.content.includes('dropbox.com')) {
		newThumbnailPreview.innerHTML = "<i class=\"fab fa-dropbox\"></i>";
		newThumbnailPreview.style.backgroundColor = "#eeeeee";
		newThumbnailPreview.style.color = "#0062ff";
	} else {
		newThumbnailPreview.innerHTML = "<i class=\"fas fa-link\"></i>";
		newThumbnailPreview.style.backgroundColor = "#eeeeee";
		newThumbnailPreview.style.color = " #667684";
	}

	let newAttachmentLink = document.createElement('a');
	newAttachmentLink.href = attachment.content;
	newAttachmentLink.target = "_blank";
	newAttachmentLink.style.maxHeight = "14px";
	newAttachmentLink.style.textOverflow = "ellipsis";
	newAttachmentLink.innerHTML = "<span>" + attachment.content + "</span>";

	let newAttachmentEditInput = document.createElement('input');
	newAttachmentEditInput.className = "hide";
	newAttachmentEditInput.type = "text";
	newAttachmentEditInput.placeholder = "Dán liên kết ở đây";
	newAttachmentEditInput.style.flexGrow = 1;
	newAttachmentEditInput.spellcheck = "false";

	let newAttachmentControl = document.createElement('div');
	newAttachmentControl.className = "attachment-control";

	let newAttachmentEditBtn = document.createElement('div');
	newAttachmentEditBtn.className = "attachment-edit";
	newAttachmentEditBtn.innerHTML = "<i class=\"far fa-edit\"></i>";
	newAttachmentEditBtn.addEventListener('click', function () {
		swapElement(newAttachmentLink, newAttachmentEditInput);
		swapElement(newAttachmentSaveBtn, newAttachmentEditBtn);
		swapElement(newAttachmentCancelBtn, newAttachmentDeletebtn);
		newAttachmentEditInput.value = newAttachmentLink.href;
		newAttachmentEditInput.focus();
	});

	let newAttachmentDeletebtn = document.createElement('div');
	newAttachmentDeletebtn.className = "attachment-delete";
	newAttachmentDeletebtn.innerHTML = "<i class=\"fas fa-unlink\"></i>";
	newAttachmentDeletebtn.addEventListener('click', function () {
		attachmentList.removeChild(newAttachmentThumbnail);
		let url = setURLCard(cardInfo.getAttribute('data-id-board'), cardInfo.getAttribute('data-id-list'), cardInfo.getAttribute('data-id-card'));
		url = url + "/attachments/" + attachment.id;
		let data = setTokenToData("", "");
		handleAPI(url, data, "DELETE", "attachment");
	});

	let newAttachmentSaveBtn = document.createElement('div');
	newAttachmentSaveBtn.className = "change-btn hide";
	newAttachmentSaveBtn.style.width = "50px";
	newAttachmentSaveBtn.innerHTML = "<span>Lưu</span>";
	newAttachmentSaveBtn.addEventListener('click', function () {
		if (newAttachmentEditInput.value != "") {
			newAttachmentLink.href = newAttachmentEditInput.value;
			newAttachmentLink.innerHTML = "<span>" + newAttachmentEditInput.value + "</span>";
			swapElement(newAttachmentLink, newAttachmentEditInput);
			swapElement(this, newAttachmentEditBtn);
			swapElement(newAttachmentCancelBtn, newAttachmentDeletebtn);

			let url = setURLCard();
			url = url + "/attachments/" + attachment.id;
			let data = setTokenToData("content", newAttachmentEditInput.value);
			handleAPI(url, data, "PUT", "attachment");
		}
	});

	let newAttachmentCancelBtn = document.createElement('div');
	newAttachmentCancelBtn.className = "unchange-btn hide";
	newAttachmentCancelBtn.innerHTML = "<i class=\"fas fa-times\"></i>";
	newAttachmentCancelBtn.addEventListener('click', function () {
		swapElement(newAttachmentLink, newAttachmentEditInput);
		swapElement(newAttachmentSaveBtn, newAttachmentEditBtn);
		swapElement(this, newAttachmentDeletebtn);
		newAttachmentEditInput.value = "";
	});

	attachmentList.appendChild(newAttachmentThumbnail);
	newAttachmentThumbnail.appendChild(newThumbnailPreview);
	newAttachmentThumbnail.appendChild(newAttachmentLink);
	newAttachmentThumbnail.appendChild(newAttachmentEditInput);
	newAttachmentThumbnail.appendChild(newAttachmentControl);
	newAttachmentControl.appendChild(newAttachmentEditBtn);
	newAttachmentControl.appendChild(newAttachmentDeletebtn);
	newAttachmentControl.appendChild(newAttachmentSaveBtn);
	newAttachmentControl.appendChild(newAttachmentCancelBtn);
}

openNewAttachmentBtn.addEventListener('click', function () {
	swapElement(this, newAttachmentSection);
	newAttachmentInput.value = "";
	newAttachmentInput.focus();
});

attachmentSaveBtn.addEventListener('click', function () {
	if (newAttachmentInput.value != "") {
		let cardInfo = document.getElementById('card-info');
		let url = setURLCard(cardInfo.getAttribute('data-id-board'), cardInfo.getAttribute('data-id-list'), cardInfo.getAttribute('data-id-card'));
		url = url + "/attachments";
		let data = setTokenToData("content", newAttachmentInput.value);
		handleAPI(url, data, "POST", "attachment");
	}
	swapElement(openNewAttachmentBtn, newAttachmentSection);
});

attachmentCancelBtn.addEventListener('click', function () {
	swapElement(openNewAttachmentBtn, newAttachmentSection);
	newAttachmentInput.value = "";
});


//Hiển thị danh sách task con
let listTodoList = document.getElementById('list-todo-list');
let newTodoListBox = document.getElementById('new-todo-list-box');
let newTodoListBoxInput = document.getElementById('new-todo-list-box-input');
let newTodoListAddBtn = document.getElementById('new-todo-list-box-add');
let newTodoListCloseBtn = document.getElementById('new-todo-list-box-cancel');

//Nén dữ liệu checklist vào để gửi API cho server
function setCheckListToJson(listItems, newTask) {
	let data = "";
	let subtask = { task_name: "", isChecked: "" };
	for (let i = 0; i < listItems.childElementCount; i++) {
		let item = listItems.children[i];
		if (item.firstElementChild.className == "item-checkbox is-checked") {
			subtask.isChecked = "true";
		} else {
			subtask.isChecked = "false";
		}
		subtask.task_name = item.children[1].firstElementChild.innerHTML;
		data += JSON.stringify(subtask) + ",";
	}
	if (newTask != "") {
		subtask.task_name = newTask;
		subtask.isChecked = "false";
		data += JSON.stringify(subtask);
		return data
	} else {
		data = data.slice(0, -1);
		return data;
	}
}

//Nạp và hiển thị các task con
function renderSubtask(listItem, taskName, isChecked) {
	let item = document.createElement('div');
	item.className = "item";

	let itemCheckbox = document.createElement('div');
	itemCheckbox.className = "item-checkbox";
	itemCheckbox.innerHTML = "<i class=\"fas fa-check\"></i>";
	if (isChecked == "true") {
		itemCheckbox.className = "item-checkbox is-checked";
	}

	let itemDetail = document.createElement('div');
	itemDetail.className = "item-detail";
	itemDetail.innerHTML = "<span>" + taskName + "</span>";

	let itemControll = document.createElement('div');
	itemControll.className = "item-control";

	let itemInput = document.createElement('input');
	itemInput.className = "hide";
	itemInput.type = "text";
	itemInput.style.flexGrow = 1;

	let itemSaveBtn = document.createElement('div');
	itemSaveBtn.className = "change-btn hide";
	itemSaveBtn.style.width = "50px";
	itemSaveBtn.style.marginLeft = "10px"
	itemSaveBtn.innerHTML = "<span>Lưu</span>";

	let itemCancelBtn = document.createElement('div');
	itemCancelBtn.className = "unchange-btn hide";
	itemCancelBtn.innerHTML = "<i class=\"fas fa-times\"></i>";

	let itemDelete = document.createElement('div');
	itemDelete.className = "item-delete";
	itemDelete.innerHTML = "<i class=\"fas fa-ban\"></i>";

	itemCheckbox.addEventListener('click', function () {
		this.classList.toggle('is-checked');
		let cardInfo = document.getElementById('card-info');

		let url = setURLCard(cardInfo.getAttribute('data-id-board'), cardInfo.getAttribute('data-id-list'), cardInfo.getAttribute('data-id-card'));
		url += "/checklists/" + listItem.parentElement.getAttribute('data-id-checklist') ;
		let data = setTokenToData("list_checklist", setCheckListToJson(listItem, ""));

		handleAPI(url, data, "PUT", "checklist");
		updateTodoList(listItem.parentElement);
	});

	itemDetail.addEventListener('click', function () {
		itemInput.value = itemDetail.firstElementChild.innerHTML;
		itemDetail.classList.toggle('hide');
		itemInput.classList.toggle('hide');
		itemSaveBtn.classList.toggle('hide');
		itemCancelBtn.classList.toggle('hide');
		itemDelete.classList.toggle('hide');
		itemInput.focus();
	});

	itemSaveBtn.addEventListener('click', function () {
		if (itemInput.value != "") {
			itemDetail.firstElementChild.innerHTML = itemInput.value;
			itemDetail.classList.toggle('hide');
			itemInput.classList.toggle('hide');
			itemSaveBtn.classList.toggle('hide');
			itemCancelBtn.classList.toggle('hide');
			itemDelete.classList.toggle('hide');
		}
	});

	itemCancelBtn.addEventListener('click', function () {
		itemInput.value = "";
		itemDetail.classList.toggle('hide');
		itemInput.classList.toggle('hide');
		itemSaveBtn.classList.toggle('hide');
		itemCancelBtn.classList.toggle('hide');
		itemDelete.classList.toggle('hide');
	});

	itemDelete.addEventListener('click', function () {
		listItem.removeChild(item);
		updateTodoList(listItem.parentElement);
	});

	listItem.appendChild(item);
	item.appendChild(itemCheckbox);
	item.appendChild(itemDetail);
	item.appendChild(itemControll);
	itemControll.appendChild(itemInput);
	itemControll.appendChild(itemSaveBtn);
	itemControll.appendChild(itemCancelBtn);
	itemControll.appendChild(itemDelete);

	updateTodoList(listItem.parentElement);
}

//Nạp và hiển thị các danh sách việc làm
function renderCheckList(checklist) {

	let checkList = document.createElement('div');
	checkList.className = "window-module todo-list";
	checkList.setAttribute('data-id-checklist', checklist.id);

	let checkListHeader = document.createElement('div');
	checkListHeader.className = "window-module-header";
	checkListHeader.innerHTML = "<span><i class=\"far fa-check-square\"></i></span>";

	let checklistTitle = document.createElement('div');
	checklistTitle.className = "todo-title";
	checklistTitle.innerHTML = "<span class=\"todo-name-label\">" + checklist.name + "</span>";


	let checkListControl = document.createElement('div');
	checkListControl.className = "todo-list-control";

	let checkListControlHide = document.createElement('div');
	checkListControlHide.className = "normal-btn";
	checkListControlHide.innerHTML = "<span>Hide completed items</span>";

	let checkListControlShow = document.createElement('div');
	checkListControlShow.className = "normal-btn hide";
	checkListControlShow.innerHTML = "<span>Show checked items</span>";
	checkListControlShow.addEventListener('click', function () {
		swapElement(checkListControlHide, checkListControlShow);
		showComplete(checkList);
	});

	let checkListControlDelete = document.createElement('div');
	checkListControlDelete.className = "normal-btn";
	checkListControlDelete.innerHTML = "<span>Delete</span>";
	checkListControlDelete.addEventListener('click', function () {
		let cardInfo = document.getElementById('card-info');
		let url = setURLCard(cardInfo.getAttribute('data-id-board'), cardInfo.getAttribute('data-id-list'), cardInfo.getAttribute('data-id-card'));
		url = url + "/checklists/" + checklist.id;
		let data = setTokenToData("", "");
		handleAPI(url, data, "DELETE", "checklist");
		listTodoList.removeChild(checkList);
	});

	let checkNameEdit = document.createElement('div');
	checkNameEdit.className = "todo-name-edit hide";

	let checklistNameEditInput = document.createElement('input');
	checklistNameEditInput.type = "text";
	checklistNameEditInput.placeholder = "Checklist";
	checklistNameEditInput.style.flexGrow = 1;

	let checkListNameEditSaveBtn = document.createElement('div');
	checkListNameEditSaveBtn.className = "change-btn";
	checkListNameEditSaveBtn.style.width = "50px";
	checkListNameEditSaveBtn.style.marginLeft = "10px";
	checkListNameEditSaveBtn.innerHTML = "<span>Lưu</span>";

	checklistTitle.firstChild.addEventListener('dblclick', function () {
		checklistNameEditInput.value = checklistTitle.firstElementChild.innerHTML;
		swapElement(checklistTitle, checkNameEdit);
		checklistNameEditInput.focus();
	});

	checkListControlHide.addEventListener('click', function () {
		swapElement(checkListControlHide, checkListControlShow);
		hideComplete(checkList);
	});

	checkListNameEditSaveBtn.addEventListener('click', function () {
		if (checklistNameEditInput.value != "") {
			checklistTitle.firstElementChild.innerHTML = checklistNameEditInput.value;

			let url = setURLCard(cardInfo.getAttribute('data-id-board'), cardInfo.getAttribute('data-id-list'), cardInfo.getAttribute('data-id-card'));
			url = url + "/checklists/" + checklist.id;
			let data = setTokenToData("name", checklistNameEditInput.value);
			handleAPI(url, data, "PUT", "checklist");

			swapElement(checklistTitle, checkNameEdit);
		}
	});

	let checkListNameEditCancel = document.createElement('div');
	checkListNameEditCancel.className = "unchange-btn";
	checkListNameEditCancel.innerHTML = "<i class=\"fas fa-times\"></i>";
	checkListNameEditCancel.addEventListener('click', function () {
		swapElement(checklistTitle, checkNameEdit);
		checklistNameEditInput.value = "";
	});

	checkListHeader.appendChild(checklistTitle);
	checkListHeader.appendChild(checkNameEdit);
	checklistTitle.appendChild(checkListControl);
	checkListControl.appendChild(checkListControlHide);
	checkListControl.appendChild(checkListControlShow);
	checkListControl.appendChild(checkListControlDelete);
	checkNameEdit.appendChild(checklistNameEditInput);
	checkNameEdit.appendChild(checkListNameEditSaveBtn);
	checkNameEdit.appendChild(checkListNameEditCancel);

	// Create todo progress
	let todoProgress = document.createElement('div');
	todoProgress.className = "todo-progress";

	let percentageSpan = document.createElement('span');
	percentageSpan.className = "percentage";
	percentageSpan.innerHTML = "0%";

	let progressBar = document.createElement('div');
	progressBar.className = "progress-bar";
	let progressCurrent = document.createElement('div');
	progressCurrent.className = "progress-current";

	todoProgress.appendChild(percentageSpan);
	todoProgress.appendChild(progressBar);
	progressBar.appendChild(progressCurrent);

	// Create list items
	let listItems = document.createElement('div');
	listItems.className = "list-items";

	// Create new-item
	let newItem = document.createElement('div');
	newItem.className = "new-item";

	let newItemOpen = document.createElement('div');
	newItemOpen.className = "normal-btn";
	newItemOpen.style.marginLeft = 0;
	newItemOpen.innerHTML = "<span>Add an item</span>";
	newItemOpen.addEventListener('click', function () {
		swapElement(this, newItemSection);
		newItemSectionInput.focus();
	});

	let newItemSection = document.createElement('div');
	newItemSection.className = "new-item-section hide";
	let newItemSectionInput = document.createElement('input');
	newItemSectionInput.type = "text";
	newItemSectionInput.style.width = "70%";
	newItemSectionInput.spellcheck = "false";

	let newItemSectionDiv = document.createElement('div');
	newItemSectionDiv.style.display = "flex";
	newItemSectionDiv.style.marginTop = "10px";
	let newItemSaveBtn = document.createElement('div');
	newItemSaveBtn.className = "change-btn";
	newItemSaveBtn.style.width = "50px";
	newItemSaveBtn.innerHTML = "<span>Lưu</span>";
	newItemSaveBtn.addEventListener('click', function () {
		if (newItemSectionInput.value != "") {
			let cardInfo = document.getElementById('card-info');
			let url = setURLCard(cardInfo.getAttribute('data-id-board'), cardInfo.getAttribute('data-id-list'), cardInfo.getAttribute('data-id-card'));
			url += "/checklists/" + checklist.id;
			let data = setTokenToData("list_checklist", setCheckListToJson(listItems, newItemSectionInput.value));

			handleAPI(url, data, "PUT", "checklist");
			renderSubtask(listItems, newItemSectionInput.value, "false");
			newItemSectionInput.value = "";
			updateTodoList(checkList);
			swapElement(newItemOpen, newItemSection);
		}
	});

	let newItemCancelBtn = document.createElement('div');
	newItemCancelBtn.className = "unchange-btn";
	newItemCancelBtn.innerHTML = "<i class=\"fas fa-times\"></i>";
	newItemCancelBtn.addEventListener('click', function () {
		newItemSectionInput.value = "";
		swapElement(newItemOpen, newItemSection);
	});

	newItemSectionDiv.appendChild(newItemSaveBtn);
	newItemSectionDiv.appendChild(newItemCancelBtn);

	newItemSection.appendChild(newItemSectionInput);
	newItemSection.appendChild(newItemSectionDiv);

	newItem.appendChild(newItemOpen);
	newItem.appendChild(newItemSection);

	listTodoList.appendChild(checkList);
	checkList.appendChild(checkListHeader);
	checkList.appendChild(todoProgress);
	checkList.appendChild(listItems);
	checkList.appendChild(newItem);

	if (checklist.list_checklist != null) {
		let list_task = JSON.parse(checklist.list_checklist);
		for (let i = 0; i < list_task.length; i++) {
			renderSubtask(listItems, list_task[i].task_name, list_task[i].isChecked);
		}
	}
}

//Nạp các danh sách các check list
function renderListChecklist(listChecklist) {
	for (let i = 0; i < listChecklist.length; i++) {
		renderCheckList(listChecklist[i]);
	}
}

//Cập nhật thanh trạng thái cho tung Checklist
function updateTodoList(todoList) {
	let numberOfItems = todoList.childNodes[2].childElementCount;
	let numberOfComplete = 0;
	for (let i = 0; i < numberOfItems; i++) {
		if (todoList.childNodes[2].children[i].firstChild.classList.contains('is-checked')) {
			numberOfComplete++;
		}
	}
	let progress = todoList.childNodes[1];
	let currentBar = progress.lastChild.firstChild;
	let percentage;
	if (numberOfItems == 0) {
		percentage = 0;
	} else {
		percentage = Math.floor(numberOfComplete / numberOfItems * 100);
	}
	progress.firstElementChild.innerHTML = percentage + "%";
	progress.lastChild.firstChild.style.width = percentage + "%";

	if (numberOfComplete == numberOfItems) {
		currentBar.style.backgroundColor = "#58cf40";
	} else {
		currentBar.style.backgroundColor = "#80ccff";
	}
}

//Ẩn các task đã đánh dấu hoan thanh
function hideComplete(todoList) {
	let numberOfItems = todoList.childNodes[2].childElementCount;
	for (let i = 0; i < numberOfItems; i++) {
		if (todoList.childNodes[2].children[i].firstChild.classList.contains('is-checked')) {
			todoList.childNodes[2].children[i].classList.add('hide');
		}
	}
}

//Hiển thi các task da dánh dâu hoan thành
function showComplete(todoList) {
	let numberOfItems = todoList.childNodes[2].childElementCount;
	for (let i = 0; i < numberOfItems; i++) {
		if (todoList.childNodes[2].children[i].firstChild.classList.contains('is-checked')) {
			todoList.childNodes[2].children[i].classList.remove('hide');
		}
	}
}

//Nut them 
newTodoListAddBtn.addEventListener('click', function () {
	if (newTodoListBoxInput.value != "") {
		let cardInfo = document.getElementById('card-info');
		let url = setURLCard(cardInfo.getAttribute('data-id-board'), cardInfo.getAttribute('data-id-list'), cardInfo.getAttribute('data-id-card'));
		url = url + "/checklists";
		let data = setTokenToData("name", newTodoListBoxInput.value);
		handleAPI(url, data, "POST", "checklist");
		newTodoListBox.classList.toggle('hide');
		newTodoListBoxInput.value = "";
	}
});

newTodoListCloseBtn.addEventListener('click', function () {
	newTodoListBox.classList.toggle('hide');
	newTodoListBoxInput.value = "";
});


//Hiển thi các comment
let listComment = document.getElementById('list-comment');
let commentInput = document.getElementById('comment-input');
let commentControl = commentInput.nextElementSibling;
let hideAllComment = document.getElementById('hide-all-comment');
let showAllComment = document.getElementById('show-all-comment');

function renderComment(activity, createdDate) {
	let newComment = document.createElement('div');
	newComment.className = "comment";
	newComment.setAttribute('data-member-id', activity.user_id);
	newComment.setAttribute('data-id-comment', activity.id);

	let newCommentBadge = document.createElement('div');
	newCommentBadge.className = "member-badge mod-round center";
	newCommentBadge.innerHTML = "<span>" + "H" + "</span>";

	let newCommentDetail = document.createElement('div');
	newCommentDetail.className = "comment-detail";
	let newCommentInfo = document.createElement('div');
	newCommentInfo.className = "comment-info";
	newCommentInfo.innerHTML = "<span class=\"name-member\">" + "HoanDX" + "</span>" +
		"<span class=\"date-modified\">" + setDateText(createdDate, "d/m/y h:i") + "</span>";

	let contentDiv = document.createElement('div');
	let newCommentContent = document.createElement('div');
	newCommentContent.className = "comment-content";

	let newContent = document.createElement('div');
	newContent.className = "content center";
	newContent.innerHTML = "<span>" + activity.content + "</span>";

	let newCommentControlEdit = document.createElement('div');
	newCommentControlEdit.className = "comment-control";
	newCommentControlEdit.innerHTML = "<span>Chỉnh sửa</span>";
	newCommentControlEdit.addEventListener('click', function () {
		swapElement(newCommentContent, newCommentEditBox);
		newCommentEditBoxTextarea.value = newContent.firstElementChild.innerHTML;
	});

	let newCommentControlDelete = document.createElement('div');
	newCommentControlDelete.className = "comment-control";
	newCommentControlDelete.innerHTML = "<span>Xóa</span>";
	newCommentControlDelete.addEventListener('click', function () {
		listComment.removeChild(newComment);
		let url = "/boards/" + cardInfo.getAttribute('data-id-board') + "/lists/" + cardInfo.getAttribute('data-id-list') + "/cards/" + cardInfo.getAttribute('data-id-card') + "/comments/" + activity.id;
		handleAPI(url, setTokenToData("", ""), "DELETE", "card");
	});

	let newCommentEditBox = document.createElement('div');
	newCommentEditBox.className = "comment-edit-box hide";

	let newCommentEditBoxTextarea = document.createElement('textarea');
	newCommentEditBoxTextarea.className = "comment-input";
	newCommentEditBoxTextarea.style.boxShadow = "box-shadow: 0 4px 8px -2px rgba(9, 30, 66, .25), 0 0 0 1px rgba(9, 30, 66, .08)";
	newCommentEditBoxTextarea.style.marginBottom = "10px";
	newCommentEditBoxTextarea.rows = 1;
	newCommentEditBoxTextarea.spellcheck = false;

	let newCommentEditBoxSave = document.createElement('div');
	newCommentEditBoxSave.className = "change-btn";
	newCommentEditBoxSave.style.minWidth = "50px";
	newCommentEditBoxSave.innerHTML = "<span>Lưu</span>";
	newCommentEditBoxSave.addEventListener('click', function () {
		if (newCommentEditBoxTextarea.value != "") {
			newContent.firstElementChild.innerHTML = newCommentEditBoxTextarea.value;
			swapElement(newCommentContent, newCommentEditBox);

			let url = setURLCard(cardInfo.getAttribute('data-id-board'), cardInfo.getAttribute('data-id-list'), cardInfo.getAttribute('data-id-card'));
			url = url + "/comments/" + activity.id;
			let data = setTokenToData("content", newCommentEditBoxTextarea.value);
			handleAPI(url, data, "PUT", "card");
		}
	});

	let newCommentEditBoxCancel = document.createElement('div');
	newCommentEditBoxCancel.className = "unchange-btn";
	newCommentEditBoxCancel.style.minWidth = "32px";
	newCommentEditBoxCancel.innerHTML = "<i class=\"fas fa-times\"></i>";
	newCommentEditBoxCancel.addEventListener('click', function () {
		swapElement(newCommentContent, newCommentEditBox);
		newCommentEditBoxTextarea.value = "";
	});

	//listComment.appendChild(newComment);
	listComment.prepend(newComment);

	newComment.appendChild(newCommentBadge);
	newComment.appendChild(newCommentDetail);

	newCommentDetail.appendChild(newCommentInfo);
	newCommentDetail.appendChild(contentDiv);

	contentDiv.appendChild(newCommentContent);

	newCommentContent.appendChild(newContent);
	newCommentContent.appendChild(newCommentControlEdit);
	newCommentContent.appendChild(newCommentControlDelete);

	contentDiv.appendChild(newCommentEditBox);

	newCommentEditBox.appendChild(newCommentEditBoxTextarea);
	newCommentEditBox.appendChild(newCommentEditBoxSave);
	newCommentEditBox.appendChild(newCommentEditBoxCancel);
}

function renderActivity(listActivity) {
	for (let i = 0; i < listActivity.length; i++) {
		renderComment(listActivity[i], listActivity[i].created_at);
	}
}

commentInput.addEventListener('focus', function () {
	if (this.value == "") {
		commentControl.classList.toggle('hide');
	}
});

//Tạo comment mới
commentControl.firstElementChild.addEventListener('click', function () {
	if (commentInput.value != "") {
		commentControl.classList.toggle('hide');
		if (hideAllComment.classList.contains('hide')) {
			swapElement(hideAllComment, showAllComment);
			listComment.classList.toggle('hide');
		}
		let url = setURLCard(cardInfo.getAttribute('data-id-board'), cardInfo.getAttribute('data-id-list'), cardInfo.getAttribute('data-id-card'));
		url = url + "/comments";
		let data = setTokenToData("content", commentInput.value);
		handleAPI(url, data, "POST", "comment");
		commentInput.value = "";
	}
});

hideAllComment.addEventListener('click', function () {
	if (!listComment.classList.contains('hide')) {
		swapElement(hideAllComment, showAllComment);
		listComment.classList.toggle('hide');
	}
});

showAllComment.addEventListener('click', function () {
	if (listComment.classList.contains('hide')) {
		swapElement(hideAllComment, showAllComment);
		listComment.classList.toggle('hide');
	}
});

//Nạp và hiển thị thoong tin chi tiết cuả thẻ
function renderCardInfo(data) {
	cardHeaderLabel.innerHTML = "<span>" + data.title + "</span>";
	cardHeaderEdit.value = data.title;
	cardInfo.parentElement.classList.toggle('hide');
	cardInfo.setAttribute('data-id-board', board.getAttribute('data-id-board'));
	cardInfo.setAttribute('data-id-list', data.lists_id);
	cardInfo.setAttribute('data-id-card', data.id);

	renderDeadline(data.dead_line, data.status);
	renderDescription(data.description);

	if (data.attachment != []) {
		for (let i = 0; i < data.attachment.length; i++) {
			renderAttachment(data.attachment[i]);
		}
	}
	renderListChecklist(data.check_lists);
	renderActivity(data.comments);
}

//Window side bar
let addMemberBtn = document.getElementById('add-member-btn');
let addTodoBtn = document.getElementById('add-todo-btn');
let addDueDateBtn = document.getElementById('add-due-date');
let addAttachmentBtn = document.getElementById('add-attachment-btn');

let moveCardBtn = document.getElementById('move-card-btn');
let copyCardBtn = document.getElementById('copy-card-btn');
let deleteCardBtn = document.getElementById('delete-card-btn');

deleteCardBtn.addEventListener('click', function () {
	let url = "/boards/" + cardInfo.getAttribute('data-id-board') + "/lists/" + cardInfo.getAttribute('data-id-list') + "/cards/" + cardInfo.getAttribute('data-id-card');
	handleAPI(url, setTokenToData("", ""), "DELETE", "card");
	deleteCard(cardInfo.getAttribute('data-id-list'), cardInfo.getAttribute('data-id-card'));
	windowOverlay.classList.toggle('hide');
	clearDetail();
});

addTodoBtn.addEventListener('click', function () {
	newTodoListBox.classList.toggle('hide');
	let top = this.getBoundingClientRect().top + 40;
	let left = this.getBoundingClientRect().left + 20;
	newTodoListBox.style.top = top + "px";
	newTodoListBox.style.left = left + "px";
});

addDueDateBtn.addEventListener('click', function () {
	if (dateSection.classList.contains('hide')) {
		dateSection.classList.toggle('hide');
	}
});

addAttachmentBtn.addEventListener('click', function () {
	if (attachmentSection.classList.contains('hide')) {
		attachmentSection.classList.toggle('hide');
	} else {
		if (attachmentList.innerText == "") {
			attachmentSection.classList.toggle('hide');
		}
	}
});

//Xoa thẻ
function deleteCard(listId, cardId) {
	let list = getList(listId);
	let card = getCard(listId, cardId);
	list.children[1].removeChild(card);
}

//Đặt lại các truong gia tri cho thẻ chi tiết
function clearDetail() {
	cardHeaderLabel.firstElementChild.innerHTML = "";
	cardHeaderEdit.value = "";
	let dateText = document.getElementById('date-text');
	let dateStatus = document.getElementById('date-status');
	dateText.innerHTML = "";
	dateStatus.className = "date-status";
	dateStatus.innerHTML = "";
	descContent.firstElementChild.innerHTML = "";
	attachmentList.innerHTML = "";
	listTodoList.innerHTML = "";
	listComment.innerHTML = "";
}

//Tạo 1 thẻ mơis
function createEmptyCard(listCard, card) {
	let newEmptyCard = document.createElement('div');
	newEmptyCard.className = "card empty";
	listCard.insertBefore(newEmptyCard, card);
}