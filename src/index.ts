import '../style/default.scss'
import * as $ from 'jquery';
import 'jquery-ui-bundle';
import 'jquery-ui-bundle/jquery-ui.min.css';
import EmployeeOrgApp from './EmployeeOrgApp'
import { Employee } from "./type";

$(document).ready(function(){
    const ceo: Employee = {
        uniqueId: 1,
        name: "Mark Zuckerberg",
        subordinates: [],
    };
    const app = new EmployeeOrgApp(ceo);



    const dragAndDrop = () => {
        let dragId: number | string | null = null;
        let dropId: number | string | null = null
        $(".employee").droppable({
            over: function( event, ui ) {
                $(this).css({
                    background: 'green',
                    color: 'white'
                })
            },
            out: function( event, ui ) {
                $(this).css({
                    background: 'white',
                    color: 'black'
                })            
            },
            drop: function( event, ui ) {
                $(this).css({
                    background: 'white',
                    color: 'black'
                })    
                dropId = $(this).attr('id').split('-').pop()
                app.move(Number(dragId), Number(dropId));
                renderTree(app.ceo)
            },
        });
        $(".employee").draggable({
            drag: function( event, ui ) {
                $(this).css({
                    position: 'relative',
                    zIndex: 3,
                    background: 'pink',
                    color: 'white'
                })
                dragId = $(this).attr('id').split('-').pop()
                console.log('dragId',dragId)
            },
            revert: true,
            stop:function( event, ui ) {
                $(this).css({
                    background: 'white',
                    color: 'black'
                })
            }
        });
    }

    const renderSubordinate = (list: Employee[]) => {
        let result = '';
        list.forEach((item: Employee) => {
            result = result + `
                <div class="e-container">
                    <div class="employee" id="employee-${item.uniqueId}">
                        ${item.name}
                    </div>
                    ${item.subordinates.length !== 0 ? `
                        <div class="ordinates">
                            ${renderSubordinate(item.subordinates)}
                        </div>
                    ` : ''}
                </div>
            `
        })
        return result;
    }

    const renderTree = (root: Employee) => {
        console.log('app.ceo', root)
        $("#container").empty()
        root.subordinates.forEach((employee: Employee) => {

            $("#container").append(`
                <div class="sub" id="sub-${employee.uniqueId}">
                    <div class="e-container">
                        <div class="employee" id="employee-${employee.uniqueId}">
                            ${employee.name}
                        </div>
                        <div class="ordinates">
                            ${renderSubordinate(employee.subordinates)}
                        </div>
                    </div>
                </div>
            `)
        })
        dragAndDrop()
    }

    $("#employee-1").text(app.ceo.name)

    $("#enter-employee-form").submit((e) => {
        e.preventDefault();
        const name = $('#name-input').val()
        if (name !== '') {
            app._addStaff(name.toString())
            $('#name-input').val('')
            renderTree(app.ceo)
        }
    })

    $("#redo").click((e) => {
        app.redo()
        setTimeout(() => {
            renderTree(app.ceo);
        }, 200)
    })

    $("#undo").click((e) => {
        app.undo()
        setTimeout(() => {
            renderTree(app.ceo);
        }, 200)
    })
});

