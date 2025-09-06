import { getCurrentBudget } from '@/actions/budget';
import { getUserAccounts } from '@/actions/dashboard';
import { accountSchema } from '@/app/lib/schema';
import AccountCard from '@/components/accountcard';
import CreateAccountDrawer from '@/components/create-account-drawer';
import { Card, CardContent } from '@/components/ui/card';
import { Plus } from 'lucide-react';
import React from 'react'
import BudgetProgress from './_components/budgetProgress';

const DashboardPage = async () => {
  const accounts = await getUserAccounts();
  
  const defaultAccount = accounts?.find(account => account.isDefault);
  let budgetData = null;

  if(defaultAccount){
    budgetData = await getCurrentBudget(defaultAccount.id);
  }
  return (
    <div className='px-5'>
        
        {/* Budget Progress  */}
        {defaultAccount && <BudgetProgress 
              initialBudget={budgetData?.budget}
              currentExpenses={budgetData?.currentExpenses || 0}
        />}

        {/* Overview  */}

        {/* Accounts Grid  */}
        <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
            <CreateAccountDrawer>
              <Card className='hover:shadow-md shadow-foreground hover:translate-y-1 transition-all duration-200 cursor-pointer '>
                <CardContent className="flex flex-col items-center justify-center py-2">
                  <Plus className='h-10 w-10 mb-2 mx-auto'/>
                  <p className='text-sm font-medium text-muted-foreground'>Add New Account</p>
                </CardContent>
              </Card>
            </CreateAccountDrawer>

            {accounts.length > 0 ? (
                accounts.map((account) => (
                    <AccountCard key={account.id} account={account} />
                ))
            ) : (
                <p className='text-sm font-medium text-muted-foreground'>No accounts found</p>
            )}
        </div>
    </div>
  )
}

export default DashboardPage;