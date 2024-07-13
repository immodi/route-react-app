"use client"

import * as React from "react"

import { Button } from "../components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu"

interface State {
    table: any,
    position: string,
    setPosition: React.Dispatch<any>
}

export const DropdownMenuRadio: React.FC<State> = ({table, position, setPosition}) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">Filter By</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        {/* <DropdownMenuLabel>Panel Position</DropdownMenuLabel> */}
        <DropdownMenuSeparator />
        <DropdownMenuRadioGroup value={position} onValueChange={(value) => {
            setPosition(value)
            table.getColumn(position)?.setFilterValue("")
        }}>
          <DropdownMenuRadioItem value="name">Name</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="amountSpent">Amount</DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
