
function getTasks(){
    return fetch("http://localhost:3000/tasks")
    .then(res=>res.json())
}
/**
 * 
 * @param {string} title 
 * @returns <Promises>
 */
function addTask(title){
     const payload ={
        title: title,
        status: false
     };
     return fetch("http://localhost:3000/tasks",{
        method: "POST",
        headers:{
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
     })
}

function removeTask(id){
    return fetch(`http://localhost:3000/tasks/${id}`,{
        method: "DELETE",
    })
    .then(res=>res.json())

}

function toggleStatusTask(id,status){
    const payload = {
        status: status,
    }
    return fetch(`http://localhost:3000/tasks/${id}`,{
        method: "PATCH",
        headers:{
            'Content-Type':'application/json'
        },
        body: JSON.stringify(payload)
    })
    .then(res=>res.json())
}

/*
   input: array of tasks
*/
function renderDOM(tasks,targetID){
    const cards = [];
    for(const task of tasks){
        const taskCard=createCard(task);
        cards.push(taskCard);
    }
    const target = document.getElementById(targetID);
    target.innerHTML = null;
    target.append(...cards);
}

/**
 * 
 * @param {*} task -  task object
 * @returns  HTML Element which contains task info
 */
function createCard(task){
    const div = document.createElement("div");

    const title = document.createElement("h3");
    const toggleStatusBtn = document.createElement("button");
    const deleteBtn = document.createElement("button")

    div.style.display = "flex";
    div.style.gap = "1rem";

    title.textContent = `${task.title} - ${task.status}`;

    toggleStatusBtn.textContent = "TOGGLE";
    deleteBtn.textContent = "DELETE";

    deleteBtn.addEventListener("click",()=>{
        handleDelete(task.id)
    });

    toggleStatusBtn.addEventListener("click",()=>{
        handleToggle(task.id,!task.status)
    })

    div.append(title,toggleStatusBtn,deleteBtn)
    return div
}

window.addEventListener("load",function(){
    // 1. retreive all tasks
    // 2. add it to the UI using renderDOM
    getTasks().then(res=>{
        renderDOM(res,"container")
    })
    .catch(err=>{
        // ! should manage errors
        console.log(err)
    })

    const addBtn = document.getElementById("btn-add");
    addBtn.addEventListener("click",handleAdd);
})

async function handleAdd(){
    try{

        const title = document.getElementById("input").value;
        const response= await addTask(title)
        
        // *success
        if(response){
            const tasks =await getTasks();
            renderDOM(tasks,"container");
        }
    }
    catch(err){
        // ! should manage errors
        console.log(err)
        alert('Something went wrong')
    }
}

async function handleDelete(id){
    try{
        const response = await removeTask(id)
        // *success
        if(response){
            const tasks = await getTasks();
            renderDOM(tasks,"container");
        }
    }
    catch(err){
        // ! should manage errors
        console.log(err)
        alert('Something went wrong')
    }
}

async function handleToggle(id,status){
    try{
        const response = await toggleStatusTask(id,status)
        // *success
        if(response){
            const tasks = await getTasks();
            renderDOM(tasks,"container");
        }
    }
    catch(err){
        // ! should manage errors
        console.log(err)
        alert('Something went wrong')
    }
}