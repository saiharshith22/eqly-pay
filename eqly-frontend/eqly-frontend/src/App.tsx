import { RegisterUserForm } from "@/components/forms/RegisterUserForm";
import { Toaster } from "@/components/ui/toaster";

function App() {
  return (
    <>
      {/* Main Content */}
      <div className="min-h-screen bg-background p-4 md:p-8">
        <div className="max-w-2xl mx-auto space-y-8">
          {/* Header */}
          <header className="text-center space-y-4 pt-8 md:pt-12">
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-primary via-primary-light to-accent bg-clip-text text-transparent animate-fade-in">
              EQLY-PAY
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground">
              Smart Expense Split & Settlement
            </p>
          </header>

          {/* Registration Form */}
          <RegisterUserForm />
        </div>
      </div>

      {/* Toast Notifications */}
      <Toaster />
    </>
  );
}

export default App;
