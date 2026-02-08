"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { UserPlus, Loader2, CheckCircle2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

import { userService, ApiErrorException } from "@/services/api/user.service";
import {
  registerUserSchema,
  type RegisterUserFormData,
} from "@/lib/validations/user.schema";

export function RegisterUserForm() {
  const { toast } = useToast();
  const [isSuccess, setIsSuccess] = useState(false);

  const form = useForm<RegisterUserFormData>({
    resolver: zodResolver(registerUserSchema),
    defaultValues: {
      name: "",
      email: "",
      phoneNumber: "",
      upiId: "",
    },
  });

  /**
   * Form submission handler
   *
   * This runs AFTER validation passes
   * react-hook-form automatically handles loading state via formState.isSubmitting
   */
  async function onSubmit(data: RegisterUserFormData) {
    try {
      setIsSuccess(false);

      // Call API
      const user = await userService.registerUser(data);

      // Show success toast
      toast({
        title: "Success! 🎉",
        description: `${user.name} registered successfully!`,
        variant: "default",
      });

      // Reset form
      form.reset();

      // Show success message
      setIsSuccess(true);

      // Hide success message after 5 seconds
      setTimeout(() => setIsSuccess(false), 5000);
    } catch (error) {
      // Type-safe error handling
      if (error instanceof ApiErrorException) {
        toast({
          title: "Registration Failed",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Registration Failed",
          description: "An unexpected error occurred. Please try again.",
          variant: "destructive",
        });
      }
    }
  }

  /**
   * react-hook-form tracks submission state automatically
   * formState.isSubmitting = true during async onSubmit
   */
  const { isSubmitting } = form.formState;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full"
    >
      <Card className="border-primary/20 shadow-lg">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl md:text-3xl flex items-center gap-2">
            <UserPlus className="h-6 w-6 md:h-7 md:w-7 text-primary" />
            Register New User
          </CardTitle>
          <CardDescription className="text-base">
            Create your EQLY-PAY account to start splitting expenses
          </CardDescription>
        </CardHeader>

        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Name Field */}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base">Full Name *</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Raj Kumar"
                        {...field}
                        disabled={isSubmitting}
                        className="h-12 text-base"
                        autoComplete="name"
                      />
                    </FormControl>
                    <FormDescription className="text-sm">
                      Your full name as you'd like it to appear
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Email Field */}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base">Email Address *</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="raj@example.com"
                        {...field}
                        disabled={isSubmitting}
                        className="h-12 text-base"
                        autoComplete="email"
                      />
                    </FormControl>
                    <FormDescription className="text-sm">
                      We'll use this for notifications
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Phone Number Field */}
              <FormField
                control={form.control}
                name="phoneNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base">Phone Number</FormLabel>
                    <FormControl>
                      <Input
                        type="tel"
                        placeholder="9876543210"
                        {...field}
                        disabled={isSubmitting}
                        className="h-12 text-base"
                        autoComplete="tel"
                        inputMode="numeric"
                        pattern="[0-9]*"
                      />
                    </FormControl>
                    <FormDescription className="text-sm">
                      10-digit mobile number (optional)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* UPI ID Field */}
              <FormField
                control={form.control}
                name="upiId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base">UPI ID</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="raj@paytm"
                        {...field}
                        disabled={isSubmitting}
                        className="h-12 text-base"
                        autoComplete="off"
                      />
                    </FormControl>
                    <FormDescription className="text-sm">
                      Your UPI ID for settlements (e.g., name@paytm)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-12 text-base font-semibold"
                size="lg"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Registering...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="mr-2 h-5 w-5" />
                    Register
                  </>
                )}
              </Button>

              {/* Success Message */}
              {isSuccess && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="p-4 bg-accent/10 border border-accent rounded-lg"
                >
                  <p className="text-accent font-medium flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5" />
                    Registration successful! Welcome aboard! 🎉
                  </p>
                </motion.div>
              )}
            </form>
          </Form>
        </CardContent>
      </Card>
    </motion.div>
  );
}
