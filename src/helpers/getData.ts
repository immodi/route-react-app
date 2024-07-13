import axios from "axios";
import { ColumnDef } from "@tanstack/react-table"

export interface BackendCustomer {
    id: number,
    name: string
}

export interface Customer {
    id: number,
    name: string,
    amountSpent: string | undefined
}
  
export interface Transaction {
    id: number,
    customer_id: number,
    date: string,
    amount: number
}

export interface Data {
    customers: Customer[]
    transactions: Transaction[],
}


export const customerColumns: ColumnDef<Customer>[] = [
    {
      accessorKey: "id",
      header: "ID",
      
    },
    {
      accessorKey: "name",
      header: "Name",
    },
    {
        accessorKey: "amountSpent",
        header: "Amount Spent",
    },
]

export const transactionColumns: ColumnDef<Transaction>[] = [
    {
      accessorKey: "id",
      header: "ID",
    },
    // {
    //   accessorKey: "customer_id",
    //   header: "Custimer",
    // },
    {
        accessorKey: "date",
        header: "Date",
    },
    {
        accessorKey: "amount",
        header: "Amount",
    },
]

export async function getData(setColumnType: React.Dispatch<any>, setData: React.Dispatch<any>, customerId: number | null) {
    console.clear()
    let path = `customers_data.json`
    if (customerId !== null) {
        path = `transactions_data.json`
        setColumnType(transactionColumns)
        
    } else {
        setColumnType(customerColumns)
    }

    try {
        const response = await axios.get<any>(path);
        const data = response.data;
        
      
        const finalData = customerId === null ? (
            await Promise.all((data.customers as Customer[]).map(async customer => {
                const amountSpent = await getTotalAmountSpent(customer.id, 'transactions_data.json');
                return {
                    ...customer,
                    amountSpent: amountSpent?.toString()
                };
            }))
        ) : (
            (data.transactions as Transaction[]).filter((transaction) => {                
                return transaction.customer_id === customerId
            })
        )
                
        setData(finalData)  
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

async function getTotalAmountSpent(customerId: number, path: string) {
    try {
        const response = await axios.get<any>(path);
        const data = response.data;        
        let total: number = 0;

        (data.transactions as Transaction[]).filter((transaction) => {                
            return transaction.customer_id === customerId
        }).forEach((transaction) => {                
            total += transaction.amount
        })

        
        return total

    } catch (error) {
        console.error('Error fetching data:', error);
    }    
}

export interface ChartData {
    day: string;
    amount: number;
}

export async function calculateMaxSpendingByDay(customerId: number) {
    try {
        const response = await axios.get<any>('transactions_data.json');
        const data = response.data;    

        let myData = (data.transactions as Transaction[]).filter((transaction) => {                
            return transaction.customer_id === customerId
        })

        
        
        const spendingByDay: { [key: string]: number } = {};

        myData.forEach(transaction => {
            const { date, amount } = transaction;
    
            if (!spendingByDay[date] || spendingByDay[date] < amount) {
                spendingByDay[date] = amount;
            }
        });
    
        const chartData: ChartData[] = Object.keys(spendingByDay).map(date => ({
            day: date,
            amount: spendingByDay[date]
        }));
    
        return chartData;
        
    } catch (error) {
        console.error('Error fetching data:', error);
    }    
    
}

