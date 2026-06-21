import { describe, expect, it } from "vitest";
import { resolveLanguage, t } from "./i18n";

describe("i18n", () => {
  it("uses the manual language before Home Assistant language", () => {
    expect(resolveLanguage("fr", "es-ES")).toBe("fr");
    expect(t("fr", "currentConsumption")).toBe("Consommation actuelle");
  });

  it("detects the Home Assistant base language and falls back to English", () => {
    expect(resolveLanguage("auto", "es-ES")).toBe("es");
    expect(resolveLanguage("auto", "pt-BR")).toBe("en");
    expect(t("es", "restPrefix")).toBe("Resto");
  });
});
