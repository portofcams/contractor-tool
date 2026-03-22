"use client";

import { useState, useEffect } from "react";
import { OnboardingTour } from "./onboarding-tour";

export function OnboardingWrapper() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const done = localStorage.getItem("onboarding_complete");
    if (!done) setShow(true);
  }, []);

  if (!show) return null;

  return <OnboardingTour onComplete={() => setShow(false)} />;
}
