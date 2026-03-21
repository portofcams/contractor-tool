import { Card, CardContent } from "@/components/ui/card";

export default async function PaymentSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ invoice?: string }>;
}) {
  const { invoice } = await searchParams;

  return (
    <div className="min-h-screen bg-[#0f172a] flex items-center justify-center p-4">
      <Card className="max-w-md w-full">
        <CardContent className="pt-8 pb-8 text-center space-y-4">
          <div className="text-5xl">&#10003;</div>
          <h1 className="text-2xl font-bold text-green-400">Payment Successful</h1>
          <p className="text-muted-foreground">
            Thank you! Your payment{invoice ? ` for invoice ${invoice}` : ""} has been received.
          </p>
          <p className="text-sm text-muted-foreground">
            You will receive a confirmation email shortly.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
