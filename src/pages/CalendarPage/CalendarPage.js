import "./CalendarPage.scss"
import store from "../../modules/store"
import { createStore } from "state-pool"
import {ActionMenu, ActionMenuState} from "../../components/ActionMenu/ActionMenu"
import { readPath, createId, getTouchPos, ConvertListsPath } from "../../modules/helpers"
import TaskTab from "../../components/TaskTab/TaskTab"
import { useState, useEffect } from "react"
import useLongPress from "../../modules/long-press"
import { Timestamp } from "firebase/firestore"
import { useGlobalData } from "../../modules/data-handler"

const pageStore = createStore()

pageStore.setState("action-menu", ActionMenuState())
pageStore.setState("renaming", "")

function getDateIndex(d)
{
    return d.getFullYear()*1000 + d.getMonth()*32 + (d.getDate()-1)
}

function convertRawTimeStamp(o)
{
    return (new Timestamp(o.seconds, o.nanoseconds)).toDate()
}

function CalendarPage()
{
    const [firebaseUserData, setFirebaseUserData] = store.useState("firebase-user-data")
    const [currentPage, setCurrentPage] = store.useState("current-page")
    const [taskEditPath, setTaskEditPath ] = store.useState("task-edit-path")

    const [renaming, setRenaming] = pageStore.useState("renaming")
    const [actionMenu, setActionMenu] = pageStore.useState("action-menu")

    const { readData } = useGlobalData()

    function newTask()
    {
        let {data, setData, target: _task} = readData("Firebase.tasks."+actionMenu.task)

        const newTask = {
            "name": "New Task",
            "metadata": {},
            "tags": {..._task.tags},
            "hasDate": true,
            "date": _task.date
        }

        const taskId = createId(data.tasks)
        data.tasks[taskId] = newTask
        setData(data)

    }

    const menuOptions = {
        "task": {
            "Rename": () => {
                setRenaming(actionMenu.task)
            },
            "Edit": () => {
                setTaskEditPath("Firebase.tasks."+actionMenu.task)
                setCurrentPage("task-edit")
            },
            "New Task": newTask
        },
        "header": {
            "New Task": newTask
        }
    }

    const [dates, setDates] = useState([])

    useEffect(() => {
        const newDates = []

        Object.keys(firebaseUserData.tasks).map((id) => {
            const task = firebaseUserData.tasks[id]

            if (!task.hasDate) {return}

            const dateValue = getDateIndex(convertRawTimeStamp(task.date))

            function createObj()
            {
                return {
                    "value": dateValue,
                    "date": convertRawTimeStamp(task.date),
                    "tasks": []
                }
            }

            for (let i = 0; i < newDates.length; i++)
            {
                if (newDates[i].value > dateValue)
                {
                    const newDateThing = createObj()
                    newDateThing.tasks.push(id)
                    newDates.splice(i, 0, newDateThing)
                    return
                } else if (newDates[i].value == dateValue)
                {
                    newDates[i].tasks.push(id)
                    return
                }
            }
            const newDateThing = createObj()
            newDateThing.tasks.push(id)
            newDates.splice(0, 0, newDateThing)
        })

        setDates(newDates)

    }, [firebaseUserData])

    return <div className="CalendarPage">
        {dates.map((d, i) => {
            return <div className="" key={i}>
                <div className="Source-Tab">{d.date.toLocaleDateString()}</div>
                {d.tasks.map((id) => {
                    return <TaskTab task={firebaseUserData.tasks[id]} key={id} 
                        path={"Firebase.tasks."+id} pageStore={pageStore}/>
                })}
            </div>
        })}
        <ActionMenu state={actionMenu} setState={setActionMenu} options={menuOptions}/>
    </div>
}

export default CalendarPage
