Implement an interactive user interface element to let users choose whether to see classes for fall, winter, or spring. Key steps in this task:
A term selector component that holds three button, for Fall, Winter, and Spring respectively.
A term page component that holds the term selector and course list.
A selected term state variable that is initially set to Fall.
Code in the course list component to only show classes that are in the selected term.
Code in the term selector to change the selected term state when a term button is clicked.
This task is done when clicking on the Fall, Winter, or Spring buttons immediately updates the set of classes is displayed. 

Implement this selector element as a component outside of app() or as its own file in order to respect clean code principles that allow easy refactoring if needed. Make the component general, and propagate its options using a string[]. Define a termTypes array to pass in.