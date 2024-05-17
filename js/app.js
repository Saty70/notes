const Addbtn = document.querySelector("#Addbtn");
const Addbtn1 = document.querySelector("#Addbtn1");
const main = document.querySelector("#main");

const saveNotes = () => {
    const notes = document.querySelectorAll(".note");
    const data = [];
    notes.forEach((note) => {
        const notetitle = note.querySelector(".notetitle");
        const textarea = note.querySelector(".textarea");
        const timestamp = note.querySelector(".timestamp").innerText;
        data.push({ text1: notetitle.value, timestamp: timestamp, text: textarea.value });
    });
    if (data.length === 0) {
        localStorage.removeItem("notes");
    } else {
        localStorage.setItem("notes", JSON.stringify(data));
    }
};

Addbtn.addEventListener(
    "click",
    function () {
        addNote();
    }
);
Addbtn1.addEventListener(
    "click",
    function () {
        addNote();
    }
);

const addNote = (text1 = "untitled note", timestamp = new Date().toLocaleString(), text = "") => {
    const note = document.createElement("div");
    note.classList.add("note");
    note.innerHTML = `
        <div class="tool">
            <div class="ltools">
                <textarea class="notetitle">${text1}</textarea>
                <div class="timestamp">${timestamp}</div>
            </div>    
            <div class="toolbtn">
                <i class="save fa-solid fa-floppy-disk" style="color: #d1e2ff;"></i>
                <i class="trash fa-solid fa-trash-can" style="color: #d1e2ff;"></i>
            </div>
        </div>
        <textarea class='textarea'>${text}</textarea>
    `;
    note.querySelector(".trash").addEventListener(
        "click",
        function () {
            note.remove();
            saveNotes();
        }
    );
    note.querySelector(".save").addEventListener(
        "click",
        function () {
            saveNotes();
        }
    );
    note.querySelector(".textarea").addEventListener(
        "focusout",
        function () {
            saveNotes();
        }
    );
    main.prepend(note);  // Change from appendChild to prepend
    saveNotes();
    focusOnTextarea(note.querySelector(".textarea"));
};

// Function to focus on the textarea and place the cursor at the end of the text
const focusOnTextarea = (textarea) => {
    textarea.focus();
    textarea.setSelectionRange(textarea.value.length, textarea.value.length);
};

// Function to focus on the top note's textarea and place the cursor at the end
const focusOnTopNote = () => {
    const firstNoteTextarea = main.querySelector(".note .textarea");
    if (firstNoteTextarea) {
        focusOnTextarea(firstNoteTextarea);
    }
};

(function () {
    const lsNotes = JSON.parse(localStorage.getItem("notes"));
    if (lsNotes === null) {
        addNote();
    } else {
        lsNotes.reverse().forEach((lsNote) => {
            addNote(lsNote.text1, lsNote.timestamp, lsNote.text);
        });
    }
    focusOnTopNote(); // Call focus function after loading notes
})();

const addButton = document.getElementById('Addbtn');
window.addEventListener('scroll', () => {
    if (window.scrollY > 100) {
        addButton.innerHTML = '<i class="fa-solid fa-plus" style="color: #d1e2ff;"></i>';
    } else {
        addButton.innerHTML = '<i class="fa-solid fa-plus" style="color: #d1e2ff;"> </i> Add Note';
    }
});
