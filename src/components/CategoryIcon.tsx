import {
  Map,
  Utensils,
  Heart,
  Wrench,
  Building,
  ShoppingBag,
  Car,
  Home,
} from "lucide-react";
import { cn } from "@/lib/utils";

type IconName = keyof typeof icons;

const icons = {
  map: Map,
  utensils: Utensils,
  heart: Heart,
  wrench: Wrench,
  building: Building,
  "shopping-bag": ShoppingBag,
  car: Car,
  home: Home,
};

interface CategoryIconProps {
  icon?: string;
  className?: string;
}

export function CategoryIcon({ icon = "map", className }: CategoryIconProps) {
  const Icon = icons[icon as IconName] || Map;
  
  return <Icon className={cn("", className)} />;
}