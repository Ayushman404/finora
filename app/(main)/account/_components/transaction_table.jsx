"use client";
import React, { useEffect, useMemo } from "react";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { format } from "date-fns";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import {
  ChevronDown,
  ChevronUp,
  Clock,
  Clock1,
  Delete,
  Edit2,
  MoreHorizontal,
  RefreshCcw,
  Search,
  Trash,
  X,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import useFetch from "@/hooks/use-fetch";
import { bulkDeleteTransactions } from "@/actions/account";
import { toast } from "sonner";
import { BarLoader } from "react-spinners";


const TransactionTable = ({ transactions }) => {


  const router = useRouter();

  const [selectedIds, setselectedIds] = React.useState([]);
  const [sortConfig, setSortConfig] = React.useState({
    field: "date",
    direction: "desc",
  });

  const [searchTerm, setSearchTerm] = React.useState("");
  const [typeFilter, setTypeFilter] = React.useState("");
  const [recurringFilter, setRecurringFilter] = React.useState("");


  const { loading: deleteLoading, fn: deleteFn, data: deleted } = useFetch(bulkDeleteTransactions);

  const handleBulkDelete = async () => {
    if(!window.confirm(`Are you sure you want to delete ${selectedIds.length} transactions?`)) {return};

    await deleteFn(selectedIds);
  }

  useEffect(() => {
    // console.log(deleted);
    if (deleted && !deleteLoading) {
      toast.error("Transactions deleted successfully");
    }
  }, [deleted, deleteLoading]);




  const filteredAndSortedTransactions = useMemo(() => {
    return transactions
      .filter((transaction) => {
        const matchesSearchTerm = transaction.description
          .toLowerCase()
          .includes(searchTerm.toLowerCase());
        const matchesTypeFilter =
          typeFilter === "" || transaction.type === typeFilter;
        const matchesRecurringFilter =
          recurringFilter === "" ||
          (recurringFilter === "recurring" && transaction.isRecurring) ||
          (recurringFilter === "non-recurring" && !transaction.isRecurring);
        return (
          matchesSearchTerm && matchesTypeFilter && matchesRecurringFilter
        );
      })
      .sort((a, b) => {
        let comparison = 0;

        switch (sortConfig.field) {
          case "date":
            comparison = new Date(a.date) - new Date(b.date);
            break;
          case "amount":
            comparison = a.amount - b.amount;
            break;
          case "category":
            comparison = a.category.localeCompare(b.category);
            break;
          default:
            comparison = 0;
          
        }
        return comparison * (sortConfig.direction === "asc" ? 1 : -1);
      });
  }, [transactions, searchTerm, typeFilter, recurringFilter, sortConfig]);



  const handleSort = (field) => {
    const direction =
      sortConfig.field === field && sortConfig.direction === "desc"
        ? "asc"
        : "desc";
    setSortConfig({ field, direction });
  };

  const handleSelect = (id) => {
    setselectedIds((current) =>
      current.includes(id) ? current.filter((i) => i != id) : [...current, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedIds.length === filteredAndSortedTransactions.length) {
      setselectedIds([]);
    } else {
      setselectedIds(filteredAndSortedTransactions.map((t) => t.id));
    }
  };


  const handleClearFilters = () => {
    setSearchTerm("");
    setTypeFilter("");
    setRecurringFilter("");
    setselectedIds([]);
  };

  return (
    <div className="space-y-4">

      {deleteLoading && <BarLoader className="mt-4" color="#9333ea" width={"100%"} />}

      {/* Filters */}

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute ml-3 mt-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search transactions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>

        <div className="flex gap-2">
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="All Types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="INCOME">Income</SelectItem>
              <SelectItem value="EXPENSE">Expense</SelectItem>
            </SelectContent>
          </Select>
          <Select value={recurringFilter} onValueChange={setRecurringFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="All Transactions" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="recurring">Recurring Only</SelectItem>
              <SelectItem value="non-recurring">Non-Recurring Only</SelectItem>
            </SelectContent>
          </Select>

          {selectedIds.length > 0 && (
            <div className="flex items-center gap-2">
              <Button
              variant="destructive"
              onClick={() => {
                handleBulkDelete(selectedIds);
              }}
            >
              <Trash />
              Delete Selected({selectedIds.length})
            </Button>
            </div>
          )}

          {(searchTerm || typeFilter || recurringFilter) && (
            <Button variant="outline" size="icon" onClick={handleClearFilters} title="Clear filters">
              <X className="h-4 w-4" />
            </Button>
          )}

        </div>
      </div>

      {/* Transactions  */}

      <div className="rounded-md">
        <Table>
          <TableCaption>A list of your recent invoices.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]">
                <Checkbox
                  onCheckedChange={handleSelectAll}
                  checked={
                    selectedIds.length === filteredAndSortedTransactions.length
                  }
                />
              </TableHead>
              <TableHead
                className="cursor-pointer"
                onClick={() => handleSort("date")}
              >
                <div className="flex items-center">
                  Date{" "}
                  {sortConfig.field == "date" &&
                    (sortConfig.direction == "asc" ? (
                      <ChevronUp className="ml-1 h-4 w-4" />
                    ) : (
                      <ChevronDown className="ml-1 h-4 w-4" />
                    ))}
                </div>
              </TableHead>
              <TableHead>Description</TableHead>
              <TableHead
                className="cursor-pointer"
                onClick={() => handleSort("category")}
              >
                <div className="flex items-center">
                  Category{" "}
                  {sortConfig.field == "category" &&
                    (sortConfig.direction == "asc" ? (
                      <ChevronUp className="ml-1 h-4 w-4" />
                    ) : (
                      <ChevronDown className="ml-1 h-4 w-4" />
                    ))}
                </div>
              </TableHead>
              <TableHead
                className="cursor-pointer"
                onClick={() => handleSort("amount")}
              >
                <div className="flex items-center">
                  Amount{" "}
                  {sortConfig.field == "amount" &&
                    (sortConfig.direction == "asc" ? (
                      <ChevronUp className="ml-1 h-4 w-4" />
                    ) : (
                      <ChevronDown className="ml-1 h-4 w-4" />
                    ))}
                </div>
              </TableHead>
              <TableHead>
                <div className="flex items-center">Recurring</div>
              </TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredAndSortedTransactions.length == 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-4">
                  No transactions found.
                </TableCell>
              </TableRow>
            ) : (
              filteredAndSortedTransactions.map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell className="w-[50px]">
                    <Checkbox
                      onCheckedChange={() => handleSelect(transaction.id)}
                      checked={selectedIds.includes(transaction.id)}
                    />
                  </TableCell>
                  <TableCell>
                    {format(new Date(transaction.date), "PP")}
                  </TableCell>
                  <TableCell>{transaction.description}</TableCell>
                  <TableCell className={"capitalize"}>
                    <span className="rounded-md bg-blue-100 dark:bg-blue-950 p-1">
                      {transaction.category}
                    </span>
                  </TableCell>
                  <TableCell
                    className={`text-left ${
                      transaction.type === "EXPENSE"
                        ? "text-red-500"
                        : "text-green-500"
                    }`}
                  >
                    {transaction.type === "EXPENSE" ? "-" : "+"}₹{" "}
                    {transaction.amount.toFixed(2)}
                  </TableCell>
                  <TableCell>
                    {transaction.isRecurring ? (
                      <Tooltip>
                        <TooltipTrigger>
                          <Badge
                            variant={"outline"}
                            className="gap-2 bg-accent-foreground text-background"
                          >
                            <RefreshCcw className="h-3 w-3" />
                            {transaction?.recurringInterval}
                          </Badge>
                        </TooltipTrigger>
                        <TooltipContent>
                          <div className="text-sm">
                            <div className="font-medium">Next Date:</div>
                            <div>
                              {format(
                                new Date(transaction?.nextRecurringDate),
                                "PP"
                              )}
                            </div>
                          </div>
                        </TooltipContent>
                      </Tooltip>
                    ) : (
                      <Badge variant={"outline"} className="gap-2">
                        <Clock className="h-3 w-3" />
                        One-time
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="w-[50px]">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="cursor-pointer">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent sideOffset={2}>
                        <DropdownMenuItem
                          onClick={() =>
                            router.push(
                              `/transaction/create?edit=${transaction.id}`
                            )
                          }
                        >
                          <div className="flex items-center justify-between gap-3">
                            <Edit2 /> Edit
                          </div>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={()=>deleteFn([transaction.id])}>
                          <div className="flex items-center justify-between text-red-500 gap-3">
                            <Trash className="text-red-500" /> Delete
                          </div>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default TransactionTable;
