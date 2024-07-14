"use client"
 
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
  getFilteredRowModel,
  ColumnFiltersState,
} from "@tanstack/react-table"
import {Customer, getData, transactionColumns} from "../helpers/getData"
import HomeIcon from "../assets/home.svg";

import { Button } from "./ui/button"
import { Input } from "./ui/input"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table"
import { useState } from "react";
import { DropdownMenuRadio } from "./DropMenu";
import { Chart } from "./Chart";
 
interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[],
  setColumnType: React.Dispatch<any>,
  setData: React.Dispatch<any>,
}


export type PaginationState = {
    pageIndex: number
    pageSize: number
}

export function DataTable<TData, TValue>({
    columns,
    data,
    setColumnType,
    setData
  }: DataTableProps<TData, TValue>) {
    const [pagination, setPagination] = useState<PaginationState>({ pageIndex: 0, pageSize: 10 }); // Initialize with both pageIndex and pageSize
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        onColumnFiltersChange: setColumnFilters,
        onPaginationChange: setPagination,
        getFilteredRowModel: getFilteredRowModel(),
        state: {
        columnFilters,
        pagination,
    },
    })

    const [costumer, setCostumer] = useState<Customer>()
    const [position, setPosition] = useState("name")

    const dataType: string | undefined = getType(data)    

    return (
        <div className="w-full min-h-screen flex flex-col justify-around align-middle items-center">
            <div className="max-w-5xl w-full bg-white shadow-md rounded-lg overflow-hidden">
                {(dataType === 'customers') && (
                    <div className="flex items-center justify-between py-4">
                        <Input
                        placeholder={`Filter ${position}...`}
                        value= {
                            ((table.getColumn(position)?.getFilterValue() as string) ?? "")
                        }
                        onChange={(event) =>                        
                            table.getColumn(position)?.setFilterValue((event.target.value))
                        }
                        className="max-w-sm relative left-5"
                        />
                        <div className="relative scale-90 right-5">
                            <DropdownMenuRadio table={table} position={position} setPosition={setPosition}/>
                            <Button className="m-3" onClick={() => {table.getColumn(position)?.setFilterValue("")}}>Clear Filter</Button>
                        </div>
                    </div>
                )}
                <h2 className="text-2xl flex content-between items-center justify-between font-bold px-6 py-4 bg-gray-100 border-b border-gray-200">
                    {
                        (dataType === 'customers') ? (
                            "Customers List"
                        ) : (
                            costumer ? `${costumer.name}'s Transactions List` : "Loading...."
                        )
                    }
                    <img src={HomeIcon} alt="HomeIcon" className="w-10 h-10 cursor-pointer" onClick={
                        () => {
                            dataType !== 'customers' && getData(setColumnType, setData, null)
                        }
                    }/>
                </h2>
                <div>
                    <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                        <TableRow key={headerGroup.id}>
                            {headerGroup.headers.map((header) => {
                            return (
                                <TableHead key={header.id}>
                                {header.isPlaceholder
                                    ? null
                                    : flexRender(
                                        header.column.columnDef.header,
                                        header.getContext()
                                    )}
                                </TableHead>
                            )
                            })}
                        </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                        table.getRowModel().rows.map((row) => (
                            <TableRow
                            key={row.id}
                            data-state={row.getIsSelected() && "selected"}
                            onClick={
                                () => {
                                    dataType === 'customers' && (() => {
                                        getData(setColumnType, setData, (row.getAllCells()[0].getContext().getValue() as number))
                                        setCostumer({
                                            id: (row.getAllCells()[0].getContext().getValue() as number),
                                            name: (row.getAllCells()[1].getContext().getValue() as string),
                                            amountSpent: (row.getAllCells()[2].getContext().getValue() as string)
                                        } as Customer)                                    
                                        setColumnType(transactionColumns)                                    
                                    })()
                                }
                            }
                            >
                            {row.getVisibleCells().map((cell) => (
                                <TableCell key={cell.id} >
                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                </TableCell>
                            ))}
                            </TableRow>
                        ))
                        ) : (
                        <TableRow>
                            <TableCell colSpan={columns.length} className="h-24 text-center">
                            No results.
                            </TableCell>
                        </TableRow>
                        )}
                    </TableBody>
                    </Table>
                </div>
                <div className="flex items-center justify-between space-x-2 p-5">
                    <Button
                    variant="outline"
                    size="sm"
                    onClick={() => table.previousPage()}
                    disabled={!table.getCanPreviousPage()}
                    >
                    Previous
                    </Button>
                    <Button
                    variant="outline"
                    size="sm"
                    onClick={() => table.nextPage()}
                    disabled={!table.getCanNextPage()}
                    >
                    Next
                    </Button>
                </div>
            </div>

            {
                dataType === 'transactions'
                && 
                <div className="max-w-5xl">
                    
                    <Chart name={costumer?.name} customerId={costumer?.id} />
                </div>
            }
        </div>
    )
}

function getType(data: any[]): string | undefined {
    if (data === null) {
        return undefined
    } else if (Array.isArray(data) && data.length > 0 && 'name' in data[0]) {
        return 'customers'
    } else if (Array.isArray(data) && data.length > 0 && 'amount' in data[0]) {
        return 'transactions'
    } else {
        return undefined
    }
}
