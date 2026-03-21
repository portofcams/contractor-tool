import { Capacitor } from "@capacitor/core";
import { Haptics, ImpactStyle, NotificationType } from "@capacitor/haptics";

const isNative = Capacitor.isNativePlatform();

/** Light tap — button press, selection change */
export async function tapLight() {
  if (!isNative) return;
  await Haptics.impact({ style: ImpactStyle.Light });
}

/** Medium tap — save, confirm */
export async function tapMedium() {
  if (!isNative) return;
  await Haptics.impact({ style: ImpactStyle.Medium });
}

/** Heavy tap — delete, important action */
export async function tapHeavy() {
  if (!isNative) return;
  await Haptics.impact({ style: ImpactStyle.Heavy });
}

/** Success — quote created, saved, sent */
export async function notifySuccess() {
  if (!isNative) return;
  await Haptics.notification({ type: NotificationType.Success });
}

/** Error — validation failure, network error */
export async function notifyError() {
  if (!isNative) return;
  await Haptics.notification({ type: NotificationType.Error });
}

/** Warning — approaching limit, unsaved changes */
export async function notifyWarning() {
  if (!isNative) return;
  await Haptics.notification({ type: NotificationType.Warning });
}
