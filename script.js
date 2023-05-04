/* 
TO ACCESS UML FOR THIS CODE, PLEASE COPY LINK BELOW \/\/\/
UML Link https://app.diagrams.net/#G1hQ9XtbJMzCDxZ34g9rYTaxdlQFhJrDhD
*/

/*
Heres a PNG if the link doesn't work
https://drive.google.com/file/d/1Aq8g6SuO5rvBG6fBd0fy0PfLsANr-9or/view?usp=sharing
*/

// This class uses task information to format it into a specific object
class ToDoTasks {
  itemName;
  itemPriority;
  dueDateDay;
  dueDateMonth;
  dueDateYear;
  itemCompleted;
  itemCategory;

  constructor(itemName, itemPriority, dueDateDay, dueDateMonth, dueDateYear, itemCompleted, itemCategory) {
    this.itemName = itemName;
    this.itemPriority = itemPriority;
    this.dueDateDay = dueDateDay;
    this.dueDateMonth = dueDateMonth;
    this.dueDateYear = dueDateYear;
    this.itemCompleted = itemCompleted;
    this.itemCategory = itemCategory;
  }
}
//--------------------------
//ADDING DATA AND SHOWING TASK
//--------------------------

// This class handles all of the user's input and correctly formats them as objects and appropriately displays them 
class AddTask {
  buttonSubmit;
  name;
  counter = 0;

  // This array stores all of the object literals as elements (STORAGE)
  arrayOfTaskLiterals = [];
  
  constructor(name) {
    this.buttonSubmit = document.getElementById("buttonSubmit");
    this.buttonSubmit.addEventListener('click', () => this.getData());
    this.name = name;
    this.parentEntry = document.getElementById('output');
    this.parentEntry.addEventListener('click', () => this.getId());
    this.priorityConfirm = document.getElementById('filterPrior');
    this.priorityConfirm.addEventListener('click', () => this.prioritySubmit())
  this.changeButtonElement = document.getElementById("buttonComplete");
    this.changeButtonElement.addEventListener('click', () => this.handleChangeButtonClick());
  }

  // Priority Filter Method. Depending on which priority filter is selected, it will run a method in this class that displays the appropriate results.
  prioritySubmit()
  {
    if (this.changeButtonElement.innerText === "Show Completed Tasks"){
            if (priorityFilter.value === 'none')
      {
         this.displaySpecificTasks(this.arrayOfTaskLiterals);
      }
      else if (priorityFilter.value === 'minimal')
      {
        this.displaySpecificTasks(this.findMinimalPriorityTasks());
      }
      else if (priorityFilter.value === 'low')
      {
        this.displaySpecificTasks(this.findLowPriorityTasks());
      }
      else if (priorityFilter.value === 'medium')
      {
        this.displaySpecificTasks(this.findMediumPriorityTasks());
      }
      else if (priorityFilter.value === 'high')
      {
        this.displaySpecificTasks(this.findHighPriorityTasks());
      }
    }
    else{
      alert("You cannot filter completed tasks")
    }
  }

  displayTask(name, priority, dayDue, monthDue, yearDue, category) {
    let otherEntries = document.createElement("li");
    otherEntries.setAttribute('id', 'checkTask' + ' ' + this.counter);
    
    // The line below will show on the list what will be added... (So long as it fits the desired parameter of completed/to do)
    otherEntries.innerText = name + " || Task Priority: " + priority + " || Due Date: " + monthDue + ' ' + dayDue + ", " + yearDue + " || " + category;
    this.parentEntry.appendChild(otherEntries);
    // The line below sets all the tasks into an array.
    let items = document.querySelectorAll('#checkTask');
    let incompleteTask = [];
    for (let i = 0; i < items.length; i++) {
      incompleteTask.push(items[i].innerHTML);
    }
    
    //Stores local array into a global one, updated everytime a new task is added.
    this.counter++;
  }

  // This method runs when a specific task is selected. This method takes the id of the task and changes the itemCompleted boolean and updates the paragraph display. 
  getId() {
    this.counter--;
    let selectedId = event.srcElement.id;
    
    selectedId = Number(selectedId.replace('checkTask ', ''));
    
    if (this.changeButtonElement.innerText === "Show Completed Tasks")
    {
      this.arrayOfTaskLiterals[selectedId].itemCompleted = true;
      this.displayAllTasks();
      if (document.getElementById('output').children.length === 1)
      {
        if(this.counter < 0)
        {
          this.counter = 0;
        }
        this.counter = 0;
      }
    }
    else{
      this.arrayOfTaskLiterals[selectedId].itemCompleted = false;
      this.displayCompletedTasks();
      if (document.getElementById('output').children.length === 1)
      {
        if(this.counter < 0)
        {
          this.counter = 0;
        }
        this.counter = 0;
      }
    }

    // This new instance of the FormatCells class updates the calendar so completed tasks do not show up
  let currentDay = new Date(Number(document.getElementById('yearDisplay').innerText),             MonthFormat.monthNumber(document.getElementById('monthDisplay').innerText), 1)
  let currentDayObject = new FormatCells(currentDay);
FormatCells.formatMonths(currentDayObject.firstDay, currentDayObject.monthLength, currentDayObject.currentYear, currentDayObject.currentMonth);
  }

  // This method obtains the user input and formats the information nicely. This method also confirms if the inputted information is valid
  getData() {
    if (this.changeButtonElement.innerText === "Show Completed Tasks"){
      let nameTask = document.getElementById('taskName').value;
      let dayDue = document.getElementById('inputDayDueDate').value;
      let monthDueInput = document.getElementById('inputMonthDueDate').value;
      let yearDue = document.getElementById('inputYearDueDate').value;
      let priorityLevel = document.getElementById('priority').value;
      let taskCategory = document.getElementById('taskCategory').value;
      
      let monthInteger;
      
      let taskPriority = 0;
      let completedTask = false;
  
      let maxDay = MonthFormat.findMonthLength(monthInteger, yearDue);
  
  
      if (priorityLevel === 'minimal') {
        taskPriority = 0;
      }
      else if (priorityLevel === 'low') {
        taskPriority = 1;
      }
      else if (priorityLevel === 'medium') {
        taskPriority = 2;
      }
      else if (priorityLevel === 'high') {
        taskPriority = 3
      }
      else {
        alert('Choose a lvl of priority');
      }
  
      //Checks if user is actually typing info down, if only valid will the program continue
      // Do not modify this conditional statement, it currently works with the month input as a string
      if (nameTask !== '' && dayDue !== '' && this.monthDueOutput !== '' && yearDue !== '' && taskCategory !== '' && (monthDueInput === 'January' || monthDueInput === 'February' || monthDueInput === 'March' || monthDueInput === 'April' || monthDueInput === 'May' || monthDueInput === 'June' || monthDueInput === 'July' || monthDueInput === 'August' || monthDueInput === 'September' || monthDueInput === 'October' || monthDueInput === 'November' || monthDueInput === 'December')) {
        if (!isNaN(dayDue) && !isNaN(yearDue)) {
          if (yearDue <= 2100 && yearDue >= 2022 && dayDue >= 0 && dayDue <= maxDay) {
            if (priorityFilter.value === 'none'){
              this.displayTask(nameTask, priorityLevel, dayDue, monthDueInput, yearDue, taskCategory);
              let newItem = new ToDoTasks(nameTask, taskPriority, dayDue, monthDueInput, yearDue, completedTask, taskCategory);
             let currentDay = new Date(Number(document.getElementById('yearDisplay').innerText), MonthFormat.monthNumber(document.getElementById('monthDisplay').innerText), 1)
              let currentDayObject = new FormatCells(currentDay);
FormatCells.formatMonths(currentDayObject.firstDay, currentDayObject.monthLength, currentDayObject.currentYear, currentDayObject.currentMonth);
  // Saves new task inputs into an array
              
              this.arrayOfTaskLiterals.push(newItem);
  
              // Clearing all the input fields when a task is added
              document.getElementById('taskName').value = '';
              document.getElementById('inputDayDueDate').value = '';
              document.getElementById('inputMonthDueDate').value = '';
              document.getElementById('inputYearDueDate').value = '';
              document.getElementById('taskCategory').value = '';
            }
            else {
              alert('Please Remove The Priority Filter');
            }
          }
          else {
            alert('please enter proper date');
          }
        }
        else {
          alert('Please Enter A #');
        }
      }
      else {
        alert('Please fill all the information correctly');
      }
    }
  else{
    alert('Please switch to "To Do List Tasks"');
  }

  // This new instance of FormatCells updates the calendar display
  let currentDay = new Date(Number(document.getElementById('yearDisplay').innerText),             MonthFormat.monthNumber(document.getElementById('monthDisplay').innerText), 1)
  let currentDayObject = new FormatCells(currentDay);
FormatCells.formatMonths(currentDayObject.firstDay, currentDayObject.monthLength, currentDayObject.currentYear, currentDayObject.currentMonth);
  }
  // These methods sort the tasks based on their priority. The tasks are saved into 1 of 4 arrays, depending on their priority level. 
  findMinimalPriorityTasks() {
    let minimalPriorityTasks = [];
    for (let i = 0; i < this.arrayOfTaskLiterals.length; i++) {
      if (this.arrayOfTaskLiterals[i].itemPriority === 0) {
        minimalPriorityTasks.push(this.arrayOfTaskLiterals[i]);
      }
    }
    return minimalPriorityTasks;
  }
  
  // Finds all of the low priority tasks in the array of task literals (this.arrayOfTaskLiterals)
  findLowPriorityTasks() {
    let lowPriorityTasks = [];
    for (let i = 0; i < this.arrayOfTaskLiterals.length; i++) {
      if (this.arrayOfTaskLiterals[i].itemPriority === 1) {
        lowPriorityTasks.push(this.arrayOfTaskLiterals[i]);
      }
    }
    return lowPriorityTasks;
  }

  // Finds all of the Medium priority tasks in the array of task literals (this.arrayOfTaskLiterals)
  findMediumPriorityTasks() {
    let mediumPriorityTasks = [];
    for (let i = 0; i < this.arrayOfTaskLiterals.length; i++) {
      if (this.arrayOfTaskLiterals[i].itemPriority === 2) {
        mediumPriorityTasks.push(this.arrayOfTaskLiterals[i]);
      }
    }
    return mediumPriorityTasks;
  }
  
  // Finds all of the High priority tasks in the array of task literals (this.arrayOfTaskLiterals)
  findHighPriorityTasks() {
    let highPriorityTasks = [];
    for (let i = 0; i < this.arrayOfTaskLiterals.length; i++) {
      if (this.arrayOfTaskLiterals[i].itemPriority === 3) {
        highPriorityTasks.push(this.arrayOfTaskLiterals[i]);
      }
    }
    return highPriorityTasks;
  }

  // Reformats the body paragraph to have a list of all the existing tasks using the arrayOfTaskLiterals array
  displayAllTasks()
  {
    document.getElementById('output').innerHTML = '';
    
    for(let i = 0; i < this.arrayOfTaskLiterals.length; i++)
      {
        if (this.arrayOfTaskLiterals[i].itemCompleted === false)
        {
          this.displayTask(this.arrayOfTaskLiterals[i].itemName, this.arrayOfTaskLiterals[i].itemPriority, this.arrayOfTaskLiterals[i].dueDateDay, this.arrayOfTaskLiterals[i].dueDateMonth, this.arrayOfTaskLiterals[i].dueDateYear, this.arrayOfTaskLiterals[i].itemCategory);
        }
      }
  }
  
  // Uses the methods above as a parameter to display tasks with a specific priority
  displaySpecificTasks(specificArray)
  {
    document.getElementById('output').innerHTML = '';
    for(let i = 0; i < specificArray.length; i++)
      {
        if (specificArray[i].itemCompleted === false)
        {
          this.displayTask(specificArray[i].itemName, specificArray[i].itemPriority, specificArray[i].dueDateDay, specificArray[i].dueDateMonth, specificArray[i].dueDateYear, specificArray[i].itemCategory);
        }
      }
  }

  // This method is called when all of the uncompleted tasks should be outputted (without any filters)
  displayCompletedTasks()
  {
    document.getElementById('output').innerHTML = '';
    for(let i = 0; i < this.arrayOfTaskLiterals.length; i++)
      {
        if (this.arrayOfTaskLiterals[i].itemCompleted === true)
        {
          this.displayTask(this.arrayOfTaskLiterals[i].itemName, this.arrayOfTaskLiterals[i].itemPriority, this.arrayOfTaskLiterals[i].dueDateDay, this.arrayOfTaskLiterals[i].dueDateMonth, this.arrayOfTaskLiterals[i].dueDateYear, this.arrayOfTaskLiterals[i].itemCategory); 
        }
      }
  }

  // This method finds all of the tasks that have the item category that is put in the input field
  findSpecificCategories()
  {
    let specificCategoryFound = [];
    for (let i = 0; i<this.arrayOfTaskLiterals.length; i++)
      {
        if (document.getElementById('filterInput').value === this.arrayOfTaskLiterals[i].itemCategory)
        {
          specificCategoryFound.push(this.arrayOfTaskLiterals[i]);
        }
      }
    return specificCategoryFound;
  }
  
    
  // This method displays all of the tasks that share the same category that is being looked for. This function is the function that immediately runs as an onclick with the button next to the text field at the top of the page
  displayCategoryFilter()
  {
    document.getElementById('output').innerHTML = '';
    for(let i = 0; i < this.findSpecificCategories().length; i++)
      {
        if (this.findSpecificCategories()[i].itemCompleted === false)
        {
          this.displayTask(this.findSpecificCategories()[i].itemName, this.findSpecificCategories()[i].itemPriority, this.findSpecificCategories()[i].dueDateDay, this.findSpecificCategories()[i].dueDateMonth, this.findSpecificCategories()[i].dueDateYear, this.findSpecificCategories()[i].itemCategory);
        }
      }
    document.getElementById('filterInput').value = '';
  }
//--------------------------
// SWITCHING FROM COMPLETED AND TO DO
//--------------------------

  // This method runs when changing the list from to-do tasks and completed tasks. Depending on what the innerText of the button is, it will show the appropriate tasks
  handleChangeButtonClick() {
    this.counter = 0;
    if (this.changeButtonElement.innerText === "Show Completed Tasks") {
      this.changeButtonElement.innerText = "Show To Do List";
      this.displayCompletedTasks();
    }

    else if (this.changeButtonElement.innerText === "Show To Do List") {
      this.changeButtonElement.innerText = "Show Completed Tasks";

      this.displayAllTasks();
    }
  }
}

//--------------------------
// FORMATTING GRAPHIC CALENDAR
//--------------------------

// This class adds an event listener to a specific cell based on the index ID that is passed in. This index ID refers to a specific HTML div
class Cell {
  #index;
  idNumber;
  constructor(indexId) {
    this.#index = document.getElementById(indexId);
    this.idNumber = indexId;
  }
}

// This class initializes all of the cells with a 2d array
class CalendarLayout {
  #cells;
  constructor() {
    this.#cells = [];
    this.indices = [];

    for (let i = 0; i < 7; i++) {
      this.#cells.push([]);
      this.indices.push([]);

      for (let p = 0; p < 6; p++) {
        let cell = new Cell(i * 6 + p);
        this.#cells[i].push(cell);
      }
    }
  }
}
// Converts data into months and validates it
class MonthFormat {

  // Defining Instances
  // This is a static property so it can easily be accessed for the FormatCells class
  static monthLength = 0;
  constructor() {
    this.day = new Date();
    this.month = this.day.getMonth();
    this.year = this.day.getFullYear();
    this.nextButton = document.getElementById('nextMonthButton');
    this.nextButton.addEventListener('click', () => this.nextMonthClicked());
    this.previousButton = document.getElementById('previousMonthButton');
    this.previousButton.addEventListener('click', () => this.previousMonthClicked());
    this.listOfMonths = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  }

  // This static method can be used to convert months (upper or lower cased) into an integer. These integers can then be easily used for conditional statements
  static monthNumber(month){
    let monthNumericalValue;
    if (month === "January" || month === "january"){
      monthNumericalValue = 0
    }
    else if (month === "February" || month === "february"){
      monthNumericalValue = 1
    }
    else if (month === "March" || month === "march"){
      monthNumericalValue = 2
    }
    else if (month === "April" || month === "april"){
      monthNumericalValue = 3
    }
    else if (month === "May" || month === "may"){
      monthNumericalValue = 4
    }
    else if (month === "June" || month === "june"){
      monthNumericalValue = 5
    }
    else if (month === "July" || month === "july"){
      monthNumericalValue = 6
    }
    else if (month === "August" || month === "august"){
      monthNumericalValue = 7
    }
    else if (month === "September" || month === "september"){
      monthNumericalValue = 8
    }
    else if (month === "October" || month === "october"){
      monthNumericalValue = 9
    }
    else if (month === "November" || month === "november"){
      monthNumericalValue = 10
    }
    else if (month === "December" || month === "december"){
      monthNumericalValue = 11
    }
    return monthNumericalValue;
  }
  // Find how long the current month 
  // This method and the monthLength value are static properties so they can easily be accessed without initializing an object in my formatMonth Class
  static findMonthLength(month, year) {
    if (month === 3 || month === 5 || month === 8 || month === 10) {
      this.monthLength = 30;
    }
    else if (month === 0 || month === 2 || month === 4 || month === 6 || month === 7 || month === 9 || month === 11) {
      this.monthLength = 31;
    }
    else if (month === 1 && year % 4 === 0 && year !== 2100) {
      this.monthLength = 29;
    }
    else if (month === 1 || month === 1 && year === 2100) {
      this.monthLength = 28;
    }
    return (this.monthLength);
  }
  // The next two functions will be used to change the month displayed when you click the next/previous arrows
  previousMonthClicked() {
    // This variable will store the first day of the current month which will then be used to format the cells accordingly
    let newDateObject;
    if (this.month !== 0) {
      this.month = this.month - 1;
    }
    else if (this.month === 0 && this.year !== 2022) {
      this.month = 11;
      this.year = this.year - 1;
    }
    document.getElementById("monthDisplay").innerText = this.listOfMonths[this.month];
    document.getElementById("yearDisplay").innerText = this.year;

    MonthFormat.clearTextValues();
    newDateObject = new FormatCells(new Date(this.year, this.month, 1));
    FormatCells.formatMonths(newDateObject.firstDay, newDateObject.monthLength, newDateObject.currentYear, newDateObject.currentMonth);
  }
  
  // Changes the month, year, and cells when the next month button is clicked
  nextMonthClicked() {
    let newDateObject;
    if (this.month !== 11) {
      this.month = this.month + 1;
    }
    else if (this.month === 11 && this.year !== 2100) {
      this.month = 0;
      this.year = this.year + 1;
    }
    document.getElementById("monthDisplay").innerText = this.listOfMonths[this.month];
    document.getElementById("yearDisplay").innerText = this.year;

    // Clearing up all the cells before formating the cells
    MonthFormat.clearTextValues();

    // Declaring an object using the new current month and year
    newDateObject = new FormatCells(new Date(this.year, this.month, 1));
    
    // Format the cells properly depending on what the first day of the month is and how many days exist in that month
    FormatCells.formatMonths(newDateObject.firstDay, newDateObject.monthLength, newDateObject.currentYear, newDateObject.currentMonth);
  }
  // This method clears up all of the paragraphs in all the cells so it can be initialized correctly
  static clearTextValues() {
    for (let i = 0; i < 7; i++) {
      for (let j = 0; j < 6; j++) {
        document.getElementById('0' + ((i * 6) + j)).innerText = '';
      }
    }
  }
}
// This class is used to place the correct day numbers into the cells depending on the year, month, and month length
class FormatCells {
  constructor(currentDate) {
    this.currentDate = currentDate;
    this.currentYear = currentDate.getFullYear();
    this.currentMonth = currentDate.getMonth();
    this.firstDay = currentDate.getDay();
    this.monthLength = MonthFormat.findMonthLength(this.currentMonth, this.currentYear);
  }
  // This static method adds incrementing numbers starting from 1 to each progressive cell
  static formatMonths(firstDay, monthLength, currentYear, currentMonth) 
  {
    for (let i = 0; i < 7; i++) {
      for (let j = 0; j < 6; j++) {
        if (i * 6 + j + 1 - firstDay > 0 && i * 6 + j + 1 - firstDay <= monthLength) {
          document.getElementById('0' + ((i * 6) + j)).innerText = i * 6 + j + 1 - firstDay;
        }
        // Assigns an icon to the selcted day user submitted
        for(let k = 0; k < active.arrayOfTaskLiterals.length; k++)
        {
          if (document.getElementById('0' + ((i * 6) + j)).innerText === '' + active.arrayOfTaskLiterals[k].dueDateDay && currentYear === Number(active.arrayOfTaskLiterals[k].dueDateYear)  && currentMonth === MonthFormat.monthNumber(active.arrayOfTaskLiterals[k].dueDateMonth) && active.arrayOfTaskLiterals[k].itemCompleted === false)
          {
            document.getElementById('0' + ((i * 6) + j)).innerText +=  '\n ⬤';
          }
        }
      }
    }
  }
}


//-----------------Instance Initialization-------------------------//
const active = new AddTask();
// This object is an instance of the FormatCells class, which is needed to initially display a month
const fixYears = new FormatCells(new Date(2022, 03, 1));
FormatCells.formatMonths(fixYears.firstDay, fixYears.monthLength, fixYears.currentYear, fixYears.currentMonth);

//Couple of Constants to call said classes  
const calendar = new CalendarLayout();
const changeMonths = new MonthFormat;
//------------------------------------------------------------------//