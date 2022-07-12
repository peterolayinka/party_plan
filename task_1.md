# Answer to Task 1 - Digital Workflows

## If I wanted to change the workflow by adding an extra step after the stirring step, but before the summary, what would I have to do?

-   You will need to create/add a new block/step in the steps section (order of the creation might not be important)
-   Add the newly created step key name in the flow section and place it in the third row while summary key should be placed in the fourth row.

## When adding the iced tea mix to the flask, we also want to show the user the target weight, as defined at the beginning of the workflow. How would you accomplish this?

-   In the description for adding ice tea, add a breakpoint `<br />` after the Delta weight section.
-   and make a new header in the format `### Target Weight: {{TargetWeight}}`

## Regarding the screencast and line 146 of the template: What’s the value of the “data_point.qty” in that specific example?

-   The value for `data_point.qty` is `9.69g` which was set to `StableWeight` after the command `get_weight` was executed.

## Please explain what happens when the timer runs out on its own vs. when the user stops the timer manually

-   When the timer gets stopped or completed the value of the stirrer status is changed to 0 and the substep is marked completed because but `on_timer_stop` annd `on_timer_complete` is checked in the same block and both have the `send_command`.

**Assessment was started around 3:00pm WAT**
