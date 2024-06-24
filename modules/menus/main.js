import PowerMenu from "./power/index.js";
import Verification from "./power/verification.js";
import AudioMenu from "./audio/index.js";
import NetworkMenu from "./network/index.js";
import BluetoothMenu from "./bluetooth/index.js";
import MediaMenu from "./media/index.js";
import NotificationsMenu from "./notifications/index.js";

export default [PowerMenu(), Verification(), AudioMenu(), NetworkMenu(), BluetoothMenu(), MediaMenu(), NotificationsMenu()];
