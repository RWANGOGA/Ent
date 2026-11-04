"use client";

import React from "react";
import { useApp } from "../../context/AppContext";
import { Header } from "../common/Header";
import { Footer } from "../common/Footer";

import { HomeView } from "./HomeView";
import { PlacementsView } from "./PlacementsView";
import { PlacementDetailView } from "./PlacementDetailView";
import { AboutView } from "./AboutView";
import { UniversitiesView } from "./UniversitiesView";
import { EmployersView } from "./EmployersView";
import { ContactView } from "./ContactView";
import { PlansView } from "./PlansView";
import { SignInView } from "./SignInView";

export function PublicSite() {
  const { route } = useApp();

  const renderContent = () => {
    switch (route) {
      case "home":
        return <HomeView />;
      case "placements":
        return <PlacementsView />;
      case "placement":
        return <PlacementDetailView />;
      case "about":
        return <AboutView />;
      case "universities":
        return <UniversitiesView />;
      case "employers":
        return <EmployersView />;
      case "contact":
        return <ContactView />;
      case "plans":
        return <PlansView />;
      case "signin":
        return <SignInView />;
      default:
        return <HomeView />;
    }
  };

  return (
    <>
      <Header />
      <main id="siteMain">{renderContent()}</main>
      <Footer />
    </>
  );
}
