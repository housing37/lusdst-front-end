document.addEventListener("DOMContentLoaded", function () {
  // Function to open a tab
  function openTab(tabName) {
    // Hide all elements with class="tabcontent"
    var i,
      tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
      tabcontent[i].style.display = "none";
      tabcontent[i].classList.remove("active");
    }

    // Remove the class "active" from all elements with class="tablinks"
    var tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
      tablinks[i].classList.remove("active");
    }

    // Show the current tab, and add an "active" class to the button that opened the tab
    document.getElementById(tabName).style.display = "block";
    document.getElementById(tabName).classList.add("active");
    // Additionally find the button that has the matching data-tab attribute and add the active class
    Array.from(tablinks)
      .find((tab) => tab.getAttribute("data-tab") === tabName)
      .classList.add("active");
  }

  // Attach click event listener to view button
  document.getElementById("view-button").addEventListener("click", function () {
    var telegramHandle = document
      .getElementById("telegram-handle")
      .value.trim(); // Trim any leading or trailing spaces

    // Regular expression to match valid Telegram handle format
    var handleRegex = /^@[A-Za-z0-9_]{5,}$/;

    // Check if the input is empty or doesn't match the valid format
    if (telegramHandle === "" || !telegramHandle.match(handleRegex)) {
      // Display error message for invalid or empty Telegram handle
      document.getElementById("handle-error").textContent =
        "Please enter a valid Telegram handle starting with '@'.";
    } else {
      // Clear any previous error messages
      document.getElementById("handle-error").textContent = "";

      // Simulate fetching user details using AJAX or other means
      // Replace the following lines with actual code to fetch user details
      var userDetails = {
        shills: "User's shills details",
        rates: "User's rates details",
        earnings: "User's earnings details",
      };

      // Display user details box and update tab contents
      document.getElementById("user-details-box").classList.remove("hidden");
      document.getElementById("shills").innerHTML = userDetails.shills;
      document.getElementById("rates").innerHTML = userDetails.rates;
      document.getElementById("earnings").innerHTML = userDetails.earnings;
    }
  });

  // Set default open tab (the first tab as active on page load)
  var tabButtons = document.getElementsByClassName("tablinks");
  if (tabButtons.length > 0) {
    tabButtons[0].click();
  }
});
// Open the video modal
function openVideoModal() {
  var modal = document.getElementById("videoModal");
  modal.style.display = "block";
}

// Close the video modal and stop the video
function closeVideoModal() {
  var modal = document.getElementById("videoModal");
  var video = document.getElementById("modalVideo");
  modal.style.display = "none";
  video.pause();
  video.currentTime = 0;
}
