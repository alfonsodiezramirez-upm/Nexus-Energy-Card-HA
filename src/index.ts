import "./nexus-energy-card";
import "./nexus-energy-card-editor";

declare global {
  interface Window {
    customCards?: Array<Record<string, unknown>>;
  }
}

window.customCards = window.customCards ?? [];
window.customCards.push({
  type: "nexus-energy-card",
  name: "Nexus Energy Card",
  description: "Advanced hierarchical energy and power flow map with collapsible nodes."
});
