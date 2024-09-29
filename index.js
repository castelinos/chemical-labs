let data = [];
let tableBodyEl = document.getElementById("table-rows");

const tableMap = {
    'check':'&check;',
    "id": 0,
    "name":"",
    "vendor":"",
    "density":"",
    "viscosity": "",
    "packaging":"",
    "size":"",
    "unit":"",
    "quantity":""
};

const deleteBtn = document.getElementById('delete-btn')
deleteBtn.addEventListener('click', deleteRow);

const addBtn = document.getElementById('add-btn')
addBtn.addEventListener('click', function(){
    addRow()
});

const moveUpBtn = document.getElementById('move-up-btn')
moveUpBtn.addEventListener('click', function(){
    moveRow('up');
});

const moveDownBtn = document.getElementById('move-down-btn')
moveDownBtn.addEventListener('click', function(){
    moveRow('down');
});

const refreshBtn = document.getElementById('refresh-btn')
refreshBtn.addEventListener('click', function(){
    refreshData()
});

const saveBtn = document.getElementById('save-btn')
saveBtn.addEventListener('click', function(){
    saveData(data)
});

const sortHeaders = document.querySelectorAll('th.sortable');
sortHeaders.forEach((header)=>header.addEventListener('click', sortRows));

function enableSelection( event ){

    if( !event ) return;
    let elem = null;
    
    switch( event.type ){
        case 'click':
            elem = event.target.parentElement;
            setSelectedElement( elem );
            break;
        case 'dblclick':
            elem = event.target;
            handleCellEdit( elem );
            break;
        default:
    }
}

function getSelectedElement(){
   return tableBodyEl.querySelector('tr.selected') || tableBodyEl.children[0];
}

function setSelectedElement( row ){
    let currentSelected = getSelectedElement();

    if( currentSelected ) currentSelected.classList.remove('selected');
    if( row ) row.classList.add('selected');
}

async function updateRows( data, flush=false ){

    if( flush ) tableBodyEl.innerHTML='';
    
    if( Array.isArray(data) && data.length > 1 ){
        for (let index = 0; index < data.length; index++) {
            tableBodyEl.appendChild(createRowHTML( data[index] ));
        }
    }
    else{
        tableBodyEl.appendChild( createRowHTML(data));
    }

}

function moveRow( direction ){
    let row = getSelectedElement();
    const currIndex = Array.from(tableBodyEl.children).indexOf(row);
    let adjElem = null,pos = null;

    if( !row ) alert('Please select row');

    if( direction === 'up' ){
        adjElem = row.previousSibling;
        pos = 'afterend';

    }else if( direction === 'down'){
        adjElem = row.nextSibling;
        pos = 'beforebegin';
    }

    if( !adjElem ) return;
    const nextIndex = Array.from( tableBodyEl.children ).indexOf(adjElem);
    
    data.splice(nextIndex, 0, data.splice(currIndex,1)[0] );
    
    let replacedNode = tableBodyEl.replaceChild(row,adjElem);
    row.insertAdjacentElement(pos, replacedNode)
}

function createRowHTML( data ){
    let row = document.createElement('tr');
    
    row.setAttribute('row-index', tableBodyEl.childElementCount);
    row.addEventListener('click', enableSelection);

    for (const key in tableMap) {
        let cell = document.createElement('td');
        cell.setAttribute('cell-name',key);
        cell.addEventListener('dblclick',enableSelection);
        cell.innerHTML = data[key] || tableMap[key];
        row.appendChild(cell);
    }
        
    return row;
}

function deleteRow(){
    const elem = getSelectedElement();
    let rowIndex = Array.from(tableBodyEl.children).indexOf(elem);
    
    const nextSelectElem = elem.previousSibling || elem.nextSibling;
    elem && tableBodyEl.removeChild(elem);
    data.splice(rowIndex,1);
    
    if( nextSelectElem ) setSelectedElement( nextSelectElem );
}

function addRow(){
    let max = data.reduce((prev,curr)=> { return prev.id > curr.id ? prev : curr },0 )
    let rowMap = Object.assign(tableMap);
    rowMap.id = (max.id && !isNaN(max.id)) ? max.id+1 : 0;

    data.push(rowMap);
    updateRows(rowMap);
}

function sortRows( event ){
    const colname= event.target.getAttribute('cell-name');
    let order = event.target.getAttribute('sorted-by');
    order = ( !order || order === 'asc' ) ? 1 : -1

    data = data.sort((a,b)=>{
        return a[colname] > b[colname] ? order * 1 : order * -1;
    });

    order = -order; // toggle the sorting order sequence
    event.target.setAttribute('sorted-by', (order === 1) ? 'asc' : 'desc');
    updateRows(data, true);
}

function handleCellEdit( cellElem ){

    if( !cellElem ) return;

    let editable = document.createElement('input');

    editable.addEventListener('blur',(ev)=>{
        const text = ev.target.value;
        cellElem.removeChild(ev.target);
        cellElem.innerText = text

        let rowIndex = Array.from(tableBodyEl.children).indexOf(cellElem.parentElement);
        let key = cellElem.getAttribute('cell-name');
        
        data[rowIndex][key] = text;
    })

    editable.value= cellElem.innerText;
    cellElem.innerText="";
    cellElem.appendChild(editable);
    editable.focus();

}

async function getData(){
    let res = await( await fetch('./data.json')).json();
    return res;
}

function refreshData(){
    try {
        let data = window.localStorage.getItem('data');
        if( !data ) throw 'No data found';

        data = JSON.parse(data);
        updateRows( data, true );
        
    } catch (error) {
        alert(error.message)
    }
}

function saveData( data ){
    window.localStorage.setItem('data',JSON.stringify(data));
}


/* Execution begins here */
async function init(){
    data = await getData();
    saveData(data)
    updateRows(data);
    setSelectedElement( getSelectedElement());
}

init();

/*  <tr>
    <td>&checkmark;</td>
    <td>1</td>
    <td>${row.name}</td>
    <td>${row.vendor}</td>
    <td>${row.density}</td>
    <td>${row.viscosity}</td>
    <td>${row.packaging}</td>
    <td>${row.size}</td>
    <td>${row.unit}</td>
    <td>${row.quantity}</td>
    </tr> 
*/