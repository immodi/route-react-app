import './styles/App.css'
import { useEffect, useState } from "react"
import {Customer, Transaction, customerColumns, getData} from "./helpers/getData" 
import { DataTable } from './components/Table';
import { ColumnDef } from '@tanstack/react-table';



const App = () => {
    const [data, setData] = useState<Customer[] | Transaction[]>([]);
    const [columns, setColumns] = useState<ColumnDef<any>[]>(customerColumns);

    
    useEffect(() => {
        getData(setColumns, setData, null);
    }, []);

    return (
        <div className="container flex justify-center items-start p-10 h-auto">
            <DataTable columns={columns} data={data} setData={setData} setColumnType={setColumns} />
        </div>
    );
};


export default App
