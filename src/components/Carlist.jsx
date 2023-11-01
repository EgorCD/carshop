import { useState, useEffect } from "react";
import { AgGridReact } from "ag-grid-react";
import { Snackbar, Button } from "@mui/material";

import "ag-grid-community/styles/ag-grid.css"
import "ag-grid-community/styles/ag-theme-material.css"

import Addcar from './Addcar';
import Editcar from './Editcar';

function Carlist() {
    const[cars, setCars] = useState([]);
    const[open, setOpen] = useState(false);

    const [columnDefs] = useState ([
        { field: 'brand', sortable: true, filter: true },
        { field: 'model', sortable: true, filter: true },
        { field: 'color', sortable: true, filter: true },
        { field: 'fuel', sortable: true, filter: true, width: 100 },
        { field: 'year', sortable: true, filter: true, width: 100 },
        { field: 'price', sortable: true, filter: true },
        {
            cellRenderer: params => <Button size='small' onClick={() => deleteCar(params.data._links.car.href)}>Delete</Button>
        },
        {
            cellRenderer: row => <Editcar updateCar={updateCar} car={row.data} />
        }
    ])

    useEffect(() => {
        fetchCars()
    }, []);

    const fetchCars = () => {
        fetch('https://carrestapi.herokuapp.com/cars')
        .then(response => {
            if (!response.ok)
                throw new Error("Something went wrong: " + response.statusText);

            return response.json();
        })
        .then(data => setCars(data._embedded.cars))
        .catch(err => console.error(err))
    }

    const deleteCar = (url) => {
        console.log(url)
        if (window.confirm("Are you sure?")) {
            fetch(url, { method: 'DELETE' })
            .then(response => {
                if(!response.ok) {
                    throw new Error("Error in deletion: " + response.statusText)
            }
            else {
                setOpen(true);
                fetchCars();
            }
        })
        }
    }

    const saveCar = (car) => {
        fetch('https://carrestapi.herokuapp.com/cars', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(car)
        })
        .then(res => fetchCars())
        .catch(err => console.error(err))
    }

    const updateCar = (car, link) => {
        fetch(link, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(car)
        })
        .then(res => fetchCars())
        .catch(err => console.error(err))
    }

    return(
        <>
            <Addcar saveCar={saveCar} />
            <div className='ag-theme-material' style={{ width: '90%', height: 600 }}>
                <AgGridReact rowData={cars}
                    columnDefs={columnDefs}
                    pagination={true}
                    paginationAutoPageSize={true}
                />
            </div>
            <Snackbar
                open={open}
                autoHideDuration={3000}
                onClose={() => setOpen(false)}
                message="Car deleted successfully"
            />
        </>
    )
}

export default Carlist;