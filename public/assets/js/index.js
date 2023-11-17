document.addEventListener('DOMContentLoaded', () => {
  const listGroup = document.getElementById('list-group');
  const noteTitle = document.querySelector('.note-title');
  const noteTextarea = document.querySelector('.note-textarea');
  const clearBtn = document.querySelector('.clear-btn');
  const saveNoteBtn = document.querySelector('.save-note');
  const newNoteBtn = document.querySelector('.new-note');

  // Function to fetch and display notes
  const displayNotes = async () => {
    try {
      const response = await fetch('/api/notes');
      const data = await response.json();

      // Prevents repeating of previous notes
      listGroup.innerHTML = '';

      // Add content
      data.forEach(note => {
        const listItem = document.createElement('li');
        listItem.className = 'list-group-item';
        listItem.textContent = note.title;

        // Event listener for previous searcg
        listItem.addEventListener('click', () => selectNote(note));
        listGroup.appendChild(listItem);
      });

      // Hide/shows buttons
      hideShowBtn(false);
    } catch (error) {
      console.error('Error fetching and displaying notes:', error);
    }
  };

  // saves note
  const saveNote = async () => {
    const title = noteTitle.value;
    const text = noteTextarea.value;

    if (title && text) {
      try {
        const response = await fetch('/api/notes', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ title, text }),
        });

        if (response.ok) {
          noteTitle.value = '';
          noteTextarea.value = '';
          displayNotes();
        }
      } catch (error) {
        console.error('Error saving note:', error);
      }
    }
  };

  const selectNote = (selectedNote) => {
    noteTitle.value = selectedNote.title;
    noteTextarea.value = selectedNote.text;
    hideShowBtn(true);
  };

  // hides/shows button function
  const hideShowBtn = (showing) => {
    saveNoteBtn.style.display = showing ? 'inline-block' : 'none';
    clearBtn.style.display = showing ? 'inline-block' : 'none';
    newNoteBtn.style.display = showing ? 'none' : 'inline-block';
  };

  // saveBtn and newNoteBtn event listeners
  saveNoteBtn.addEventListener('click', saveNote);
  newNoteBtn.addEventListener('click', () => {
    noteTitle.value = '';
    noteTextarea.value = '';
    hideShowBtn(false);
  });
  clearBtn.addEventListener('click', () => {
    noteTitle.value = '';
    noteTextarea.value = '';
  });

  noteTitle.addEventListener('input', retrievalChange);
  noteTextarea.addEventListener('input', retrievalChange);

  // Function to handle input changes and show/hide buttons
  function retrievalChange() {
    const title = noteTitle.value;
    const text = noteTextarea.value;

    //Hide/shows buttons
    hideShowBtn(title || text);
  }

  displayNotes();
});
