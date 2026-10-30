Add code to check that the form data is valud course data and give user feedback about which fields have bad data.

This involves define a type schema for course data and a validator function that can be used a resolver in the form. At a minimum:

the course title must be at least two characters, e.g., "AI" would be accepted but not "X"
the term must be the string Fall, Winter, Spring, or Summer
the course number must be a string that is a number with an optional section, e.g., "213-2"
the meeting time must be either the empty string or a legal meeting time with one or more days and a non-empty timespan. A class meeting time is either the empty string or a meeting string like MWF 9:00-9:50 or TuTh 14:00-15:20. Any non-empty subset of days is possible. No day appears twice. The start time is always strictly less than the ending time. Times run from 0:00 to 23:59.

Helpful messages should appear next to form fields with invalid data, such "must contain days and start-end, e.g., MWF 12:00-13:20". 

We are using zodResolver.

Respect clean code principles that allow easy refactoring if needed. For example this means keeping features that can be separated into functions or components outside of app(). 