// Initialize the total value to 0
$(document).ready(function () {
  // Define range descriptions
  var rangeDescriptions = {
    0: "Not at all",
    1: "Can deal with it",
    2: "Close to ideal",
    3: "Ideal",
  };

  // Define the slider elements and their corresponding amount and price fields
  var sliders = ["#slider", "#sliderb", "#sliderc", "#sliderd", "#slidere"];
  var priceFields = ["#price", "#priceb", "#pricec", "#priced", "#pricee"];
  var amountFields = ["#amount", "#amountb", "#amountc", "#amountd", "#amounte"];
  var totalField = "#total";

// Function to calculate and update the cumulative total
function updateTotal() {
  let cumulativeTotal = 0;

  // Fetch the current percentages from the cells
  const percentages = {
    'p1': parseFloat($('.p1').text()) / 100 || 0,
    'p2': parseFloat($('.p2').text()) / 100 || 0,
    'p3': parseFloat($('.p3').text()) / 100 || 0,
    'p4': parseFloat($('.p4').text()) / 100 || 0,
    'p5': parseFloat($('.p5').text()) / 100 || 0,
  };

  // Sum the values of the sliders multiplied by their corresponding percentages
  sliders.forEach(function (slider, index) {
    let sliderValue = $(slider).slider("value");
    cumulativeTotal += sliderValue * (percentages[`p${index + 1}`] || 0);
  });

  // Calculate the cumulative percentage and round down to the nearest integer
  const totalPercentage = Math.floor((cumulativeTotal / 3) * 100);

  // Update the total field
  $(totalField).val(totalPercentage + '%');

  // Add logic to change the color based on the totalPercentage
  if (totalPercentage < 70) {
    $(totalField).css('color', 'red');
  } else {
    $(totalField).css('color', 'green');
  }
}

// Initialize the sliders with their default values and attach event listeners
for (var i = 0; i < sliders.length; i++) {
  // Use a closure to capture the correct index value for each slider
  (function(index) {
    $(sliders[index]).slider({
      range: "min",
      value: 0,
      min: 0,
      max: 3,
      step: 1,
      slide: function (event, ui) {
        var sliderValue = ui.value;
        var previousSliderValue = $(event.target).data('previousValue') || 0; // Store previous value in data attribute

        $(priceFields[index]).val(sliderValue);
        $(amountFields[index]).val(rangeDescriptions[sliderValue]);
        
        // Calculate the change in slider value
        var changeInValue = sliderValue - previousSliderValue;

        // Update the previous value
        $(event.target).data('previousValue', sliderValue);

        // After updating the previous value, call updateTotal function
        setTimeout(function () {
          updateTotal();
        }, 0);
      }
    });
  })(i); // Pass the current index to the closure
}

// Initialize the price fields with "0"
for (var i = 0; i < priceFields.length; i++) {
  $(priceFields[i]).val("0");
}

// Define header mapping for each dropdown value
const headerMapping = {
  'A': { className: 'p1', headerId: 'insightsInformedHeader', headerPrefix: 'Insights informed' },
  'B': { className: 'p2', headerId: 'connectedHeader', headerPrefix: 'Connected' },
  'C': { className: 'p3', headerId: 'intentionalHeader', headerPrefix: 'Intentional' },
  'D': { className: 'p4', headerId: 'differenceHeader', headerPrefix: 'Difference' },
  'E': { className: 'p5', headerId: 'rigorousHeader', headerPrefix: 'Rigorous' }
};

// Function to calculate the total count and display it as a percentage
function calculatePercentage(value) {
  const dropdowns = document.querySelectorAll('.dropdown');
  const totalCount = [...dropdowns].filter(dropdown => dropdown.value === value).length;
  const totalPercentage = (totalCount / dropdowns.length) * 100;
  const totalsCell = document.querySelector(`.${headerMapping[value].className}`);
  totalsCell.textContent = totalPercentage.toFixed(2) + '%';

  // Update the corresponding header
  if (value in headerMapping) {
    const pValue = $(`.${headerMapping[value].className}`).text();
    $(`#${headerMapping[value].headerId}`).text(`${headerMapping[value].headerPrefix} ${pValue}`);
  }
}

// Add event listeners for dropdown changes for each value
['A', 'B', 'C', 'D', 'E'].forEach(value => {
  calculatePercentage(value);
  const dropdowns = document.querySelectorAll('.dropdown');
  dropdowns.forEach(dropdown => {
    dropdown.addEventListener('change', () => {
      calculatePercentage(value);
      updateTotal(); // Call updateTotal here to recalculate the cumulative total
    });
  });
});

// Initial call to set the total on page load
updateTotal();

});
