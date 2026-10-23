Make it impossible for a user to select a class that has a time conflict with classes they've already selected. A course card should be selectable only if it does not have a time conflict with any currently selected class. Unselectable courses should be marked in some way, e.g., fainter color or a small "x" somewhere. The visual display should update immediately when classes are selected and unselected.

Two classes have a time conflict if they meet in the same term, have at least one day in common, and their timespans overlap. A class meeting time is either the empty string or a meeting string like MWF 9:00-9:50 or TuTh 14:00-15:20. Any non-empty subset of days is possible. No day appears twice. The start time is always strictly less than the ending time. Times run from 0:00 to 23:59. Classes with an empty meeting string never have a time conflict.

The code for calculating conflicts should be clean and maintainable, broken down into short well-named functions, and placed in a JavaScript utility file that exports only the functions needed by the React component(s) that check for time conflicts. I suggest using calculateConflicts.ts.

This task is done when the deployed app only allows users to select classes with no time conflicts. Make sure unselecting still works! 

Most of the code for detecting time conflicts can be done with very short functions, for specific subtasks such as detecting day overlap and time overlap. I suggest the functions getConflictingCourseList, doCoursesConflict, timeConflictExists, dayOverlapExists, and timeOverlapExists.

Respect clean code principles that allow easy refactoring if needed. For example this means keeping features that can be separated into functions or components outside of app(). 