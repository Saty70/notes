const Addbtn = document.querySelector("#Addbtn")
const Addbtn1 = document.querySelector("#Addbtn1")
const main = document.querySelector("#main")

const saveNotes = () =>{
    const notes=document.querySelectorAll(".note textarea")
    const data = []
    notes.forEach(
        (note)=>{
            data.push(note.value)
        }
    )
    if(data.length===0){
        localStorage.removeItem("notes")
    }
    else{
        localStorage.setItem("notes",JSON.stringify(data))
    }
}

Addbtn.addEventListener(
    "click",
    function(){
        addNote()
    }
);
Addbtn1.addEventListener(
    "click",
    function(){
        addNote()
    }
);



    /*<div class="note">
                <div class="tool">
                    <i class="fa-solid fa-floppy-disk" style="color: #d1e2ff;"></i>
                    <i class="fa-solid fa-trash-can" style="color: #d1e2ff;"></i>
                </div>
                <textarea></textarea>
            </div>
        </div>*/

    const addNote = (text = "") =>{
        const note = document.createElement("div");
        note.classList.add("note")
        note.innerHTML = `
        <div class="tool">
                    <i class="save fa-solid fa-floppy-disk" style="color: #d1e2ff;"></i>
                    <i class="trash fa-solid fa-trash-can" style="color: #d1e2ff;"></i>
                </div>
                <textarea>${text}</textarea>
        `
        note.querySelector(".trash").addEventListener(
            "click",
            function(){
                note.remove()
                saveNotes()

            }
        )
        note.querySelector(".save").addEventListener(
            "click",
            function(){
                saveNotes()
            }
        )
        note.querySelector("textarea").addEventListener(
            "focusout",
            function(){
                saveNotes()
            }
        )
        main.appendChild(note)
        saveNotes()
    }

    (
        function () {
            const lsNotes = JSON.parse(localStorage.getItem("notes"))
             if(lsNotes===null)
             {
                addNote()
             }
             else{
                lsNotes.forEach(
                    (lsNote) => {
                        addNote(lsNote)
                    }
                )
             }
            }
    )()


    const addButton = document.getElementById('Addbtn');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            addButton.innerHTML = '<i class="fa-solid fa-plus" style="color: #d1e2ff;"></i>';
        } else {
            addButton.innerHTML = '<i class="fa-solid fa-plus" style="color: #d1e2ff;"> </i> Add Note';
        }
    });
    