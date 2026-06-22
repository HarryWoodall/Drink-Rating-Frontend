import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Link } from "react-router-dom";

export type FormPageProps = {
  title: string;
  description?: string;
  children: React.ReactNode;
};

export function FormPage({ title, description, children }: FormPageProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-transparent px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <Link
            to="/"
            className="font-serif text-3xl italic font-semibold tracking-tight no-underline"
          >
            Night<span className="text-amber">cap</span>
          </Link>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="font-serif text-2xl italic">
              {title}
            </CardTitle>
            {description ? (
              <CardDescription>{description}</CardDescription>
            ) : null}
          </CardHeader>

          {children}
        </Card>
      </div>
    </div>
  );
}
