import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Search } from 'lucide-react';

// Import account structures
import accountStructure0 from '../lib/accountStructure0';
import accountStructure1 from '../lib/accountStructure1';
import accountStructure2 from '../lib/accountStructure2';
import accountStructure3 from '../lib/accountStructure3';
import accountStructure4 from '../lib/accountStructure4';
import accountStructure5 from '../lib/accountStructure5';
import accountStructure6 from '../lib/accountStructure6';
import accountStructure789 from '../lib/accountStructure789';

// Combine all account structures
const accountStructure = {
  ...accountStructure0,
  ...accountStructure1,
  ...accountStructure2,
  ...accountStructure3,
  ...accountStructure4,
  ...accountStructure5,
  ...accountStructure6,
  ...accountStructure789
};

const ChartOfAccounts = () => {
  const [searchTerm, setSearchTerm] = useState('');

  // Search in account number, name, type, and kind
  const filterAccounts = (classData, groupData, accountData, accountNum) => {
    const searchLower = searchTerm.toLowerCase();
    return !searchTerm || 
           accountNum.includes(searchTerm) ||
           accountData.name.toLowerCase().includes(searchLower) ||
           accountData.type.toLowerCase().includes(searchLower) ||
           accountData.kind.toLowerCase().includes(searchLower) ||
           classData.name.toLowerCase().includes(searchLower) ||
           groupData.name.toLowerCase().includes(searchLower);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Účtová osnova</CardTitle>
        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Hľadať účet, názov, typ alebo druh..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[600px] pr-4">
          <div className="space-y-6">
            {Object.entries(accountStructure).map(([classNum, classData]) => {
              // Skip class if no accounts match search
              const hasMatchingAccounts = Object.entries(classData.groups).some(([groupNum, groupData]) =>
                Object.entries(groupData.accounts).some(([accountNum, accountData]) =>
                  filterAccounts(classData, groupData, accountData, accountNum)
                )
              );

              if (!hasMatchingAccounts && searchTerm) return null;

              return (
                <div key={classNum} className="border rounded-lg p-4">
                  {/* Class Header */}
                  <h2 className="text-lg font-bold mb-4">
                    Účtová trieda {classNum} – {classData.name}
                  </h2>

                  {/* Groups */}
                  <div className="space-y-4 pl-4">
                    {Object.entries(classData.groups).map(([groupNum, groupData]) => {
                      // Skip group if no accounts match search
                      const hasMatchingAccountsInGroup = Object.entries(groupData.accounts).some(
                        ([accountNum, accountData]) =>
                          filterAccounts(classData, groupData, accountData, accountNum)
                      );

                      if (!hasMatchingAccountsInGroup && searchTerm) return null;

                      return (
                        <div key={groupNum} className="border-l pl-4">
                          {/* Group Header */}
                          <h3 className="text-md font-semibold mb-2">
                            {groupNum} – {groupData.name}
                          </h3>

                          {/* Accounts */}
                          <div className="space-y-1 pl-4">
                            {Object.entries(groupData.accounts).map(([accountNum, accountData]) => {
                              if (!filterAccounts(classData, groupData, accountData, accountNum)) return null;

                              // Special handling for internal accounts
                              if (accountNum === "ALL") {
                                return (
                                  <div key={accountNum} className="flex items-baseline justify-between text-sm">
                                    <span className="text-muted-foreground">
                                      Účty podľa potrieb účtovnej jednotky
                                    </span>
                                    <span className="text-sm text-muted-foreground">
                                      ({accountData.type}, {accountData.kind})
                                    </span>
                                  </div>
                                );
                              }

                              return (
                                <div key={accountNum} className="flex items-baseline justify-between hover:bg-muted/50 p-1 rounded">
                                  <div>
                                    <span className="font-mono">{accountNum}</span>
                                    <span className="mx-2">–</span>
                                    <span>{accountData.name}</span>
                                  </div>
                                  <span className="text-sm text-muted-foreground whitespace-nowrap">
                                    ({accountData.type}, {accountData.kind})
                                  </span>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default ChartOfAccounts;
