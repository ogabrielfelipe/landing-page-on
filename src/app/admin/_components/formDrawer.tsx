import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";

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
      <DrawerContent className="h-screen w-[580px] overflow-y-auto overflow-x-hidden">
        <DrawerHeader>
          <DrawerTitle>{title}</DrawerTitle>
          <DrawerDescription>{description}</DrawerDescription>
        </DrawerHeader>
        {children}
      </DrawerContent>
    </Drawer>
  );
}
