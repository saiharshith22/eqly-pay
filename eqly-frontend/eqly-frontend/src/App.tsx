import { useState } from "react";
import { RegisterUserForm } from "@/components/forms/RegisterUserForm";
import { Toaster } from "@/components/ui/toaster";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserList } from "./components/users/UserList";

function App() {
  const [activeTab, setActiveTab] = useState("register");

  return (
    <>
      <div className="min-h-screen bg-background p-4 md:p-8">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Header */}
          <header className="text-center space-y-4 pt-8 md:pt-12">
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-primary via-primary-light to-accent bg-clip-text text-transparent animate-fade-in">
              EQLY-PAY
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground">
              Smart Expense Split & Settlement
            </p>
          </header>

          {/* Tabs for Register / View Users */}
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="register">Register User</TabsTrigger>
              <TabsTrigger value="users">View Users</TabsTrigger>
            </TabsList>

            <TabsContent value="register" className="mt-6">
              <RegisterUserForm />
            </TabsContent>

            <TabsContent value="users" className="mt-6">
              <UserList />
            </TabsContent>
          </Tabs>
        </div>
      </div>

      <Toaster />
    </>
  );
}

export default App;
