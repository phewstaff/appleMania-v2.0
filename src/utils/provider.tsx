"use client";

import { setupStore } from "@/store";
import React from "react";
import { Provider } from "react-redux";

function Providers({ children }: React.PropsWithChildren) {
  const store = setupStore();
  return <Provider store={store}>{children}</Provider>;
}

export default Providers;
