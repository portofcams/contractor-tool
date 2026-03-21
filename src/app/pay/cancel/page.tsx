import { Card, CardContent } from "@/components/ui/card";

export default function PaymentCancelPage() {
  return (
    <div className="min-h-screen bg-[#0f172a] flex items-center justify-center p-4">
      <Card className="max-w-md w-full">
        <CardContent className="pt-8 pb-8 text-center space-y-4">
          <div className="text-5xl">&#10007;</div>
          <h1 className="text-2xl font-bold">Payment Cancelled</h1>
          <p className="text-muted-foreground">
            Your payment was not processed. You can try again using the payment link provided by your contractor.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
