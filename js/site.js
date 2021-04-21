let taskArray = [];

function prepareLocalStorage() {
    if (getLocalStorage() == null) {
        // setLocalStorage(taskArray);
        let defObj = {
            list: new Array(),
            filterName: "all"
        }
        setLocalStorage(defObj)
    };
    listTasks()
    // checkIfCompleted()
}

function createTask(formData) {
    let tasks = getLocalStorage();
    let task = {
        id: generateID(),
        created: new Date().toLocaleDateString(),
        completed: false,
        title: formData[0].value,
        dueDate: new Date(`${formData[1].value} 00:00`).toLocaleDateString()
    }
    tasks.push(task)
    setLocalStorage(tasks);
    listTasks();
}

function listTasks() {
    let tasks = getLocalStorage();
    let template = document.getElementById("data-template");
    let resultsBody = document.getElementById("resultsBody");

    resultsBody.innerHTML = "";

    for (let i = 0; i < tasks.length; i++) {
        const taskRow = document.importNode(template.content, true)

        taskRow.getElementById("taskID").textContent = tasks[i].id;
        taskRow.getElementById("complete").textContent = tasks[i].completed;
        taskRow.getElementById("task").textContent = tasks[i].title;
        taskRow.getElementById("createdDate").textContent = tasks[i].created;
        taskRow.getElementById("dueDate").textContent = displayDate(tasks[i].dueDate);

        resultsBody.appendChild(taskRow);
    }

    //Display tasks that have been completed with strikethrough and checkbox checked
    tasks.forEach(task => {
        console.log(tasks)
        if (task.completed == true) {
            document.getElementById("data-row").classList.add("strikeThrough");
            document.getElementById("taskCheck").checked = true;
        }
    });

    countTasks();
}

function displayDate(dateString) {
    let mydate = new Date(dateString)
    let res = ""
    res += mydate.getMonth() + 1
    res += "/"
    res += mydate.getDate()
    res += "/"
    res += mydate.getFullYear()
    return res
}

function editTask(node) {
    let id = node.parentNode.parentNode.children[1].innerText;
    let tasks = getLocalStorage();
    let ids = tasks.map(t => t.id)
    let matchId = "";
    for (let i = 0; i < ids.length; i++) {
        if (ids[i] == id) {
            matchId = ids[i];
        }
    }
    let editedTask = tasks.find(t => t.id == matchId)

    document.getElementById("editID").value = editedTask.id;
    document.getElementById("editTitle").value = editedTask.title;
    document.getElementById("editDueDate").value = displayDate(editedTask.dueDate);
}

function editSave() {
    id = document.getElementById("editID").value;
    let tasks = getLocalStorage();
    let ids = tasks.map(t => t.id);
    let matchId = "";
    for (let i = 0; i < ids.length; i++) {
        if (ids[i] == id) {
            matchId = ids[i];
        }
    }
    let editedTask = tasks.find(t => t.id == matchId);

    editedTask.title = document.getElementById("editTitle").value;
    editedTask.dueDate = document.getElementById("editDueDate").value

    console.log(editedTask.dueDate)

    setLocalStorage(tasks)
    listTasks();
}

//delete an entry
function deleteTask() {
    let tasks = getLocalStorage();
    let cell = this.event.path[3].rowIndex;

    for (let i = 0; i < tasks.length; i++) {
        if (i === cell - 1) {
            tasks.splice(i, 1);
        };
    };

    setLocalStorage(tasks)
    listTasks();
};

function clearTasks() {
    let tasks = getLocalStorage();

    for (let i = 0; i < tasks.length; i++) {
        tasks.splice(i, tasks.length)
    };

    setLocalStorage(tasks);
    listTasks();
};


function completeTask(btn) {
    let tasks = getLocalStorage();
    let checked = isChecked();

    let getID = btn.closest("tr").querySelector("#taskID").innerHTML;
    let thisRow = btn.closest("tr");
    let status = tasks.find(t => t.id == getID);

    if (checked === true) {
        thisRow.classList.add("strikeThrough");
        status.completed = true;

    } else {
        thisRow.classList.remove("strikeThrough");
        status.completed = false;
    }

    setLocalStorage(tasks)

};

function isChecked() {
    let checkBox = document.getElementsByClassName("taskCheck");
    for (let i = 0; i < checkBox.length; i++) {
        if (checkBox[i].checked) {
            return true;
        }
    }
};


function countTasks() {
    let tasks = getLocalStorage()
    document.getElementById("numTasks").innerHTML = tasks.length;
}

function filterCompleted() {
    let tasks = getLocalStorage();
    let done = [];
    for (let i = 0; i < tasks.length; i++) {
        if (tasks[i].completed === true) {
            done.push(tasks[i])
        }
    }
    displayFiltered(done)
};

function filterIncomplete() {
    let tasks = getLocalStorage();
    let notDone = [];
    for (let i = 0; i < tasks.length; i++) {
        if (tasks[i].completed === false) {
            notDone.push(tasks[i])
        }
    }
    displayFiltered(notDone)
}

function displayFiltered(arr) {
    let tasks = getLocalStorage();
    let template = document.getElementById("data-template");
    let resultsBody = document.getElementById("resultsBody");

    resultsBody.innerHTML = "";

    arr.forEach(task => {
        const taskRow = document.importNode(template.content, true)

        taskRow.getElementById("taskID").textContent = task.id;
        taskRow.getElementById("complete").textContent = task.completed;
        taskRow.getElementById("task").textContent = task.title;
        taskRow.getElementById("createdDate").textContent = task.created;
        taskRow.getElementById("dueDate").textContent = displayDate(task.dueDate);

        resultsBody.appendChild(taskRow);
    });

    document.getElementById("numTasks").innerHTML = arr.length;
};


//Generate an ID for each task
function generateID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0,
            v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

function getIdFromParentOfNode(node) {
    // id is 2 parents above node
    let id = node.parentNode.parentNode.getAttribute("data-id")
    return id
}

function getLocalStorage() {
    return JSON.parse(localStorage.getItem("taskArray")) || [];
}

function setLocalStorage(arr) {
    localStorage.setItem("taskArray", JSON.stringify(arr))
}