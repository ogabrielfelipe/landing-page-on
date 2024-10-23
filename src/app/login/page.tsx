"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import Image from "next/image";
import { signIn } from "next-auth/react";

import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { toast } = useToast();
  const router = useRouter();

  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const res = await signIn("credentials", {
      email: email,
      password: password,
      redirect: false,
    });

    let success = false;

    try {
      await signIn("credentials", {
        email: email,
        password: password,
        redirect: false,
      });
      success = true;
    } catch (error) {
      console.error("Failed", error);
      toast({
        title: "Falha ao realizar login",
        description: "Por favor, verifique seu email e senha.",
        variant: "destructive",
      });
      success = false;
    } finally {
      if (success) {
        router.push("/admin");
      }
    }

    return res;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-50">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <Image
            src="/landingpage-on-logo.svg"
            alt="Logo with name LadingPage.on"
            width={300}
            height={150}
            className="mx-auto"
          />
          <CardTitle className="text-4xl font-bold text-center">
            Login
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="m@example.com"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <form className="space-y-2" onSubmit={handleSubmit}>
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="********"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showPassword ? (
                  <EyeOffIcon className="h-5 w-5" />
                ) : (
                  <EyeIcon className="h-5 w-5" />
                )}
              </button>
            </div>
            <Button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
            >
              Entrar
            </Button>
          </form>
        </CardContent>
        <CardFooter className="text-center pb-4">
          <a href="#" className="text-sm text-blue-600 hover:underline">
            Forgot password?
          </a>
        </CardFooter>
      </Card>
    </div>
  );
}
