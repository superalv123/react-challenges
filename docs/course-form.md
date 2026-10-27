Add a form that contains text input fields for the title and meeting times for a course. Then add a link or button on each course card to open the edit form, populated with that course's data. Utilize routing, possibly through something like course/edit/course_code. This project uses Tanstack Router and react-hook-form. 

Don't worry about form submission. There should be a Cancel button, but no Submit button. The form should have an onSubmit() method that does nothing. Clicking the Cancel button should return the user to the main course list. 

Respect clean code principles that allow easy refactoring if needed. For example this means keeping features that can be separated into functions or components outside of app(). 