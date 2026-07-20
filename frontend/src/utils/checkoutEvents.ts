export const CHECKOUT_EVENT = "pdftwin:checkout";

export function openCheckout(): void {
  window.dispatchEvent(new CustomEvent(CHECKOUT_EVENT));
}
