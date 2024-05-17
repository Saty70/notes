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
        const pinned = note.classList.contains("pinned");
        data.push({ text1: notetitle.value, timestamp: timestamp, text: textarea.value, pinned: pinned });
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

const addNote = (text1 = "untitled note", timestamp = new Date().toLocaleString(), text = "", pinned = false) => {
    const note = document.createElement("div");
    note.classList.add("note");
    if (pinned) note.classList.add("pinned");
    note.innerHTML = `
        <div class="tool">
            <div class="ltools">
                <i class="pin fa-solid fa-thumbtack" style="color: #d1e2ff; transform: ${pinned ? 'rotate(0)' : 'rotate(45deg)'};"></i>
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
    setTimeout(() => {
        note.classList.add("visible");
    }, 50);
    
    note.querySelector(".trash").addEventListener(
        "click",
        function () {
            if (note.classList.contains("pinned")) {
                if (!confirm("Are you sure you want to delete this pinned note?")) {
                    return;
                }
            }
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
    note.querySelector(".pin").addEventListener(
        "click",
        function () {
            togglePin(note);
        }
    );
    
    const pinnedNotes = main.querySelectorAll(".note.pinned");
    if (!pinned) {
        // Find the first unpinned note and insert before it
        let unpinnedNote = null;
        for (const child of main.children) {
            if (!child.classList.contains("pinned")) {
                unpinnedNote = child;
                break;
            }
        }
        if (unpinnedNote) {
            main.insertBefore(note, unpinnedNote);
        } else {
            main.appendChild(note);
        }
    } else {
        if (pinnedNotes.length > 0) {
            main.insertBefore(note, pinnedNotes[0]);
        } else {
            main.appendChild(note);
        }
    }
    
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

const togglePin = (note) => {
    const pinnedNotes = main.querySelectorAll(".note.pinned");
    const pinIcon = note.querySelector(".pin");
    if (note.classList.contains("pinned")) {
        note.classList.remove("pinned");
        pinIcon.style.transform = "rotate(45deg)";
        main.appendChild(note);
    } else {
        if (pinnedNotes.length >= 3) {
            alert("You can only pin a maximum of 3 notes.");
            return;
        }
        note.classList.add("pinned");
        pinIcon.style.transform = "rotate(0)";
        main.prepend(note);
    }
    saveNotes();
};

(function () {
    const lsNotes = JSON.parse(localStorage.getItem("notes"));
    if (lsNotes === null) {
        addNote();
    } else {
        lsNotes.reverse().forEach((lsNote) => {
            addNote(lsNote.text1, lsNote.timestamp, lsNote.text, lsNote.pinned);
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
