// Load Bible Data
fetch('bibles.json')
  .then((response) => response.json())
  .then((data) => {
    window.bibleData = data;
    populateBookDropdown(data);
    setupInputListeners();  // Set up the event listeners after data is loaded
  })
  .catch((error) => console.error("Error loading Bible data:", error));

// Populate Book Dropdown
function populateBookDropdown(data) {
  const bookDropdown = document.getElementById("book");
  data.forEach((book) => {
    const option = document.createElement("option");
    option.value = book.book;
    option.textContent = book.book;
    bookDropdown.appendChild(option);
  });
}

// Set up event listeners for input changes
function setupInputListeners() {
  // Method 1
  document.getElementById("book").addEventListener("change", calculateMethod1);
  document.getElementById("chapter").addEventListener("input", calculateMethod1);
  document.getElementById("time-per-chapter").addEventListener("input", calculateMethod1);
  document.getElementById("daily-reading-minutes1").addEventListener("input", calculateMethod1);

  // Method 2
  document.getElementById("total-pages").addEventListener("input", calculateMethod2);
  document.getElementById("current-page").addEventListener("input", calculateMethod2);
  document.getElementById("time-per-page").addEventListener("input", calculateMethod2);
  document.getElementById("daily-reading-minutes2").addEventListener("input", calculateMethod2);
}

// Calculate Method 1 (Chapters)
function calculateMethod1() {
  const bookName = document.getElementById("book").value;
  const chapter = parseInt(document.getElementById("chapter").value, 10);
  const timePerChapter = parseInt(document.getElementById("time-per-chapter").value, 10);
  const dailyReadingMinutes = parseInt(document.getElementById("daily-reading-minutes1").value, 10);

  if (!bookName || isNaN(chapter) || isNaN(timePerChapter) || isNaN(dailyReadingMinutes)) {
    displayOutput("Please fill all fields for Method 1.", "output1");
    return;
  }

  const book = window.bibleData.find((b) => b.book === bookName);
  if (!book) {
    displayOutput("Book not found.", "output1");
    return;
  }

  // Calculate total time for remaining chapters
  const remainingChapters = book.num_chapters - chapter + 1;
  let totalTimeInMinutes = remainingChapters * timePerChapter;

  // Add time for the remaining books
  const remainingBooks = window.bibleData.slice(window.bibleData.indexOf(book) + 1);
  remainingBooks.forEach((b) => {
    totalTimeInMinutes += b.num_chapters * timePerChapter;
  });

  // Convert total time to hours
  const totalTimeInHours = totalTimeInMinutes / 60;

  // Calculate days based on reading minutes per day
  const totalTimeDays = Math.round(totalTimeInMinutes / (dailyReadingMinutes * 1));

  displayOutput(
    `Total time to finish the Bible (Method 1): ${totalTimeInHours.toFixed(2)} hours (~${totalTimeDays} days at ${dailyReadingMinutes} minutes/day).`,
    "output1"
  );
}

// Calculate Method 2 (Pages)
function calculateMethod2() {
  const totalPages = parseInt(document.getElementById("total-pages").value, 10);
  const currentPage = parseInt(document.getElementById("current-page").value, 10);
  const timePerPage = parseInt(document.getElementById("time-per-page").value, 10);
  const dailyReadingMinutes = parseInt(document.getElementById("daily-reading-minutes2").value, 10);

  if (isNaN(totalPages) || isNaN(currentPage) || isNaN(timePerPage) || isNaN(dailyReadingMinutes)) {
    displayOutput("Please fill all fields for Method 2.", "output2");
    return;
  }

  // Calculate remaining pages
  const remainingPages = totalPages - currentPage;
  const totalTimeInMinutes = remainingPages * timePerPage;

  // Convert total time to hours
  const totalTimeInHours = totalTimeInMinutes / 60;

  // Calculate days based on reading minutes per day
  const totalTimeDays = Math.round(totalTimeInMinutes / (dailyReadingMinutes * 1));

  displayOutput(
    `Total time to finish the Bible (Method 2): ${totalTimeInHours.toFixed(2)} hours (~${totalTimeDays} days at ${dailyReadingMinutes} minutes/day).`,
    "output2"
  );
}

// Display Output
function displayOutput(message, outputId) {
  document.getElementById(outputId).textContent = message;
}
