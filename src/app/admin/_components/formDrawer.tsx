import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { PlusCircle } from "lucide-react";

interface FormDrawerProps {
  drawerOpen: boolean;
  setDrawerOpen: (open: boolean) => void;

  description: string;
  title: string;
  children: React.ReactNode;
}

export default function FormDrawer({
  drawerOpen,
  setDrawerOpen,
  description,
  title,
  children,
}: FormDrawerProps) {
  return (
    <Drawer open={drawerOpen} direction="right" onOpenChange={setDrawerOpen}>
      <DrawerContent className="min-h-screen w-[480px]">
        <DrawerHeader>
          <DrawerTitle>{title}</DrawerTitle>
          <DrawerDescription>{description}</DrawerDescription>
        </DrawerHeader>
        {children}
      </DrawerContent>
    </Drawer>
  );
}
