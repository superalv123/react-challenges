Change the app so that only authenticated users who are administrators can edit class information. 
    
In the React app, you need to add code to

    get database data for the authenticated user, if any
    show a course edit button on each course card only to authenticated users who are administrators

Always include code to render useful information for all the possible values of state variables. Your code will always be asked to render the initial state values, even if for just a fraction of a second. If something goes wrong, you want tell the user something that they can report to you that will help debugging.