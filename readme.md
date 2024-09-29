## Chemical Labs
- The chemical labs is built in vanilla Javascript, HTML & CSS. No other frameworks are used.
How it works is the chemical invoice data is fetched from a local JSON file and loaded in the local storage. Also there is a runtime reference data array that is being managed, while the operations on the table row elements is done. 

Fetch from json api => store in local storage & temporary reference array.
While user operates on table elements sync with temporary reference array.
On Save, temporary reference array is saved to local storage
On Refresh button in top right toolbar, data from local storage is loaded on HTML table regardless of changes in table or tempoarary reference array.
So if you didnt save, you can retrieve your last saved data state. 

#### Selecting rows
- A class of "selected" is added to the row which is selected. If not, the first row is automatically shown as selected.

#### Selecting to edit cells
- On double click, the targeted cell is embedded with a input which takes user entered value.
- On losing focus, the td cell destroys the input element and inserts the text value in td cell.
Also each cell has a "cell-name" attribute which identifies the array key it belongs to.
Using the attribute and row index the edited text data is synchronized with reference array data.

#### Adding rows
- When add functionality is triggered, a new row is added to HTML table body children with the help of a row template which helps map cells in its proper place. Also the maximum available id is fetched and incremented, which is then displayed on the appended row. Also the temporary reference array is pushed with new element.

#### Moving rows ( up & down )
- Depending on whether to move up or down, previous or next sibling row is targeted and replaced.The replaced sibling is then inserted in original element's place to show move up/down. Simultaneously the temporary reference data in the array is also swapped to synchronize with the operation done on table row elements.

#### Delete row
- The row which is selected is deleted by referencing the nth child index in table body children and the delete state is synced with the reference array data. However deleting data leaves missing ids in the table which are not filled again.

#### Save and Refresh
- Refresh fetches a copy of the data from window local storage and restructures the table row elements according to the data. Referesh can be used to load last saved state regardless of changes in the table structure.
- Save synchronizes the temporary reference data with the window local storage, so that it can be accessed again if required.

#### Sorting rows ( ASC/DESC )
- On clicking the table header which has a "sortable" class & "cell-name attribute", the temporary reference data is sorted. Once array data is sorted the HTML table rows are updated with sorted data.