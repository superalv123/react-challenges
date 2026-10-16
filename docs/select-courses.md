Change the user interface so that clicking on a course card adds it to a list of selected classes. Clicking a course already selected unselects it. Selected classes should highlight in some clear way - In this case change the background color to a form of light green. 

This task requires defining a new state variable to hold the list of selected classes, code to add or remove a class from that list, and code to display a course different depending on whether it is selected.

The task is done when a user can select and unselect any number of classes on the deployed app. 

Respect clean code principles that allow easy refactoring if needed. For example this means keeping features that can be separated into functions or components outside of app(). Respect best practices for keeping state or context (if needed) for lists.