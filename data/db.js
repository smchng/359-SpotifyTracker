import * as SQLite from "expo-sqlite/legacy";

// create database
export const db = SQLite.openDatabase("example.db");

// create table
export const createTable = () => {
  db.transaction((tx) => {
    tx.executeSql(
      "CREATE TABLE IF NOT EXISTS my_notes (id INTEGER PRIMARY KEY AUTOINCREMENT, note TEXT)"
    );
  });
};

// select all data frm db
export const selectAll = () => {
  db.transaction((tx) => {
    tx.executeSql(
      "SELECT * FROM my_notes",
      null,
      (txObj, resultSet) => {
        return resultSet.rows._array;
        // setNoteArr(resultSet.rows._array);
        // console.log(resultSet.rows._array);
      },
      (txObj, error) => console.log(error)
    );
  });
};

// insert data
export const insertData = (note) => {
  //console.log(note);
  db.transaction((tx) => {
    tx.executeSql(
      "INSERT INTO my_notes (note) values (?)",
      [note],
      (txObj, resultSet) => {
        //console.log(resultSet.insertId);
        newId = resultSet.insertId;
        return newId;
        //console.log(newId);
        // let prevNotes = [...noteArr]; // Create a copy of the current note array
        // newNotes = prevNotes.push({ id: resultSet.insertId, note: note }); // Append the new note with its auto-generated id
        // return newNotes;
        // setNoteArr(prevNotes); // Update the state with the new note array
        // setNote(""); // Clear the input after adding the note
        // console.log(prevNotes); // Log the updated note array for debugging
      },
      (txObj, error) => console.log(error) // Log any errors
    );
  });
};

// delete data
export const deleteData = (id) => {
  db.transaction((tx) => {
    tx.executeSql(
      "DELETE FROM my_notes WHERE id=?",
      [id], // Delete the note from the SQLite table where the id matches
      (txObj, resultSet) => {
        return resultSet.rows._array;
        // if (resultSet.rowsAffected > 0) {
        //   // Only proceed if a row was affected (i.e., a note was deleted)
        //   let prevNotes = [...noteArr].filter((note) => note.id !== id); // Filter out the note with the specified id
        //   setNoteArr(prevNotes); // Update the state to reflect the deletion
        // }
      },
      (txObj, error) => console.log(error) // Log any errors
    );
  });
};

// edit data
export const editEntry = (id) => {
  db.transaction((tx) => {
    tx.executeSql(
      "SELECT note FROM my_notes WHERE id = ?",
      [id], // Fetch the note based on its ID
      (txObj, resultSet) => {
        return resultSet.rows._array[0].note;
        // setNote(resultSet.rows._array[0].note); // Populate the text input with the fetched note
      },
      (txObj, error) => console.log(error) // Log any errors during the SQL execution
    );
  });
};

// update db
export const updateDB = (noteId, note) => {
  let text = note; // Get the current note text to be updated
  db.transaction((tx) => {
    tx.executeSql(
      "UPDATE my_notes SET note = ? WHERE id = ?", // SQL statement to update the note
      [text, noteId], // Parameters for the query: new note text and ID
      (txObj, resultSet) => {
        return resultSet;
        // if (resultSet.rowsAffected > 0) {
        //   // Check if the update was successful (at least one row affected)
        //   setNoteArr((prevNotes) => {
        //     return prevNotes.map((note) => {
        //       if (note.id === noteId) {
        //         // If the ID matches, update the note
        //         return { ...note, note: text }; // Return a new note object with the updated text
        //       }
        //       return note; // Otherwise, return the note as is
        //     });
        //   });
        //   setNote(""); // Clear the input field after updating
        //   setVisible(false); // Hide the edit modal or input field
        // }
      },
      (txObj, error) => console.log(error) // Log any errors
    );
  });
};
