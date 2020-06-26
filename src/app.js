import './scss/style.scss';
import { TableEditing } from './tableEditing';

const editing = new TableEditing(document.querySelector('table'));

editing.init();
