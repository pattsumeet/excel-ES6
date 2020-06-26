export class TableEditing {
    constructor(table) {
        this.table = table;
        this.tbody = table.querySelector('tbody');
    }

    init() {
        /**Sorting logic */
        this.ths = this.table.querySelectorAll('th');
        this.ths.forEach(th => th.addEventListener('click', (th) => {
            this.sortTable(th.currentTarget.cellIndex);
        }))
        /**Sorting logic ends*/

        this.tds = this.tbody.querySelectorAll('td');
        this.tds.forEach(td => {
            const removeBtn = td.querySelector('.glyphicon-remove'); //handling delete button           
            if(removeBtn) {
                this.removeRow(removeBtn, td.parentNode);
            }
            
            const addBtn = td.querySelector('.glyphicon-plus');  //handling add button          
            if(addBtn) {
                this.addRow(addBtn);
            }
            
            td.setAttribute('contentEditable', true); //handeling edit action
            td.addEventListener('click', event => {
                if(!this.inEdit(td)){                    
                    this.startEdit(td);
                }
            });
        });
    }

    sortTable(n) {
        var table, rows, switching, i, x, y, shouldSwitch, dir, switchcount = 0;
        table = this.table;
        switching = true;
        dir = "asc"; 
        while (switching) {
            switching = false;
            rows = table.rows;
            for (i = 1; i < (rows.length - 1); i++) {
            shouldSwitch = false;
            x = rows[i].getElementsByTagName("TD")[n];
            y = rows[i + 1].getElementsByTagName("TD")[n];
            if (dir == "asc") {
                if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
                shouldSwitch= true;
                break;
                }
            } else if (dir == "desc") {
                if (x.innerHTML.toLowerCase() < y.innerHTML.toLowerCase()) {
                shouldSwitch = true;
                break;
                }
            }
            }
            if (shouldSwitch) {
            rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
            switching = true;
            switchcount ++;      
            } else {
            if (switchcount == 0 && dir == "asc") {
                dir = "desc";
                switching = true;
            }
            }
        }
    }

    removeRow(removeBtn, td) {
        removeBtn.addEventListener('click', (event) => {
            event.stopPropagation();
            // this.tbody.deleteRow(0);
            // td.parentNode.remove();
            td.remove();
        });
    }

    addRow(addBtn) {
        addBtn.addEventListener('click', (event) => {
            event.stopPropagation();
            const tr = document.createElement('tr');
            // td.setAttribute('contenteditable', true);
            let row, newText = null;
            let newCell = Array();
            row = this.table.insertRow(-1);
            for(let i=0;i<5;i++) {
                if(i<=2) {
                    newCell[i] = row.insertCell(i);
                    newCell[i].setAttribute('contentEditable', true);
                    newText = document.createTextNode('New bottom row');
                    newCell[i].appendChild(newText);
                    newCell[i].addEventListener('click', event => {
                        if(!this.inEdit(newCell[i])){
                            this.startEdit(newCell[i]);
                        }
                    });
                }

                else if(i==3) {
                    newCell[i] = row.insertCell(i);
                    const elem = document.createElement('button');
                    elem.className = 'close glyphicon glyphicon-plus';
                    elem.setAttribute('type', 'button');
                    elem.addEventListener('click', event => {
                        this.addRow(elem);
                    });
                    newCell[i].appendChild(elem);
                }

                else if(i==4) {
                    newCell[i] = row.insertCell(i);
                    const elem = document.createElement('button');
                    elem.className = 'close glyphicon glyphicon-remove';
                    elem.setAttribute('type', 'button');
                    elem.addEventListener('click', event => {
                        this.removeRow(elem, row);
                    });
                    newCell[i].appendChild(elem);
                }
            }
        });
    }

    startEdit(td) {
        const currentTd = this.findCurrentTd();
        if(currentTd) {
            this.cancelEdit(currentTd);
        }

        td.className = `in-edit`;
        td.setAttribute('data-old-value', td.innerHTML);
        this.createToolbar(td);
    }

    cancelEdit(td) {
        td.innerHTML = td.getAttribute('data-old-value');
        td.classList.remove('in-edit');
        // this.removeToolbar(td);
    }

    finishEdit(td) {
        td.classList.remove('in-edit');
        this.removeToolbar(td);
    }

    inEdit(td) {
        return td.classList.contains('in-edit');
    }

    createToolbar(td) {
        //create toolbar for inline edit and save option
        const toolbar = document.createElement('div');
        toolbar.className = 'button-toolbar';
        toolbar.setAttribute('contenteditable', false);
        toolbar.innerHTML = `
        <div class='button-wrapper'>
            <button class='btn btn-sm btn-danger btn-cancel'>Cancel</button>
            <button class='btn btn-sm btn-primary btn-save'>Save</button>
        </div>
        `;
        td.appendChild(toolbar);

        const btnCancel = toolbar.querySelector('.btn-cancel');
        const btnSave = toolbar.querySelector('.btn-save');

        btnSave.addEventListener('click', (event) => {
            event.stopPropagation();
            this.finishEdit(td);
        });

        btnCancel.addEventListener('click', (event) => {
            event.stopPropagation();
            this.cancelEdit(td);
        })
    }

    removeToolbar(td) {
        const toolbar = td.querySelector('.button-toolbar');
        toolbar.remove();
    }

    findCurrentTd() {
        return Array.prototype.find.call(this.tds, td => this.inEdit(td));
    }
}